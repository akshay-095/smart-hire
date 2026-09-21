const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db'); // Import DB Connection
const Job = require('./models/Job');      // Import Job Model

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

// Fetch jobs dynamically from MongoDB
app.get('/jobs', async (req, res) => {
    try {
        // Job.find() gets ALL jobs from the database
        const jobs = await Job.find().sort({ createdAt: -1 }); 
        res.render('jobs', { jobs: jobs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error while fetching jobs");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Smart Hire server running at http://localhost:${PORT}`);
});