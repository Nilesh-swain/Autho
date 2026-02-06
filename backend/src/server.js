import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/db.js';
import authRoutes from './routers/authRoutes.js';
import { configurePassport } from './controller/authController.js';

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware
// Added specific methods to avoid CORS issues during redirects
app.use(cors({
      origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added to parse URL-encoded bodies

// 4. Session Configuration
// Note: Google OAuth uses the session to store a 'state' parameter to prevent CSRF
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_neural_key',
    resave: false,
    saveUninitialized: false, // Changed to false for better privacy/security
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use true only in production (HTTPS)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

// 5. Initialize Passport
// Ensure configurePassport() is called BEFORE initialize
configurePassport(); 
app.use(passport.initialize());
app.use(passport.session());

// 6. Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Neural API is operational...');
});

// 7. Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));