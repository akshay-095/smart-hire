const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Show Job Application Form
exports.getApplyForm = async (req, res) => {
    try {
        if (req.session.user.role !== 'seeker') {
            return res.status(403).send("Only Job Seekers can apply for jobs.");
        }

        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).send("Job not found");
        }

        const user = await User.findById(req.session.user.id);

        // Check if candidate uploaded a resume (if required by job)
        const hasResume = user.resume && user.resume.trim() !== '' && user.resume !== 'undefined';
        if (job.resumeRequired && !hasResume) {
            return res.redirect('/profile');
        }
        
        res.render('apply-job', { job, user, error: null });
    } catch (error) {
        console.error("Error loading application form:", error);
        res.status(500).send("Server error loading application form");
    }
};

// Handle Application Submission
exports.postApplyJob = async (req, res) => {
    try {
        if (req.session.user.role !== 'seeker') {
            return res.status(403).send("Only Job Seekers can apply for jobs.");
        }

        const jobId = req.params.id;
        const { githubUrl, coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).send("Job not found");
        }

        const user = await User.findById(req.session.user.id);
        
        const hasResume = user.resume && user.resume.trim() !== '' && user.resume !== 'undefined';

        // Block submission if resume is required but missing
        if (job.resumeRequired && !hasResume) {
            return res.redirect('/profile');
        }

        // Create new application record (ALWAYS attach user.resume if present)
        const newApplication = new Application({
            job: job._id,
            applicant: user._id,
            recruiter: job.postedBy,
            resume: user.resume || '', // Always attach user's resume if it exists
            githubUrl: githubUrl || '',
            coverLetter: coverLetter || ''
        });

        await newApplication.save();

        // TRIGGER NOTIFICATION: Inform recruiter of new applicant
        await Notification.create({
            recipient: job.postedBy,
            sender: user._id,
            message: `New Application: ${user.name} applied for "${job.title}"`,
            link: `/jobs/${job._id}/applicants`
        });

        res.redirect('/my-applications');
    } catch (error) {
        if (error.code === 11000) {
            // User already applied to this job
            return res.redirect('/my-applications');
        }
        console.error("Error submitting application:", error);
        res.status(500).send("Server error submitting application");
    }
};

// Job Seeker: View My Submitted Applications
exports.getMyApplications = async (req, res) => {
    try {
        if (req.session.user.role !== 'seeker') {
            return res.status(403).send("Access restricted to Job Seekers.");
        }

        const applications = await Application.find({ applicant: req.session.user.id })
            .populate('job')
            .sort({ appliedAt: -1 });

        res.render('my-applications', { applications });
    } catch (error) {
        console.error("Error loading applications:", error);
        res.status(500).send("Server error loading applications");
    }
};

// Recruiter: View Applicants for a specific job
exports.getJobApplicants = async (req, res) => {
    try {
        if (req.session.user.role !== 'recruiter') {
            return res.status(403).send("Access restricted to Recruiters.");
        }

        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job || job.postedBy.toString() !== req.session.user.id) {
            return res.status(403).send("Unauthorized to view these applications.");
        }

        const applications = await Application.find({ job: jobId })
            .populate('applicant', 'name email resume') 
            .sort({ appliedAt: -1 });

        res.render('job-applicants', { job, applications });
    } catch (error) {
        console.error("Error loading applicants:", error);
        res.status(500).send("Server error loading applicants");
    }
};

// Recruiter: Update Application Status
exports.updateApplicationStatus = async (req, res) => {
    try {
        if (req.session.user.role !== 'recruiter') {
            return res.status(403).send("Access restricted to Recruiters.");
        }

        const { status } = req.body;
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId);
        
        if (!application || application.recruiter.toString() !== req.session.user.id) {
            return res.status(403).send("Unauthorized to update this application.");
        }

        application.status = status;
        await application.save();

        const job = await Job.findById(application.job);
        await Notification.create({
            recipient: application.applicant,
            sender: req.session.user.id,
            message: `Status Update: Your application for "${job ? job.title : 'Job'}" was updated to "${status}"`,
            link: `/my-applications`
        });

        res.redirect(`/jobs/${application.job}/applicants`);
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).send("Server error updating application status");
    }
};

// Job Seeker: Cancel / Withdraw Application
exports.deleteApplication = async (req, res) => {
    try {
        if (req.session.user.role !== 'seeker') {
            return res.status(403).send("Only Job Seekers can cancel applications.");
        }

        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);

        if (!application || application.applicant.toString() !== req.session.user.id) {
            return res.status(403).send("Unauthorized to cancel this application.");
        }

        await Application.findByIdAndDelete(applicationId);
        res.redirect('/my-applications');
    } catch (error) {
        console.error("Error cancelling application:", error);
        res.status(500).send("Server error cancelling application");
    }
};