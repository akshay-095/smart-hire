const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// Show Job Application Form
exports.getApplyForm = async (req, res) => {
    try {
        // Ensure user is a job seeker
        if (req.session.user.role !== 'seeker') {
            return res.status(403).send("Only Job Seekers can apply for jobs.");
        }

        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).send("Job not found");
        }

        // Check if candidate uploaded a resume
        const user = await User.findById(req.session.user.id);
        if (!user.resume) {
            return res.render('profile', { 
                user, 
                error: "You must upload a resume before applying to jobs." 
            });
        }

        // Check if candidate already applied to this job
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.session.user.id
        });

        if (existingApplication) {
            return res.redirect('/my-applications');
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
        if (!user.resume) {
            return res.redirect('/profile');
        }

        // Create new application record
        const newApplication = new Application({
            job: job._id,
            applicant: user._id,
            recruiter: job.postedBy,
            resume: user.resume,
            githubUrl: githubUrl || '',
            coverLetter: coverLetter || ''
        });

        await newApplication.save();
        res.redirect('/my-applications');
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error from MongoDB compound index
            return res.redirect('/my-applications');
        }
        console.error("Error submitting application:", error);
        res.status(500).send("Server error submitting application");
    }
};

// View Job Seeker's Applied Jobs Dashboard
exports.getMyApplications = async (req, res) => {
    try {
        if (req.session.user.role !== 'seeker') {
            return res.status(403).send("Access restricted to Job Seekers.");
        }

        // Fetch applications and populate linked job details
        const applications = await Application.find({ applicant: req.session.user.id })
            .populate('job')
            .sort({ appliedAt: -1 });

        res.render('my-applications', { applications });
    } catch (error) {
        console.error("Error loading applications:", error);
        res.status(500).send("Server error loading applications");
    }
};