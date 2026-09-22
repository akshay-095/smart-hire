const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;

const connectDB = require('./config/db');
const Job = require('./models/Job');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Global Middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }); 
        res.render('jobs', { jobs: jobs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Smart Hire server running at http://localhost:${PORT}`);
});