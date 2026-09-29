const Job = require('../models/Job');
const Application = require('../models/Application');

// Get all jobs with search and filter support
exports.getAllJobs = async (req, res) => {
    try {
        const { q, location, type } = req.query;
        let queryFilter = {};

        if (q) {
            queryFilter.$or = [
                { title: { $regex: q, $options: 'i' } },
                { company: { $regex: q, $options: 'i' } }
            ];
        }

        if (location) {
            queryFilter.location = { $regex: location, $options: 'i' };
        }

        if (type && type !== 'All') {
            queryFilter.type = type;
        }

        const jobs = await Job.find(queryFilter).sort({ createdAt: -1 });

        res.render('jobs', { 
            title: 'Browse Jobs', 
            jobs, 
            searchQuery: req.query 
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).send("Server error loading jobs");
    }
};

// Recruiter: View Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const myJobs = await Job.find({ postedBy: req.session.user.id })
                                .sort({ createdAt: -1 })
                                .lean();

        for (let job of myJobs) {
            const applicantCount = await Application.countDocuments({ job: job._id });
            job.applicantCount = applicantCount;
        }

        res.render('dashboard', { jobs: myJobs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error loading dashboard");
    }
};

// Recruiter: Show Create Job Form
exports.getCreateJob = (req, res) => {
    res.render('create-job');
};

// Recruiter: Submit New Job Form
exports.postCreateJob = async (req, res) => {
    try {
        const { title, company, location, type, salary, description } = req.body;
        const isResumeRequired = req.body.resumeRequired === 'on';

        const newJob = new Job({
            title,
            company,
            location,
            type,
            description,
            salary,
            resumeRequired: isResumeRequired,
            postedBy: req.session.user.id
        });

        await newJob.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).send("Server error");
    }
};

// Recruiter: Delete a Job
exports.deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).send("Job not found");
        }

        if (job.postedBy && job.postedBy.toString() !== req.session.user.id) {
            return res.status(403).send("Unauthorized to delete this job");
        }

        await Job.findByIdAndDelete(jobId);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error deleting job");
    }
};

// Recruiter: Show Edit Job Form
exports.getEditJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job || job.postedBy.toString() !== req.session.user.id) {
            return res.status(403).send("Unauthorized to edit this job");
        }

        res.render('edit-job', { job });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error loading edit form");
    }
};

// Recruiter: Submit Edit Job Form
exports.postEditJob = async (req, res) => {
    try {
        const { title, company, location, type, salary, description } = req.body;
        const resumeRequired = req.body.resumeRequired === 'on';

        const job = await Job.findById(req.params.id);

        if (!job || job.postedBy.toString() !== req.session.user.id) {
            return res.status(403).send("Unauthorized to edit this job");
        }

        await Job.findByIdAndUpdate(req.params.id, {
            title, company, location, type, salary, description, resumeRequired
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error updating job");
    }
};