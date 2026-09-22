// Check if user is logged in
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // User is logged in, proceed to the requested page
    }
    res.redirect('/login'); // Not logged in, send to login page
};