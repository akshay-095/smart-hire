const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

// Load environment variables
dotenv.config();

// The same sample jobs, but now going into MongoDB!
const sampleJobs = [
    { title: "Software Development Intern", company: "TechCraft India Solutions", location: "Bengaluru, Karnataka", type: "Internship", salary: "₹15,000 / month", description: "Looking for SDE interns with strong understanding of Node.js and MongoDB fundamentals." },
    { title: "Frontend Developer", company: "Hyderabad Digital Hub", location: "Hyderabad, Telangana", type: "Full-time", salary: "₹6 - 10 LPA", description: "Build interactive web interfaces using modern HTML5, CSS3, JavaScript, and template engines." },
    { title: "Part-Time Web Developer", company: "Kochi Web Crafts", location: "Kochi, Kerala", type: "Part-time", salary: "₹400 / hour", description: "Assist with client website updates and UI enhancements on a flexible part-time schedule." },
    { title: "Data Analyst Intern", company: "Pune Analytics Corp", location: "Pune, Maharashtra", type: "Internship", salary: "₹20,000 / month", description: "Process real-world data, build dashboards, and assist senior data scientists." },
    { title: "Junior Java Developer", company: "Chennai Tech Solutions", location: "Chennai, Tamil Nadu", type: "Full-time", salary: "₹4 - 7 LPA", description: "Build robust backend microservices and maintain database connections." }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to Database');
        
        await Job.deleteMany(); // Clear old jobs
        console.log('🗑️  Cleared old jobs');

        await Job.insertMany(sampleJobs); // Insert new jobs
        console.log('🌱 Successfully seeded sample Indian jobs!');

        process.exit(); // Stop script successfully
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();