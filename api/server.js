// 1. Environment variables load karein
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 👇 DEBUGGING FOR RAILWAY (Yeh check karne ke liye ki naya code aaya ya nahi)
console.log("-----------------------------------------------------");
console.log("👉 👉 RAILWAY DEPLOYMENT CHECK: NEW CRASH-PROOF CODE IS RUNNING! 👈 👈");
console.log("🔑 Detected Key Length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : "0 (MISSING)");
console.log("-----------------------------------------------------");

const app = express();

// --- GEMINI SAFE INITIALIZATION WITH TRY-CATCH ---
let genAI = null;
try {
    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YourActualKeyHere')) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('🤖 GEMINI AI CORE: LINKED');
    } else {
        console.log('⚠️ GEMINI WARNING: API Key missing in Variables. AI offline, but server will stay ONLINE.');
    }
} catch (err) {
    console.log('💥 GEMINI ERROR CAUGHT (Bypassed to prevent crash):', err.message);
}

// ... Baaki ka database connection aur baaki poora code same rehne dein ...