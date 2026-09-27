const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    resumeRequired: { type: Boolean, default: true }, // NEW FIELD
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);