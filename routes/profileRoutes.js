const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get Profile Page
router.get('/profile', isAuthenticated, profileController.getProfile);

// Post File Upload (Using multer's upload.single middleware)
router.post('/profile/upload', isAuthenticated, upload.single('resume'), profileController.uploadResume);

module.exports = router;