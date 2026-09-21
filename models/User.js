const mongoose = require('mongoose');

// Define the blueprint for a User (Job Seeker or Recruiter)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['seeker', 'recruiter', 'admin'], default: 'seeker' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);