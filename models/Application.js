const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    applicant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    recruiter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    resume: { 
        type: String, 
        required: true 
    },
    githubUrl: { 
        type: String, 
        default: '' 
    },
    coverLetter: { 
        type: String, 
        default: '' 
    },
    status: {
        type: String,
        enum: [
            'Submitted', 
            'Under Review', 
            'Shortlisted', 
            'Interview Scheduled', 
            'Additional Information Requested', 
            'Selected', 
            'Rejected', 
            'Withdrawn'
        ],
        default: 'Submitted'
    },
    appliedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Enforce single application per candidate per job at database level
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);