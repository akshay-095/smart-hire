const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Sample Indian Job Data (In-memory array for Phase 2)
const sampleJobs = [
    {
        id: 1,
        title: "Software Development Intern",
        company: "TechCraft India Solutions",
        location: "Bengaluru, Karnataka",
        type: "Internship",
        salary: "₹15,000 / month",
        description: "Looking for SDE interns with strong understanding of Node.js and MongoDB fundamentals."
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "Hyderabad Digital Hub",
        location: "Hyderabad, Telangana",
        type: "Full-time",
        salary: "₹6 - 10 LPA",
        description: "Build interactive web interfaces using modern HTML5, CSS3, JavaScript, and template engines."
    },
    {
        id: 3,
        title: "Part-Time Web Developer",
        company: "Kochi Web Crafts",
        location: "Kochi, Kerala",
        type: "Part-time",
        salary: "₹400 / hour",
        description: "Assist with client website updates and UI enhancements on a flexible part-time schedule."
    },
    {
        id: 4,
        title: "Data Analyst Intern",
        company: "Pune Analytics Corp",
        location: "Pune, Maharashtra",
        type: "Internship",
        salary: "₹20,000 / month",
        description: "Process real-world data, build dashboards, and assist senior data scientists."
    },
    {
        id: 5,
        title: "Junior Java Developer",
        company: "Chennai Tech Solutions",
        location: "Chennai, Tamil Nadu",
        type: "Full-time",
        salary: "₹4 - 7 LPA",
        description: "Build robust backend microservices and maintain database connections."
    }
];

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/jobs', (req, res) => {
    res.render('jobs', { jobs: sampleJobs });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Smart Hire server running at http://localhost:${PORT}`);
});