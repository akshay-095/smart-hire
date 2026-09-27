const Job = require('../models/Job');
const Application = require('../models/Application');
// Public: View All Jobs (Public Job Board)
// Public: View All Jobs (With Backend Search & Filtering)
exports.getAllJobs = async (req, res) => {
    try {
        const { search, location } = req.query;
        let query = {};

        // If user entered a search term (Title, Company, or Description)
        if (search && search.trim() !== '') {
            query.$or = [
                { title: { $regex: search.trim(), $options: 'i' } },
                { company: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        // If user entered a location (e.g., Bengaluru, Mumbai)
        if (location && location.trim() !== '') {
            query.location = { $regex: location.trim(), $options: 'i' };
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        
        res.render('jobs', { 
            jobs: jobs, 
            searchQuery: search || '', 
            locationQuery: location || '' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error while fetching jobs");
    }
};

// Recruiter: View Dashboard
// Recruiter: View Dashboard
exports.getDashboard = async (req, res) => {
    try {
        // Use .lean() to convert Mongoose documents to plain JS objects so we can modify them
        const myJobs = await Job.find({ postedBy: req.session.user.id })
                                .sort({ createdAt: -1 })
                                .lean();

        // Loop through jobs and count the applications for each one
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
        
        // NEW: Check if the checkbox was checked ('on' means true, otherwise false)
        const resumeRequired = req.body.resumeRequired === 'on'; 

        const newJob = new Job({
            title,
            company,
            location,
            type,
            salary,
            description,
            resumeRequired, // NEW: Save this preference to the database
            postedBy: req.session.user.id // Attach recruiter ID
        });

        await newJob.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error creating job posting");
    }
};

// Recruiter: Delete a Job
exports.deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Ensure the job exists and belongs to the logged-in recruiter
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
        
        // Ensure job exists and belongs to this recruiter
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