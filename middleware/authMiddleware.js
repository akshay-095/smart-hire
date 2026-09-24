// Check if user is logged in
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Check if logged-in user is a Recruiter
exports.isRecruiter = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'recruiter') {
        return next();
    }
    res.status(403).send("Access Denied: Only users registered as Recruiters can access this page.");
};