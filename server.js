// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Set EJS as the template engine (Syllabus: Template engines)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, frontend JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Basic Route for the Home Page
app.get('/', (req, res) => {
    // Renders the home.ejs file inside the views folder
    res.render('home');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Smart Hire server is running on http://localhost:${PORT}`);
});