// 1. Environment variables load karein
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware for JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 👇 VERCEL DATABASE CONNECTION OPTIMIZATION (Serverless Cache)
let isConnected = false;
async function connectDB() {
    if (isConnected) {
        console.log('🔄 Using cached MongoDB connection');
        return;
    }
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('❌ MONGODB_URI is missing in environment variables!');
        }
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log('💾 MongoDB Connected Successfully');
    } catch (err) {
        console.error('💥 MongoDB Connection Error:', err.message);
    }
}

// Har request se pehle database connection check karein
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// 2. Session Configuration (Vercel + Mongo Store)
app.use(session({
    secret: process.env.SESSION_SECRET || 'xavirox_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 days session expiry
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Vercel par true hoga kyunke wahan HTTPS hota hai
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// 3. Gemini AI Safe Initialization
let genAI = null;
try {
    if (process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('🤖 GEMINI AI CORE: Online and Linked');
    } else {
        console.log('⚠️ GEMINI WARNING: API Key missing. Server is running without AI.');
    }
} catch (err) {
    console.log('💥 GEMINI INIT ERROR:', err.message);
}

// 4. Static Files (Frontend handling for Vercel)
app.use(express.static(path.join(process.cwd(), 'public')));

// 5. Test Route (Yeh check karne ke liye ke server chal raha hai)
app.get('/api/health', (req, res) => {
    res.json({
        status: "online",
        database: isConnected ? "connected" : "disconnected",
        message: "Xavirox Neural Core is running perfectly on Vercel!"
    });
});

// 🚨 NOTE: Aapne apne jitne bhi routes/APIs banaye hain (Login, Register, Gemini Chat), 
// woh saare aap yahan niche paste kar sakte hain.


// 6. MAIN SITE ROUTE (Agar koi sirf website open kare)
app.get('/', (req, res) => {
    // Agar aapke paas public/index.html hai toh yeh chalayega
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'), (err) => {
        if (err) {
            res.status(200).send('<h1>Xavirox Neural Core Active</h1><p>Frontend file not found, but backend is working!</p>');
        }
    });
});

// 🚨 VERCEL REQUREMENT: Server ko listen nahi karwana, export karna hai!
module.exports = app;