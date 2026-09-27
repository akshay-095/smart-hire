const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { isAuthenticated, isRecruiter } = require('../middleware/authMiddleware'); // Added isRecruiter

// Job Seeker Application Routes
router.get('/jobs/:id/apply', isAuthenticated, applicationController.getApplyForm);
router.post('/jobs/:id/apply', isAuthenticated, applicationController.postApplyJob);
router.get('/my-applications', isAuthenticated, applicationController.getMyApplications);

// Recruiter Application Routes
router.get('/jobs/:id/applicants', isAuthenticated, isRecruiter, applicationController.getJobApplicants);
router.post('/applications/:id/status', isAuthenticated, isRecruiter, applicationController.updateApplicationStatus);
router.post('/applications/:id/cancel', isAuthenticated, applicationController.deleteApplication);
module.exports = router;