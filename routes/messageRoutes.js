const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/applications/:id/chat', isAuthenticated, messageController.getChat);
router.post('/applications/:id/chat', isAuthenticated, messageController.sendMessage);

module.exports = router;