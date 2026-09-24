const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Internship'] },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Links job to a Recruiter
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);