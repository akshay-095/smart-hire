const Notification = require('../models/Notification');

module.exports = async (req, res, next) => {
    if (req.session && req.session.user) {
        try {
            const unreadCount = await Notification.countDocuments({
                recipient: req.session.user.id,
                isRead: false
            });
            res.locals.unreadCount = unreadCount;
        } catch (err) {
            console.error("Error fetching notification count:", err);
            res.locals.unreadCount = 0;
        }
    } else {
        res.locals.unreadCount = 0;
    }
    next();
};