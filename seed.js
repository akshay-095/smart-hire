const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Job = require('./models/Job');
const User = require('./models/User'); // Required to link the user

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to Database');

        // 1. Find an existing recruiter, or create a default one
        let recruiter = await User.findOne({ role: 'recruiter' });
        
        if (!recruiter) {
            console.log('⚠️ No recruiter found. Creating a default recruiter account...');
            const hashedPassword = await bcrypt.hash('SmartHire123', 10);
            recruiter = new User({
                name: 'Seed Recruiter',
                email: 'admin@smarthire.in',
                password: hashedPassword,
                role: 'recruiter'
            });
            await recruiter.save();
            console.log('👤 Default recruiter created (Email: admin@smarthire.in | Password: SmartHire123)');
        } else {
            console.log(`👤 Linking jobs to existing recruiter: ${recruiter.email}`);
        }

        // 2. Clear out old disconnected jobs
        await Job.deleteMany({});
        console.log('🗑️ Cleared old jobs');

        // 3. Define new sample jobs with the recruiter's ID attached
        const sampleJobs = [
            {
                title: "Frontend Developer (React)",
                company: "TechNova Solutions",
                location: "Bengaluru, Karnataka",
                type: "Full-time",
                salary: "₹8 - 12 LPA",
                description: "Looking for an experienced React developer to build scalable UI components. Must have 2+ years of experience with modern JavaScript.",
                postedBy: recruiter._id // 🔗 This is the magic link!
            },
            {
                title: "Backend Node.js Engineer",
                company: "CloudSync India",
                location: "Hyderabad, Telangana (Hybrid)",
                type: "Full-time",
                salary: "₹10 - 15 LPA",
                description: "Join our core infrastructure team. Required skills: Node.js, Express, MongoDB, and REST API design.",
                postedBy: recruiter._id
            },
            {
                title: "UI/UX Design Intern",
                company: "CreativeApp",
                location: "Mumbai, Maharashtra (Remote)",
                type: "Internship",
                salary: "₹15,000 / month",
                description: "Great opportunity for freshers! Help design wireframes and user flows using Figma for our upcoming mobile app.",
                postedBy: recruiter._id
            }
        ];

        // 4. Save to MongoDB
        await Job.insertMany(sampleJobs);
        console.log('🌱 Successfully seeded sample Indian jobs with postedBy linked!');

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();