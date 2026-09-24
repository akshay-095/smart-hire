const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Show Registration Page
exports.getRegister = (req, res) => {
    res.render('register', { error: null });
};

// Handle Registration Submission
exports.postRegister = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { error: "An account with this email already exists." });
        }

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).render('register', { error: "Server error during registration. Please try again." });
    }
};

// Show Login Page
exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

// Handle Login Submission
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: "Invalid email or password." });
        }

        // Compare entered password with the hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: "Invalid email or password." });
        }

        // Save user data into the session
        req.session.user = {
            id: user._id,
            name: user.name,
            role: user.role
        };

        // Forces session to save to MongoDB Atlas BEFORE redirecting (Fixes Navbar delay)
        req.session.save((err) => {
            if (err) console.error("Session save error:", err);
            res.redirect('/jobs');
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('login', { error: "Server error during login. Please try again." });
    }
};

// Handle Logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error("Logout error:", err);
        res.redirect('/');
    });
};