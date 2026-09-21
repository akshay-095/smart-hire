const mongoose = require('mongoose');

// Define the blueprint (Schema) for a Job
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Internship'] },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now } // Automatically saves when the job was posted
});

// Compile and export the model
module.exports = mongoose.model('Job', jobSchema);