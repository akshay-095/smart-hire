const User = require('../models/User');

// Render the Profile Page
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render('profile', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error loading profile");
    }
};

// Handle Resume Upload
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("Please select a file to upload.");
        }

        // Update the user's document in MongoDB with the file path
        const resumePath = '/uploads/' + req.file.filename;
        await User.findByIdAndUpdate(req.session.user.id, { resume: resumePath });

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error uploading resume");
    }
};