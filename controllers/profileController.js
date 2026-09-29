const User = require('../models/User');

// View profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render('profile', { user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send("Server error loading profile");
    }
};

// Render edit profile form
exports.getEditProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render('edit-profile', { user });
    } catch (error) {
        console.error("Error loading edit page:", error);
        res.status(500).send("Server error loading edit page");
    }
};

// Handle profile update
exports.updateProfile = async (req, res) => {
    try {
        const { headline, bio, location, phone, skills, experience, education } = req.body;
        
        // Convert comma-separated skills string into an array of trimmed tags
        const skillsArray = skills 
            ? skills.split(',').map(s => s.trim()).filter(Boolean) 
            : [];

        await User.findByIdAndUpdate(req.session.user.id, {
            headline,
            bio,
            location,
            phone,
            skills: skillsArray,
            experience,
            education
        });

        res.redirect('/profile');
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Server error updating profile");
    }
};

// View candidate profile by ID (Recruiter View)
exports.getPublicProfile = async (req, res) => {
    try {
        const candidate = await User.findById(req.params.id);
        if (!candidate) {
            return res.status(404).send("Candidate profile not found");
        }
        res.render('public-profile', { candidate });
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        res.status(500).send("Server error loading profile");
    }
};

// Handle Resume Upload
exports.uploadResume = async (req, res) => {
    try {
        console.log("1. Multer received file:", req.file); // Debug log

        if (!req.file) {
            return res.status(400).send("No file uploaded. Please select a PDF.");
        }

        // Update the user's resume field in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.id, 
            { resume: req.file.filename },
            { new: true } // Returns the updated document
        );

        console.log("2. Saved to database. User resume is now:", updatedUser.resume); // Debug log

        res.redirect('/profile');
    } catch (error) {
        console.error("Error uploading resume:", error);
        res.status(500).send("Server error uploading resume");
    }
};