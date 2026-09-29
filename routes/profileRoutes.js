const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get My Profile
router.get('/profile', isAuthenticated, profileController.getProfile);

// Get Edit Profile Page
router.get('/profile/edit', isAuthenticated, profileController.getEditProfile);

// Post Edit Profile Form
router.post('/profile/edit', isAuthenticated, profileController.updateProfile);

// Get Public Candidate Profile (For Recruiters)
router.get('/profile/:id', isAuthenticated, profileController.getPublicProfile);

// Upload Resume
router.post('/profile/upload', isAuthenticated, upload.single('resume'), profileController.uploadResume);

module.exports = router;