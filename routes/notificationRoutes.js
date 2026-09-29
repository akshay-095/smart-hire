const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/notifications', isAuthenticated, notificationController.getNotifications);
router.get('/notifications/:id/read', isAuthenticated, notificationController.readNotification);
router.post('/notifications/mark-all-read', isAuthenticated, notificationController.markAllAsRead);

// Delete single notification
router.post('/notifications/:id/delete', isAuthenticated, notificationController.deleteNotification);

module.exports = router;