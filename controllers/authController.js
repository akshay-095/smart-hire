const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Show Registration Page
exports.getRegister = (req, res) => {
    res.render('register');
};

// Handle Registration Submission
exports.postRegister = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("User already exists with this email."); // Simple error for now
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
        res.status(500).send("Server Error during registration");
    }
};

// Show Login Page
exports.getLogin = (req, res) => {
    res.render('login');
};

// Handle Login Submission
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.send("Invalid email or password.");
        }

        // Compare entered password with the hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("Invalid email or password.");
        }

        // Save user data into the session (Logs them in!)
        req.session.user = {
            id: user._id,
            name: user.name,
            role: user.role
        };

        res.redirect('/jobs'); // Redirect to jobs page after successful login
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error during login");
    }
};

// Handle Logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};