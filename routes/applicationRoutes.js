const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Application Form View and Submission
router.get('/jobs/:id/apply', isAuthenticated, applicationController.getApplyForm);
router.post('/jobs/:id/apply', isAuthenticated, applicationController.postApplyJob);

// Seeker Applications Dashboard
router.get('/my-applications', isAuthenticated, applicationController.getMyApplications);

module.exports = router;