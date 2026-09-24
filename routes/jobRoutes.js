const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { isAuthenticated, isRecruiter } = require('../middleware/authMiddleware');

// Public Route
router.get('/jobs', jobController.getAllJobs);

// Recruiter Protected Routes
router.get('/dashboard', isAuthenticated, isRecruiter, jobController.getDashboard);
router.get('/jobs/create', isAuthenticated, isRecruiter, jobController.getCreateJob);
router.post('/jobs/create', isAuthenticated, isRecruiter, jobController.postCreateJob);
router.post('/jobs/delete/:id', isAuthenticated, isRecruiter, jobController.deleteJob);

module.exports = router;