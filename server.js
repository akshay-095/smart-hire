const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;

const profileRoutes = require('./routes/profileRoutes');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Import job routes
const applicationRoutes = require('./routes/applicationRoutes');
const messageRoutes = require('./routes/messageRoutes');
// Import notification components
const notificationMiddleware = require('./middleware/notificationMiddleware');
const notificationRoutes = require('./routes/notificationRoutes');


dotenv.config();
connectDB();

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ... AFTER session middleware setup and BEFORE routes ...
app.use(notificationMiddleware);

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Global Middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', authRoutes);
app.use('/', jobRoutes); // Use job routes
app.use('/', profileRoutes);
app.use('/', applicationRoutes);
app.use(notificationRoutes);
app.use(messageRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Smart Hire server running at http://localhost:${PORT}`);
});