const Notification = require('../models/Notification');

// View all notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.session.user.id })
            .sort({ createdAt: -1 });

        res.render('notifications', { notifications });
    } catch (error) {
        console.error("Error loading notifications:", error);
        res.status(500).send("Server error loading notifications");
    }
};

// Mark single notification as read and redirect to target page
exports.readNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification && notification.recipient.toString() === req.session.user.id) {
            notification.isRead = true;
            await notification.save();
            return res.redirect(notification.link);
        }
        res.redirect('/notifications');
    } catch (error) {
        console.error("Error opening notification:", error);
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