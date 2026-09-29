const Notification = require('../models/Notification');

// Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.session.user.id })
            .sort({ createdAt: -1 });

        res.render('notifications', { notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).send("Server error fetching notifications");
    }
};

// Mark single notification as read
exports.readNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);

        if (notification && notification.recipient.toString() === req.session.user.id) {
            notification.isRead = true;
            await notification.save();
            return res.redirect(notification.link || '/notifications');
        }

        res.redirect('/notifications');
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).send("Server error");
    }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.session.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.redirect('/notifications');
    } catch (error) {
        console.error("Error marking all read:", error);
        res.status(500).send("Server error");
    }
};

// Delete a single notification
exports.deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        
        await Notification.findOneAndDelete({ 
            _id: notificationId, 
            recipient: req.session.user.id 
        });

        // Redirect explicitly to the notifications page instead of 'back'
        res.redirect('/notifications');
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).send("Server error deleting notification");
    }
};