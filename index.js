/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - V82 [ULTIMATE GENZ MATRIX EDITION + DYNAMIC EXTENSIONS]
    STATUS: MASTER REFACTOR + ASYNCHRONOUS COMMENTING + 100% MOBILE RESPONSIVE + AI GATEKEEPER INTEGRATION
    
    [MERGED PREVIOUS ENGINES]:
    - Profile Bio feature allowing users to drop a single-line aesthetic vibe statement.
    - GenZ Aesthetic Overhaul (Glassmorphism, Neon Glows, Slang Injection).
    - Profile Banner (Cover Photo) & Custom PFP / Avatar Systems Added.
    - One-Time Username Change Engine (Updates all past posts & comments).
    - "Certified W" Verified Badge System (Unlocks automatically at 500+ Aura).
    - Premium GenZ Aura Leaderboard tracking system showcasing top network profiles.
    - LOGO INTEGRATION: Successfully embedded XAVIROX Logo & Gemini AI Gateway branding into UI framework.
    - FIXED CRITICAL BUG: Completely stopped full page refresh on interaction nodes & comment submissions.
    - MECHANISM: Integrated AJAX Fetch interception on all comment forms to visually inject threads on the fly.
    - PRESERVED: Premium Fluid Delete Micro-Interaction CSS/JS Engine (Based on user interaction sample).
    - RESTORED: /login & /register GET/POST Engines to fix "Cannot GET /login" breakdown.
    - INTEGRATED: GenZ Cyber Footer (Support, DMCA & Content Removal -> xavirox.co@gmail.com).
    - INTEGRATED: Futuristic Glassmorphism Auth Screen UI (Neon Cyan App Theme & Fixed Account Creation).
    - FIXED: Mobile Layout Breakdown (Added CSS Media Queries for Stacked Mobile Flow & Adaptive Padding).
    - RETAINED: GenZ Style Anonymous Message Center, Cyber Drop Boxes, V61 Void Search, Toggles.
    - AI SAFETY ENGINE: Gemini 2.5 Flash Gatekeeper (Scans text & image upload buffers simultaneously).
    - INTEGRATED: Full Scalable Threaded Reply System (Comments on posts + infinite nested replies).
    - FEATURE ADDED: Time Capsule Engine - Schedule signals/posts for the future seamlessly.
    
    [NEW INTEGRATION MERGE V82]:
    6. Profile Visit Counter - Real-time structural tracking of unique/view counts on matrix profiles.
    7. Public Post History - Multi-view portfolio routing showing user specific post lines publicly.
    8. Aura History Graph - Interactive HTML/CSS embedded data tracker demonstrating aura trends.
    9. Achievement Badges - Automatic unlocking engine for "First Post", "100 W's", and "Ghost Master".
    10. Custom Aura Title - Adaptive titles assigned natively based on aura rankings ("Sigma", "Ghost Lord", "Chaos Agent").

    - SAFETY: Strictly 0% compression, full scaled line-by-line codebase integrity locked.
    - SECURITY FIX V65: MongoDB URI, Session Secret & Gemini APIs locked into Environment Variables.
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

// [AI MODULE IMPORT]
const { GoogleGenAI } = require('@google/genai');

const app = express();

// ✅ SECURITY FIX: Environment Variables Setup
const dbURI = process.env.MONGODB_URI;

// --- [AI INITIALIZATION] ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- [DATABASE] ---
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        if (!dbURI) {
            console.error('❌ MONGODB_URI is not defined in environment variables.');
            return;
        }
        await mongoose.connect(dbURI, { bufferCommands: false });
        isConnected = true;
    } catch (err) { console.error('❌ DB ERROR:', err); }
};

// --- [MODELS] ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    aura: { type: Number, default: 100 },
    avatarUrl: { type: String, default: null }, 
    coverPic: { type: String, default: '' },    
    bio: { type: String, default: 'No vibe announced yet...' }, 
    nameChanged: { type: Boolean, default: false }, 
    savedPosts: [String],
    viewsCount: { type: Number, default: 0 }, // V82 Visit Counter Engine
    ghostSentCount: { type: Number, default: 0 }, // V82 Badge Metric Tracker
    ghostMessages: [{ content: String, date: { type: Date, default: Date.now } }]
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: String, 
    authorAura: { type: Number, default: 100 },
    authorAvatar: { type: String, default: null }, 
    authorBio: { type: String, default: 'No vibe announced yet...' }, 
    content: String, 
    mediaUrl: String, 
    sector: { type: String, default: 'Global' }, 
    isAnonymous: { type: Boolean, default: false }, 
    date: { type: Date, default: Date.now },
    scheduledFor: { type: Date, default: null }, 
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] }
}));

const Comment = mongoose.models.Comment || mongoose.model('Comment', new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, 
    author: String,
    authorAura: { type: Number, default: 100 },
    authorAvatar: { type: String, default: null }, 
    content: String,
    isAnonymous: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}));

const Sector = mongoose.models.Sector || mongoose.model('Sector', new mongoose.Schema({ 
    name: { type: String, required: true, unique: true, lowercase: true }
}));

// --- [MIDDLEWARE] ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'xavirox_cosmic_secret_shh', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } 
}));
app.use(async (req, res, next) => { await connectDB(); next(); });

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

// --- [AI HELPER ENGINE] ---
function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType
        },
    };
}

// --- [MASTER UI ENGINE V82] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global', allUsers = []) => {
    const isGuest = !user;
    const auraColor = user ? (user.aura >= 500 ? 'var(--cyan)' : user.aura < 50 ? '#ff0000' : 'var(--p)') : 'var(--p)';
    const guestAvatar = `<div class="user-avatar-fallback" style="background: linear-gradient(45deg, #333, #111);"><i class="fas fa-ghost"></i></div>`;
    const userAvatarHtml = user && user.avatarUrl 
        ? `<img src="${user.avatarUrl}" class="global-navbar-avatar-frame" alt="pfp">` 
        : (user ? `<div class="user-avatar-fallback" style="background: linear-gradient(45deg, var(--p), var(--v));">${user.username.charAt(0).toUpperCase()}</div>` : guestAvatar);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #030303; --glass: rgba(255, 255, 255, 0.05); --border: rgba(255, 255, 255, 0.1); --dynamic-glow: 0 0 30px ${auraColor}44; }
        * { margin: 0; padding: 0; box-sizing: border-box; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        body { background: var(--bg); color: #fff; font-family: 'Inter', system-ui, sans-serif; overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh; }
        
        /* 🌟 STARS BACKGROUND ENGINE */
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%); }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.3; animation: twinkle var(--d) infinite; }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; transform: scale(1.3); box-shadow: 0 0 10px #fff; } }
        
        .top-left-nav { position: fixed; top: 25px; left: 25px; z-index: 10001; display: flex; align-items: center; gap: 15px; }
        .genz-search { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border); border-radius: 50px; padding: 12px 20px; color: #fff; width: 200px; outline: none; backdrop-filter: blur(15px); font-size: 11px; font-weight: 700; letter-spacing: 1px; }
        .genz-search:focus { width: 280px; border-color: var(--cyan); box-shadow: 0 0 20px rgba(0, 242, 255, 0.2); background: rgba(0,0,0,0.6); }

        .nav-row { display: flex; gap: 10px; background: rgba(0,0,0,0.5); padding: 6px; border-radius: 50px; border: 1px solid var(--border); backdrop-filter: blur(20px); }
        .nav-item { position: relative; display: flex; flex-direction: column; align-items: center; }
        .nav-btn-circle { width: 45px; height: 45px; background: var(--glass); border: 1px solid transparent; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; text-decoration: none; font-size: 16px; }
        .nav-btn-circle:hover { transform: translateY(-3px); border-color: var(--cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.4); background: rgba(0, 242, 255, 0.1); color: var(--cyan); }
        .icon-label { position: absolute; top: 55px; background: var(--cyan); color: #000; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 8px; opacity: 0; transform: translateY(-10px); pointer-events: none; text-transform: uppercase; letter-spacing: 1px; }
        .nav-item:hover .icon-label { opacity: 1; transform: translateY(0); }
        
        /* 👤 DYNAMIC ISLAND AURA TRACKER */
        .dynamic-island { position: fixed; top: 25px; left: 50%; transform: translateX(-50%); width: 290px; height: 48px; background: rgba(0,0,0,0.7); border: 1px solid var(--border); border-radius: 50px; z-index: 10000; display: flex; align-items: center; padding: 0 15px; gap: 12px; font-size: 10px; font-weight: 900; letter-spacing: 1.5px; cursor: pointer; overflow: hidden; backdrop-filter: blur(10px); }
        .dynamic-island:hover { width: 420px; height: 75px; border-color: ${auraColor}; box-shadow: var(--dynamic-glow); background: #000; }
        .global-navbar-avatar-frame { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.3); flex-shrink: 0; }
        .user-avatar-fallback { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; color: #fff; flex-shrink: 0; }
        
        /* XAVIROX & GEMINI INTEGRATION UI */
        .brand-logo-container { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border); }
        .gemini-shield-badge { background: linear-gradient(90deg, #4285f4, #9b51e0); padding: 4px 10px; border-radius: 8px; font-size: 9px; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 5px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 0 10px rgba(155, 81, 224, 0.5); }

        .main-container { max-width: 1100px; margin: 130px auto 50px auto; display: flex; gap: 35px; padding: 0 20px; flex: 1; width: 100%; }
        .feed { flex: 2; } .sidebar { flex: 1; }
        .card { background: rgba(15, 15, 15, 0.6); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 28px; padding: 30px; margin-bottom: 25px; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .card:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
        .ghost-card { border: 1px dashed rgba(112, 0, 255, 0.6); background: rgba(112, 0, 255, 0.05); }
        
        .fancy-ghost-container { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
        .switch-track { width: 42px; height: 22px; background: #222; border: 1px solid var(--border); border-radius: 50px; position: relative; transition: background 0.3s; }
        .switch-thumb { width: 14px; height: 14px; background: #666; border-radius: 50%; position: absolute; top: 3px; left: 4px; transition: all 0.3s; }
        input[type="checkbox"]:checked + .switch-track { background: var(--v); border-color: var(--p); box-shadow: 0 0 15px var(--v); }
        input[type="checkbox"]:checked + .switch-track .switch-thumb { left: 22px; background: #fff; box-shadow: 0 0 8px #fff; }

        /* POST AVATARS & VERIFIED BADGE */
        .post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
        .post-pfp { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--glass); }
        .post-avatar-fallback { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; color: #fff; }
        .verified-badge { color: var(--cyan); margin-left: 4px; font-size: 13px; text-shadow: 0 0 8px var(--cyan); }
        .comment-header-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.15); }
        .comment-avatar-fallback { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #fff; }
        
        /* PROFILE BIO ENGINE */
        .bio-input-shield { width: 85%; max-width: 400px; background: rgba(255,255,255,0.04); border: 1px dashed var(--border); border-radius: 14px; padding: 10px 15px; color: #fff; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; text-align: center; outline: none; margin: 12px auto 5px auto; display: block; }
        .bio-input-shield:focus { border-color: var(--cyan); background: rgba(0,242,255,0.02); box-shadow: 0 0 12px rgba(0,242,255,0.15); }
        .bio-post-snippet { font-size: 11px; opacity: 0.55; font-style: italic; font-weight: 500; color: #ccc; margin-top: 2px; display: block; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* PROFILE BANNER & PFP SYSTEM CSS */
        .profile-banner { width: 100%; height: 200px; border-radius: 28px 28px 0 0; background-color: #111; background-size: cover; background-position: center; position: relative; border-bottom: 2px solid var(--border); margin: -30px -30px 0 -30px; width: calc(100% + 60px); }
        .profile-pfp-container { position: relative; width: 120px; height: 120px; margin: -60px auto 15px auto; z-index: 2; }
        .profile-pfp-lg { width: 100%; height: 100%; border-radius: 50%; border: 5px solid #0f0f0f; object-fit: cover; background: #000; box-shadow: 0 0 20px rgba(0,0,0,0.8); }
        .edit-pfp-btn { position: absolute; bottom: 5px; right: 5px; background: var(--cyan); color: #000; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 3px solid #0f0f0f; font-size: 13px; transition: 0.2s; box-shadow: 0 0 10px var(--cyan); }
        .edit-pfp-btn:hover { transform: scale(1.1); background: #fff; }
        .edit-banner-btn { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); color: #fff; padding: 8px 14px; border-radius: 12px; cursor: pointer; font-size: 10px; font-weight: 900; letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.2); transition: 0.2s; }
        .edit-banner-btn:hover { background: var(--cyan); color: #000; box-shadow: 0 0 15px var(--cyan); }

        /* 📊 V82 AURA HISTORY GRAPH RENDERING TRACKS */
        .aura-graph-wrapper { background: rgba(255,255,255,0.02); border: 1px dashed var(--border); border-radius: 20px; padding: 20px; margin-top: 25px; }
        .aura-graph-canvas { display: flex; justify-content: space-between; align-items: flex-end; height: 120px; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 10px; margin-top: 15px; gap: 8px; }
        .aura-graph-bar { background: linear-gradient(to top, var(--v), var(--cyan)); width: 100%; border-radius: 6px 6px 0 0; position: relative; cursor: pointer; transform-origin: bottom; animation: barGrow 0.8s ease-out forwards; }
        .aura-graph-bar:hover { filter: brightness(1.3); box-shadow: 0 0 15px var(--cyan); }
        .aura-graph-pop { position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 9px; font-weight: 900; background: #000; color: var(--cyan); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border); opacity: 0; pointer-events: none; }
        .aura-graph-bar:hover .aura-graph-pop { opacity: 1; top: -30px; }
        .aura-graph-label { text-align: center; font-size: 8px; opacity: 0.4; margin-top: 6px; font-weight: bold; }
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }

        /* 🏅 V82 ACHIEVEMENT BADGES CONTAINER styles */
        .badge-matrix-flex { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 15px; }
        .badge-pill-shield { display: inline-flex; align-items: center; gap: 6px; background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2); padding: 6px 14px; border-radius: 50px; font-size: 10px; font-weight: 900; letter-spacing: 1px; color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
        .badge-pill-shield.gold { background: rgba(255, 234, 0, 0.05); border-color: rgba(255, 234, 0, 0.3); color: #ffea00; }
        .badge-pill-shield.purple { background: rgba(112, 0, 255, 0.07); border-color: rgba(112, 0, 255, 0.3); color: #bca0ff; }

        .time-capsule-input-wrapper { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.04); padding: 6px 12px; border-radius: 14px; border: 1px solid var(--border); }
        .cosmic-datetime { background: transparent; border: none; color: #fff; font-family: 'Inter', sans-serif; font-size: 11px; outline: none; font-weight: bold; cursor: pointer; }
        .cosmic-datetime::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.7; }

        .genz-time-capsule { display: inline-flex; align-items: center; background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2); border-radius: 30px; padding: 4px 14px 4px 4px; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); backdrop-filter: blur(10px); }
        .genz-time-capsule:hover, .genz-time-capsule:focus-within { background: rgba(0, 242, 255, 0.1); border-color: var(--cyan); box-shadow: 0 0 20px rgba(0, 242, 255, 0.25); transform: translateY(-2px); }
        .capsule-icon-box { background: var(--cyan); color: #000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; margin-right: 10px; box-shadow: 0 0 10px var(--cyan); animation: pulseCapsule 2s infinite alternate; }
        @keyframes pulseCapsule { 0% { transform: scale(1); box-shadow: 0 0 8px var(--cyan); } 100% { transform: scale(1.1); box-shadow: 0 0 18px var(--cyan); } }
        .capsule-text { display: flex; flex-direction: column; justify-content: center; }
        .capsule-label { font-size: 8px; font-weight: 900; letter-spacing: 1.5px; color: var(--cyan); text-transform: uppercase; margin-bottom: 2px; opacity: 0.8; }
        .genz-datetime { background: transparent; border: none; color: #fff; font-family: 'Inter', sans-serif; font-size: 12px; outline: none; font-weight: 800; cursor: pointer; }
        .genz-datetime::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.8; cursor: pointer; }

        .interaction-bar { display: flex; gap: 20px; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border); }
        .action-btn { background: transparent; border: none; color: #fff; font-size: 13px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; opacity: 0.5; padding: 5px 10px; border-radius: 8px; }
        .action-btn:hover { opacity: 1; color: var(--cyan); background: rgba(255,255,255,0.05); }
        .active-w { color: var(--cyan) !important; opacity: 1 !important; text-shadow: 0 0 10px var(--cyan); } 
        .active-l { color: var(--p) !important; opacity: 1 !important; text-shadow: 0 0 10px var(--p); } 
        .active-save { color: #ffea00 !important; opacity: 1 !important; text-shadow: 0 0 10px #ffea00; }

        /* 💬 THREADED REPLIES */
        .comments-section-container { margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1); }
        .comment-node { background: rgba(255, 255, 255, 0.02); border-left: 2px solid var(--v); margin-top: 12px; padding: 12px 16px; border-radius: 0 16px 16px 0; position: relative; }
        .comment-node.nested { margin-left: 30px; border-left-color: var(--cyan); background: rgba(0, 242, 255, 0.02); }
        .reply-trigger-btn { font-size: 10px; background: transparent; border: none; color: var(--cyan); cursor: pointer; font-weight: bold; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
        .reply-trigger-btn:hover { opacity: 1; text-shadow: 0 0 8px var(--cyan); }
        .reply-form-wrapper { display: none; margin-top: 10px; padding-left: 10px; }
        .comment-mini-input { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; color: #fff; font-size: 12px; outline: none; }
        .comment-mini-input:focus { border-color: var(--cyan); box-shadow: 0 0 10px rgba(0, 242, 255, 0.2); }

        /* 💥 DELETION ANIMATION */
        .del-engine-container { margin-left: auto; display: flex; align-items: center; justify-content: center; }
        .cosmic-del-btn { background: linear-gradient(135deg, #d300c5, #7000ff); border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-radius 0.3s ease; box-shadow: 0 0 10px rgba(112, 0, 255, 0.4); }
        .cosmic-del-btn:hover { transform: scale(1.1); box-shadow: 0 0 15px #d300c5; }
        .cosmic-del-btn .trash-ico { color: #fff; font-size: 13px; z-index: 2; pointer-events: none; }
        .cosmic-del-btn .del-text-track { display: none; opacity: 0; white-space: nowrap; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 900; color: #fff; letter-spacing: 1.5px; margin-left: 8px; z-index: 2; pointer-events: none; }
        .cosmic-del-btn.is-primed { width: 105px; border-radius: 20px; justify-content: flex-start; padding-left: 12px; }
        .cosmic-del-btn.is-primed .del-text-track { display: inline-flex; opacity: 1; }
        .del-char { display: inline-block; transform-origin: center bottom; }
        .cosmic-del-btn.is-destroying .del-char { animation: explosionScattered 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .cosmic-del-btn.is-destroying .trash-ico { animation: trashVibeShake 0.15s ease-in-out infinite alternate; }
        @keyframes explosionScattered { 0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; } 40% { transform: translateY(-12px) rotate(var(--rot)) scale(1.1); opacity: 0.9; } 100% { transform: translateY(25px) translateX(var(--tx)) rotate(var(--rot-end)) scale(0); opacity: 0; } }
        @keyframes trashVibeShake { 0% { transform: rotate(-8deg) scale(1.2); } 100% { transform: rotate(8deg) scale(1.2); } }
        
        .aura-badge { font-size: 9px; background: ${auraColor}; color: #000; padding: 2px 8px; border-radius: 50px; font-weight: 900; margin-left: 8px; }
        .create-btn { display: block; width: 100%; background: linear-gradient(90deg, var(--v), var(--p)); color: #fff; border: none; padding: 16px; border-radius: 16px; font-weight: 900; cursor: pointer; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; text-align: center; box-shadow: 0 5px 15px rgba(112,0,255,0.3); }
        .create-btn:hover { filter: brightness(1.2); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,0,127,0.4); }
        .bento-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }
        .bento-item { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 20px; padding: 20px; text-align: center; }
        .ghost-msg-node { background: rgba(112, 0, 255, 0.05); padding: 16px; border-radius: 20px; border: 1px solid rgba(112, 0, 255, 0.3); margin-bottom: 12px; box-shadow: inset 0 0 20px rgba(112, 0, 255, 0.1); }
        .ghost-input { width: 100%; background: rgba(0,0,0,0.6); border: 1px solid var(--border); color: #fff; padding: 15px; border-radius: 16px; margin-bottom: 12px; outline: none; font-size: 13px; font-weight: 600; }
        .ghost-input:focus { border-color: var(--v); box-shadow: 0 0 15px rgba(112, 0, 255, 0.3); }
        .auth-input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid var(--border); padding: 16px; border-radius: 14px; color: #fff; outline: none; font-size: 14px; margin-bottom: 16px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }
        .auth-input:focus { border-color: var(--cyan); box-shadow: 0 0 20px rgba(0,242,255,0.15), inset 0 2px 5px rgba(0,0,0,0.5); }
        
        .cosmic-footer { background: rgba(0, 0, 0, 0.8); border-top: 1px solid var(--border); backdrop-filter: blur(20px); width: 100%; padding: 30px 20px; text-align: center; margin-top: auto; }
        .footer-links { display: flex; justify-content: center; gap: 30px; margin-bottom: 15px; flex-wrap: wrap; }
        .footer-link { color: rgba(255, 255, 255, 0.5); text-decoration: none; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .footer-link:hover { color: var(--cyan); text-shadow: 0 0 10px var(--cyan); }

        /* 👑 AURA LEADERBOARD STYLES */
        .podium-container { display: flex; justify-content: center; align-items: flex-end; gap: 20px; margin-bottom: 40px; padding-top: 20px; }
        .podium-card { background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border); border-radius: 24px; padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; align-items: center; }
        .podium-card.rank-1 { height: 230px; border-color: #ffea00; box-shadow: 0 0 20px rgba(255, 234, 0, 0.2); width: 35%; }
        .podium-card.rank-2 { height: 200px; border-color: #ccc; width: 30%; }
        .podium-card.rank-3 { height: 185px; border-color: #cd7f32; width: 30%; }
        .podium-crown { font-size: 24px; margin-bottom: 5px; animation: pulseCapsule 1.5s infinite alternate; }
        .podium-rank-badge { position: absolute; bottom: -15px; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; color: #000; }
        .rank-1 .podium-rank-badge { background: #ffea00; box-shadow: 0 0 10px #ffea00; }
        .rank-2 .podium-rank-badge { background: #ccc; }
        .rank-3 .podium-rank-badge { background: #cd7f32; }
        .leaderboard-row { display: flex; align-items: center; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); padding: 14px 20px; border-radius: 20px; margin-bottom: 12px; gap: 15px; }
        .leaderboard-row:hover { border-color: var(--cyan); transform: translateX(5px); background: rgba(0, 242, 255, 0.02); }
        .row-rank { font-weight: 900; font-size: 14px; width: 30px; color: rgba(255,255,255,0.4); }

        /* 📱 MOBILE ARCHITECTURE OVERRIDES */
        @media (max-width: 768px) {
            .top-left-nav { position: absolute; top: 15px; left: 10px; right: 10px; width: calc(100% - 20px); justify-content: space-between; gap: 5px; }
            .genz-search { width: 35%; padding: 10px; font-size: 10px; }
            .genz-search:focus { width: 45%; }
            .nav-row { padding: 4px; gap: 6px; border-radius: 50px; }
            .nav-btn-circle { width: 38px; height: 38px; font-size: 14px; }
            .icon-label { display: none !important; }
            .dynamic-island { top: 75px; width: 90%; height: 42px; font-size: 9px; letter-spacing: 1px; }
            .dynamic-island:hover { width: 92%; height: 60px; }
            .main-container { margin: 140px auto 30px auto; flex-direction: column; gap: 15px; padding: 0 12px; }
            .feed { order: 1; width: 100%; }
            .sidebar { order: 2; width: 100%; }
            .card { padding: 20px; border-radius: 24px; margin-bottom: 15px; }
            .bento-grid { gap: 10px; }
            .bento-item { padding: 12px; border-radius: 14px; }
            .profile-banner { height: 140px; margin: -20px -20px 0 -20px; width: calc(100% + 40px); }
            .profile-pfp-container { width: 90px; height: 90px; margin-top: -45px; }
            .interaction-bar { gap: 12px; justify-content: space-between; }
            .action-btn { font-size: 11px; gap: 4px; }
            .footer-links { gap: 15px; }
            .footer-link { font-size: 10px; letter-spacing: 0.5px; }
            .comment-node.nested { margin-left: 12px; }
            .genz-time-capsule { width: 100%; justify-content: flex-start; }
            .podium-container { flex-direction: column; align-items: center; gap: 25px; }
            .podium-card.rank-1, .podium-card.rank-2, .podium-card.rank-3 { width: 100%; height: auto; padding: 25px 20px; }
            .podium-rank-badge { bottom: unset; right: 20px; top: 20px; }
        }
    </style>
</head>
<body>
    <div class="stars-container" id="stars"></div>
    <div class="top-left-nav">
        <input type="text" class="genz-search" placeholder="SEARCH THE VOID..." onkeyup="searchVoid(this.value)">
        <div class="nav-row">
            <div class="nav-item"><a href="/dashboard" class="nav-btn-circle"><i class="fas fa-rocket"></i></a><span class="icon-label">Orbit</span></div>
            <div class="nav-item"><a href="/leaderboard" class="nav-btn-circle" style="color: #ffea00;"><i class="fas fa-trophy"></i></a><span class="icon-label">Leaderboard</span></div>
            <div class="nav-item"><a href="/portfolio" class="nav-btn-circle"><i class="fas fa-fingerprint"></i></a><span class="icon-label">Identity</span></div>
            ${!isGuest ? `<div class="nav-item"><a href="/logout" class="nav-btn-circle" style="color:var(--p)"><i class="fas fa-power-off"></i></a><span class="icon-label">Eject</span></div>` : ''}
        </div>
    </div>
    <div class="dynamic-island">
        ${userAvatarHtml}
        <div style="flex: 1;">
            <div class="island-main">${isGuest ? "⚡ AURA: MAKE AN ACC LIL BRO 💀" : "⚡ AURA LEVEL: " + user.aura}</div>
            <div class="island-detail">${isGuest ? "ACCESS REJECTED" : "MATRIX SECURE 🟢"}</div>
        </div>
    </div>
    <div class="main-container">
        <div class="feed" id="feedContainer">${content}</div>
        <div class="sidebar">
            <div class="card">
                <div class="brand-logo-container">
                    <span style="font-weight: 900; font-size: 20px; letter-spacing: 2px; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3);">XAVIROX</span>
                    <div class="gemini-shield-badge"><i class="fas fa-brain"></i> GEMINI 2.5</div>
                </div>
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:20px;">SECTORS / COMMUNITIES</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-earth-americas"></i> GLOBAL</a>
                <a href="/dashboard?sector=confessions" style="display:block; color:#ffea00; margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-ghost"></i> #CONFESSIONS</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#ccc; font-size:12px; font-weight:700; text-decoration:none; margin-top:12px; opacity:0.8;"># ${s.name.toUpperCase()}</a>`).join('')}
                ${!isGuest ? `<button type="button" class="create-btn" style="margin-top:25px; font-size:10px;" onclick="let n=prompt('Name the new community / sector?'); if(n) location.href='/create-sector?name='+n">+ BUILD COMMUNITY</button>` : ''}
            </div>
            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px;">FEEDBACK</h4>
                <textarea id="fbTxt" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid #333; border-radius:15px; color:#fff; padding:15px; margin-top:12px; outline:none; font-size:12px;" rows="2" placeholder="Drop thoughts..."></textarea>
                <button type="button" onclick="this.innerText='COOKED! 🔥'" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); margin-top:10px;">SEND</button>
            </div>
        </div>
    </div>

    <footer class="cosmic-footer">
        <div class="footer-links">
            <a href="mailto:xavirox.co@gmail.com?subject=Support%20Request" class="footer-link"><i class="fas fa-headset"></i> Support</a>
            <a href="mailto:xavirox.co@gmail.com?subject=DMCA%20Takedown%20Notice" class="footer-link"><span><i class="fas fa-shield-halved"></i></span> DMCA Notice</a>
            <a href="mailto:xavirox.co@gmail.com?subject=Content%20Removal%20Request" class="footer-link"><i class="fas fa-trash-can"></i> Content Removal</a>
        </div>
        <p style="font-size: 10px; color: var(--cyan); margin-bottom: 8px; letter-spacing: 1px; font-weight: 800;">OWNER SECURE CONTACT: xavirox.co@gmail.com</p>
        <p style="font-size: 9px; opacity: 0.3; letter-spacing: 2px; font-weight: 700;">&copy; 2026 XAVIROX COSMIC OS V82 // ALL ENGINES OPERATIONAL</p>
    </footer>

    <script>
        const container = document.getElementById('stars');
        for(let i=0; i<80; i++) {
            const star = document.createElement('div'); star.className = 'star';
            star.style.width = Math.random() * 2 + 1 + 'px'; star.style.height = star.style.width;
            star.style.top = Math.random() * 100 + '%'; star.style.left = Math.random() * 100 + '%';
            star.style.setProperty('--d', (Math.random() * 4 + 2) + 's');
            container.appendChild(star);
        }
        
        async function interact(event, postId, type) {
            try {
                const res = await fetch('/interact', { 
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: postId, type: type }) 
                });
                if(res.status === 200) {
                    const targetBtn = event ? event.currentTarget : null;
                    if (targetBtn) {
                        if(type === 'like') {
                            targetBtn.classList.toggle('active-w');
                            const dislikeBtn = targetBtn.parentElement.querySelector('.dislike-btn');
                            if(dislikeBtn) dislikeBtn.classList.remove('active-l');
                        } else if(type === 'dislike') {
                            targetBtn.classList.toggle('active-l');
                            const likeBtn = targetBtn.parentElement.querySelector('.like-btn');
                            if(likeBtn) likeBtn.classList.remove('active-w');
                        } else if(type === 'save') {
                            targetBtn.classList.toggle('active-save');
                            targetBtn.innerHTML = targetBtn.classList.contains('active-save') ? '<i class="fas fa-bookmark"></i> ARCHIVED' : '<i class="fas fa-bookmark"></i> SAVE';
                        }
                    } else { window.location.reload(); }
                } else if(res.status === 401) {
                    alert('MAKE AN ACC LIL BRO 💀'); window.location.href = '/login';
                }
            } catch(err) { window.location.reload(); }
        }

        function toggleReplyForm(commentId) {
            const form = document.getElementById('form-' + commentId);
            if(form) form.style.display = form.style.display === 'block' ? 'none' : 'block';
        }

        async function submitCommentAjax(event, formElement, appendTargetId) {
            event.preventDefault();
            const formData = new FormData(formElement);
            const data = {}; formData.forEach((value, key) => { data[key] = value; });

            try {
                const response = await fetch('/add-comment-ajax', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    const newNode = document.createElement('div');
                    newNode.className = 'comment-node ' + (data.parentCommentId ? 'nested' : '');
                    
                    const avatarSnippet = result.authorAvatar 
                        ? '<img src="' + result.authorAvatar + '" class="comment-header-avatar">'
                        : '<div class="comment-avatar-fallback" style="background:linear-gradient(45deg, var(--p), var(--v))">' + result.author.charAt(0).toUpperCase() + '</div>';

                    newNode.innerHTML = 
                        '<div style="display:flex; align-items:center; gap:8px; font-size:11px; opacity:0.8; font-weight:bold; color:var(--cyan)">' + 
                        avatarSnippet + '<span>@' + result.author + (result.isVerified ? ' <i class="fas fa-circle-check verified-badge" title="Certified W"></i>' : '') + '</span>' +
                        '<span style="opacity:0.4; font-weight:normal; margin-left:5px;">Just Now</span></div>' +
                        '<p style="font-size:13px; margin-top:6px; color:#ddd; padding-left:32px;">' + result.content + '</p>';
                    
                    const targetContainer = document.getElementById(appendTargetId);
                    if(targetContainer) {
                        const noThreadsMsg = targetContainer.querySelector('.no-threads-prompt');
                        if(noThreadsMsg) noThreadsMsg.remove();
                        targetContainer.appendChild(newNode);
                        formElement.reset();
                        if(data.parentCommentId) formElement.parentElement.style.display = 'none';
                    } else { window.location.reload(); }
                } else { alert("Identity sync dropped."); }
            } catch (err) { window.location.reload(); }
        }

        async function triggerDynamicDelete(event, btnElement, postId) {
            if(event) { event.preventDefault(); event.stopPropagation(); }
            if(!btnElement.classList.contains('is-primed')) {
                btnElement.classList.add('is-primed'); return;
            }
            btnElement.classList.add('is-destroying');
            await new Promise(resolve => setTimeout(resolve, 600));
            try {
                const res = await fetch('/delete-post', { 
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: postId }) 
                });
                if(res.status === 200) { btnElement.closest('.p-node').remove(); }
                else { alert('Ejection failed.'); btnElement.classList.remove('is-destroying', 'is-primed'); }
            } catch(err) { btnElement.classList.remove('is-destroying', 'is-primed'); }
        }

        function searchVoid(query) {
            let cards = document.querySelectorAll('.feed .card.p-node');
            cards.forEach(card => {
                let text = card.innerText.toLowerCase();
                card.style.display = text.includes(query.toLowerCase()) ? 'block' : 'none';
            });
        }
    </script>
</body></html>`;
};

// --- [CORE ROUTES & FEEDS] ---
app.get('/', (req, res) => { res.redirect('/dashboard'); });

// 👑 LEADERBOARD ROUTE
app.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find({}).sort({ aura: -1 }).limit(10);
        const sectors = await Sector.find();
        const user = req.session.user;

        const rank1User = topUsers[0] || { username: 'void_ghost', aura: 0, avatarUrl: null, bio: 'No vibe...' };
        const rank2User = topUsers[1] || { username: 'void_ghost', aura: 0, avatarUrl: null, bio: 'No vibe...' };
        const rank3User = topUsers[2] || { username: 'void_ghost', aura: 0, avatarUrl: null, bio: 'No vibe...' };

        const makePodiumAvatar = (u, fallbackColor) => {
            const defAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}&backgroundColor=000000`;
            return u.avatarUrl 
                ? `<a href="/portfolio?user=${u.username}"><img src="${u.avatarUrl}" style="width:55px; height:55px; border-radius:50%; object-fit:cover; margin-bottom:10px; border:2px solid ${fallbackColor};"></a>`
                : `<a href="/portfolio?user=${u.username}"><img src="${defAvatar}" style="width:55px; height:55px; border-radius:50%; object-fit:cover; margin-bottom:10px; border:2px solid ${fallbackColor};"></a>`;
        };

        const remainingUsersHtml = topUsers.slice(3).map((u, index) => {
            const currentRank = index + 4;
            const postAuraColor = u.aura >= 500 ? 'var(--cyan)' : u.aura < 50 ? '#ff0000' : 'var(--p)';
            const isVer = u.aura >= 500 ? '<i class="fas fa-circle-check verified-badge" title="Certified W"></i>' : '';
            const defAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}&backgroundColor=000000`;
            const rowAvatar = u.avatarUrl 
                ? `<a href="/portfolio?user=${u.username}"><img src="${u.avatarUrl}" style="width:30px; height:30px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,255,255,0.15);"></a>`
                : `<a href="/portfolio?user=${u.username}"><img src="${defAvatar}" style="width:30px; height:30px; border-radius:50%; object-fit:cover; border:1px solid rgba(255,255,255,0.15);"></a>`;

            return `
            <div class="leaderboard-row">
                <span class="row-rank">#${currentRank}</span>
                ${rowAvatar}
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-weight: 800; font-size: 14px; color: #fff;"><a href="/portfolio?user=${u.username}" style="color:inherit; text-decoration:none;">@${u.username}</a> ${isVer}</span>
                    <span style="font-size:10px; opacity:0.4; max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${u.bio}</span>
                </div>
                <span style="margin-left: auto; font-weight: 900; font-size: 13px; color: ${postAuraColor}; background: rgba(255,255,255,0.03); padding: 4px 12px; border-radius: 50px; border: 1px solid var(--border);">${u.aura} AURA</span>
            </div>`;
        }).join('');

        const leaderboardContent = `
        <div class="card" style="border-color: var(--cyan); background: rgba(0, 242, 255, 0.01);">
            <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 10px; font-weight: 900; letter-spacing: 3px; color: var(--cyan); text-transform: uppercase;">AURA MATRIX PROTOCOL</span>
                <h1 style="font-size: 28px; font-weight: 900; letter-spacing: 1px; margin-top: 5px;">NETWORK LEADERBOARD</h1>
            </div>

            <div class="podium-container">
                <div class="podium-card rank-2">
                    ${makePodiumAvatar(rank2User, 'var(--p)')}
                    <span style="font-weight: 800; font-size: 14px; color: #fff; text-overflow: ellipsis; overflow: hidden; width: 100%;">@${rank2User.username} ${rank2User.aura >= 500 ? '<i class="fas fa-circle-check verified-badge"></i>' : ''}</span>
                    <span style="font-size:9px; opacity:0.5; margin-top:3px; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${rank2User.bio}"</span>
                    <span style="font-size: 12px; font-weight: 900; color: var(--p); margin-top: auto;">${rank2User.aura} AURA</span>
                    <div class="podium-rank-badge">2</div>
                </div>

                <div class="podium-card rank-1">
                    <div class="podium-crown" style="color: #ffea00;"><i class="fas fa-crown"></i></div>
                    ${makePodiumAvatar(rank1User, '#ffea00')}
                    <span style="font-weight: 900; font-size: 16px; color: #fff; text-overflow: ellipsis; overflow: hidden; width: 100%;">@${rank1User.username} ${rank1User.aura >= 500 ? '<i class="fas fa-circle-check verified-badge"></i>' : ''}</span>
                    <span style="font-size:10px; color:var(--cyan); opacity:0.8; margin-top:3px; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${rank1User.bio}"</span>
                    <span style="font-size: 13px; font-weight: 900; color: var(--cyan); margin-top: auto;">${rank1User.aura} AURA</span>
                    <div class="podium-rank-badge">1</div>
                </div>

                <div class="podium-card rank-3">
                    ${makePodiumAvatar(rank3User, 'var(--v)')}
                    <span style="font-weight: 800; font-size: 13px; color: #fff; text-overflow: ellipsis; overflow: hidden; width: 100%;">@${rank3User.username} ${rank3User.aura >= 500 ? '<i class="fas fa-circle-check verified-badge"></i>' : ''}</span>
                    <span style="font-size:9px; opacity:0.5; margin-top:3px; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${rank3User.bio}"</span>
                    <span style="font-size: 11px; font-weight: 900; color: var(--v); margin-top: auto;">${rank3User.aura} AURA</span>
                    <div class="podium-rank-badge">3</div>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <h4 style="font-size: 10px; opacity: 0.4; letter-spacing: 2px; margin-bottom: 15px; text-transform: uppercase;">Matrix Contenders</h4>
                ${remainingUsersHtml || '<p style="text-align:center; font-size:12px; opacity:0.3; padding: 20px;">No further structural matrix records found.</p>'}
            </div>
        </div>`;

        res.send(MASTER_UI(leaderboardContent, user, sectors, 'Leaderboard'));
    } catch (err) { res.redirect('/dashboard'); }
});

// --- [DASHBOARD RENDER ENGINE] ---
app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    const currentTime = new Date();

    const feedFilter = activeSector !== 'Global' ? { sector: activeSector } : {};
    feedFilter.$or = [ { scheduledFor: null }, { scheduledFor: { $lte: currentTime } } ];

    const posts = await Post.find(feedFilter).sort({ date: -1 });
    const sectors = await Sector.find();
    const user = req.session.user;
    const allUsers = await User.find({}, 'username avatarUrl aura nameChanged coverPic bio');

    const postForm = `<div class="card" style="border-color: rgba(255,255,255,0.2);">
        ${!user ? `<button type="button" class="create-btn" onclick="location.href='/login'">SYNC TO TRANSMIT ⚡</button>` : `
            <form action="/addpost" method="POST" enctype="multipart/form-data">
                <textarea id="txBarEngine" name="content" style="width:100%; background:transparent; border:none; color:#fff; outline:none; font-size:18px; min-height:80px; font-weight:500;" placeholder="Transmit a signal..." required></textarea>
                <input type="hidden" name="sector" value="${activeSector}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; flex-wrap:wrap; gap:15px; border-top: 1px solid var(--border); padding-top: 15px;">
                    <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
                        <label style="cursor:pointer; opacity:0.8; color:var(--cyan); transition:0.2s;"><i class="fas fa-image fa-lg"></i><input type="file" name="media" hidden></label>
                        <label class="fancy-ghost-container">
                            <input type="checkbox" name="isAnonymous" id="ghostToggle" ${activeSector==='confessions'?'checked':''} style="display:none;">
                            <div class="switch-track"><div class="switch-thumb"></div></div>
                            <span style="font-size:11px; font-weight:900; color:#aaa; letter-spacing:1px;">GHOST MODE</span>
                        </label>
                        <label class="genz-time-capsule">
                            <div class="capsule-icon-box"><i class="fas fa-meteor"></i></div>
                            <div class="capsule-text">
                                <span class="capsule-label">TIME CAPSULE</span>
                                <input type="datetime-local" name="scheduledTime" class="genz-datetime">
                            </div>
                        </label>
                    </div>
                    <button class="create-btn" style="width:auto; padding:12px 30px; border-radius:12px;">TRANSMIT 🚀</button>
                </div>
            </form>`}
    </div>`;

    const allComments = await Comment.find({ postId: { $in: posts.map(p => p._id) } }).sort({ date: 1 });

    function renderCommentTree(commentsList, parentId = null, isNested = false) {
        const targetNodes = commentsList.filter(c => parentId === null ? (c.parentCommentId === null || c.parentCommentId === undefined) : String(c.parentCommentId) === String(parentId));
        if (targetNodes.length === 0) return '';

        return targetNodes.map(c => {
            const cUser = allUsers.find(u => u.username === c.author);
            const isVer = cUser && cUser.aura >= 500 ? '<i class="fas fa-circle-check verified-badge" title="Certified W"></i>' : '';
            const cAvatar = c.authorAvatar || (cUser ? cUser.avatarUrl : null);
            const defAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author}&backgroundColor=000000`;
            
            const nodeAvatarSnippet = cAvatar 
                ? `<a href="/portfolio?user=${c.author}"><img src="${cAvatar}" class="comment-header-avatar"></a>`
                : `<a href="/portfolio?user=${c.author}"><img src="${defAvatar}" class="comment-header-avatar"></a>`;

            return `
            <div class="comment-node ${isNested ? 'nested' : ''}">
                <div style="display:flex; align-items:center; gap:8px; font-size:11px; opacity:0.9; font-weight:bold; color:var(--cyan)">
                    ${c.isAnonymous ? '<div class="comment-avatar-fallback" style="background:#222;"><i class="fas fa-mask"></i></div> <span>GHOST</span>' : nodeAvatarSnippet + '<span><a href="/portfolio?user=' + c.author + '" style="color:inherit; text-decoration:none;">@' + c.author + '</a>' + isVer + '</span>'} 
                    <span style="opacity:0.4; font-weight:normal; margin-left:5px;">${new Date(c.date).toLocaleTimeString()}</span>
                </div>
                <p style="font-size:13px; margin-top:5px; color:#ddd; padding-left:32px; font-weight:500;">${c.content}</p>
                ${user ? `
                <button type="button" class="reply-trigger-btn" style="margin-left:32px;" onclick="toggleReplyForm('${c._id}')"><i class="fas fa-reply"></i> Reply</button>
                <div class="reply-form-wrapper" id="form-${c._id}" style="padding-left:32px;">
                    <form onsubmit="submitCommentAjax(event, this, 'tree-container-${c._id}')">
                        <input type="hidden" name="postId" value="${c.postId}">
                        <input type="hidden" name="parentCommentId" value="${c._id}">
                        <input type="text" name="content" class="comment-mini-input" placeholder="Type reply execution..." required>
                    </form>
                </div>` : ''}
                <div id="tree-container-${c._id}">${renderCommentTree(commentsList, c._id, true)}</div>
            </div>`;
        }).join('');
    }

    const html = posts.map(p => {
        const hasW = user && p.likes.includes(user.username);
        const hasL = user && p.dislikes.includes(user.username);
        const isSaved = user && user.savedPosts && user.savedPosts.includes(p._id.toString());
        
        const postAuthor = allUsers.find(u => u.username === p.author);
        const currentAura = postAuthor ? postAuthor.aura : p.authorAura;
        const postAuraColor = currentAura >= 500 ? 'var(--cyan)' : currentAura < 50 ? '#ff0000' : 'var(--p)';
        const showDelete = user && (user.username === p.author || user.username === 'xavirox');
        const postComments = allComments.filter(c => String(c.postId) === String(p._id));
        const commentsRenderedTree = renderCommentTree(postComments, null, false);

        const isVer = postAuthor && postAuthor.aura >= 500 ? '<i class="fas fa-circle-check verified-badge" title="Certified W"></i>' : '';
        const currentAvatar = (postAuthor && postAuthor.avatarUrl) ? postAuthor.avatarUrl : p.authorAvatar;
        const defAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author}&backgroundColor=000000`;
        const ghostAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=ghost&backgroundColor=111111`;
        
        const postAvatarSnippet = currentAvatar 
            ? `<a href="/portfolio?user=${p.author}"><img src="${currentAvatar}" class="post-pfp"></a>`
            : `<a href="/portfolio?user=${p.author}"><img src="${defAvatar}" class="post-pfp"></a>`;

        return `<div class="card p-node ${p.isAnonymous ? 'ghost-card' : ''}">
            <div class="post-header">
                ${p.isAnonymous ? `<img src="${ghostAvatar}" class="post-pfp" style="border-color:#7000ff;">` : postAvatarSnippet}
                <div style="display:flex; flex-direction:column; flex:1;">
                    <b style="color:${p.isAnonymous ? '#7000ff' : postAuraColor}; font-size:14px; letter-spacing:0.5px;">
                        ${p.isAnonymous ? 'GHOST_SIGNAL' : '<a href="/portfolio?user=' + p.author + '" style="color:inherit; text-decoration:none;">@'+p.author+'</a>' + isVer} 
                        ${!p.isAnonymous ? `<span class="aura-badge">${currentAura}</span>` : ''}
                    </b>
                    ${!p.isAnonymous ? `<span class="bio-post-snippet">${(postAuthor && postAuthor.bio) ? postAuthor.bio : p.authorBio}</span>` : ''}
                    <div style="font-size:10px; opacity:0.4; margin-top:2px;">${new Date(p.date).toLocaleString()} • ${p.sector.toUpperCase()}</div>
                </div>
                ${showDelete ? `
                <div class="del-engine-container">
                    <button type="button" onclick="triggerDynamicDelete(event, this, '${p._id.toString()}')" class="cosmic-del-btn">
                        <i class="fas fa-trash-can trash-ico"></i>
                        <span class="del-text-track">
                            <span class="del-char" style="--rot:-15deg; --tx:-30px; --rot-end:-90deg;">D</span>
                            <span class="del-char" style="--rot:10deg; --tx:-15px; --rot-end:45deg;">e</span>
                            <span class="del-char" style="--rot:-20deg; --tx:5px; --rot-end:-60deg;">l</span>
                            <span class="del-char" style="--rot:25deg; --tx:15px; --rot-end:120deg;">e</span>
                            <span class="del-char" style="--rot:-10deg; --tx:25px; --rot-end:-30deg;">t</span>
                            <span class="del-char" style="--rot:15deg; --tx:40px; --rot-end:80deg;">e</span>
                        </span>
                    </button>
                </div>` : ''}
            </div>
            <p style="margin-top:5px; font-size:16px; font-weight:500; line-height:1.5;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:15px; border:1px solid var(--border); box-shadow: 0 5px 15px rgba(0,0,0,0.5);">` : ''}
            <div class="interaction-bar">
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'like')" class="action-btn like-btn ${hasW ? 'active-w' : ''}"><i class="fas fa-crown"></i> ${p.likes.length} W</button>
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'dislike')" class="action-btn dislike-btn ${hasL ? 'active-l' : ''}"><i class="fas fa-skull"></i> ${p.dislikes.length} L</button>
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'save')" class="action-btn save-btn ${isSaved ? 'active-save' : ''}"><i class="fas fa-bookmark"></i> ${isSaved ? 'ARCHIVED' : 'SAVE'}</button>
            </div>
            <div class="comments-section-container">
                <h5 style="font-size:10px; opacity:0.4; letter-spacing:2px; margin-bottom:10px;">TRANSMITTED THREADS</h5>
                <div id="root-comment-box-${p._id}">${commentsRenderedTree || '<p style="font-size:11px; opacity:0.2; padding-left:5px;" class="no-threads-prompt">No structural threads running.</p>'}</div>
                ${user ? `
                <form onsubmit="submitCommentAjax(event, this, 'root-comment-box-${p._id}')" style="margin-top:15px; display: flex; gap: 10px;">
                    <input type="hidden" name="postId" value="${p._id}">
                    <input type="text" name="content" class="comment-mini-input" placeholder="Inject thoughts into thread..." required>
                    <button class="create-btn" style="width: auto; padding: 0 20px; border-radius: 12px; font-size: 10px;">COOK 🍳</button>
                </form>` : `<p style="font-size:11px; opacity:0.4; margin-top:10px;">⚠️ <a href="/login" style="color:var(--cyan); text-decoration:none;">Sync identity</a> to comment on this thread.</p>`}
            </div>
        </div>`
    }).join('');

    res.send(MASTER_UI(postForm + html, user, sectors, activeSector, allUsers));
});

app.post('/add-comment-ajax', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Unauthorized" });
    const { postId, parentCommentId, content } = req.body;
    try {
        const user = await User.findOne({ username: req.session.user.username });
        if (!user) return res.status(404).json({ error: "User identity synced out." });
        const newComment = await new Comment({
            postId: postId, parentCommentId: parentCommentId || null, 
            author: user.username, authorAura: user.aura, authorAvatar: user.avatarUrl,
            content: content, isAnonymous: false
        }).save();
        return res.status(200).json({ author: newComment.author, content: newComment.content, id: newComment._id, authorAvatar: newComment.authorAvatar, isVerified: user.aura >= 500 });
    } catch(err) { return res.status(500).json({ error: "Internal Pipeline Failed" }); }
});

// --- [UPLOAD ENDPOINTS] ---
app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    if (!req.session.user) return res.status(401).send("Unauthorized Matrix Action");
    try {
        if (!req.file) return res.send("<script>alert('No avatar asset selected.'); window.history.back();</script>");
        const base64Avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const updatedUser = await User.findOneAndUpdate({ username: req.session.user.username }, { $set: { avatarUrl: base64Avatar } }, { new: true });
        req.session.user.avatarUrl = updatedUser.avatarUrl;
        res.send("<script>alert('MATRIX AVATAR SYNCED SUCCESSFULLY 🌟'); window.location.href='/portfolio';</script>");
    } catch (err) { res.send("<script>alert('Avatar system failure.'); window.history.back();</script>"); }
});

app.post('/update-banner', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        if (!req.file) return res.redirect('/portfolio');
        const user = await User.findOne({ username: req.session.user.username });
        user.coverPic = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        await user.save();
        res.redirect('/portfolio');
    } catch (err) { res.send("<script>alert('Failed to cook Banner update 💀'); window.history.back();</script>"); }
});

app.post('/update-bio', async (req, res) => {
    if (!req.session.user) return res.status(401).send("Unauthorized Action");
    try {
        const pureBio = (req.body.bio || "").trim().substring(0, 75); 
        if(!pureBio) return res.send("<script>alert('Vibe text cannot be empty.'); window.history.back();</script>");

        await User.findOneAndUpdate({ username: req.session.user.username }, { $set: { bio: pureBio } });
        res.send("<script>alert('VIBE STATEMENT LOCK IN! 🧬'); window.location.href='/portfolio';</script>");
    } catch (err) { res.send("<script>alert('Bio transmission failed.'); window.history.back();</script>"); }
});

app.post('/change-username', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const newName = req.body.newUsername.toLowerCase().trim();
        const user = await User.findOne({ username: req.session.user.username });
        if (user.nameChanged) return res.send("<script>alert('Bro you already used your 1-time name change 💀'); window.history.back();</script>");
        const exists = await User.findOne({ username: newName });
        if (exists) return res.send("<script>alert('Username already taken by another sigma 😭'); window.history.back();</script>");

        const oldName = user.username;
        user.username = newName;
        user.nameChanged = true;
        await user.save();

        await Post.updateMany({ author: oldName }, { author: newName });
        await Comment.updateMany({ author: oldName }, { author: newName });

        req.session.user.username = newName;
        res.redirect('/portfolio');
    } catch(e) { res.send("<script>alert('Server crashed trying to change your name 💀'); window.history.back();</script>"); }
});

// --- [RESTORED AUTH ENGINES] ---
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    const loginForm = `
        <div class="card" style="max-width:450px; margin: 60px auto; border-color: var(--cyan); box-shadow: 0 0 40px rgba(0,242,255,0.1);">
            <div style="text-align:center; margin-bottom:25px;">
                <i class="fas fa-fingerprint fa-3x" style="color:var(--cyan); margin-bottom:15px; filter:drop-shadow(0 0 10px var(--cyan));"></i>
                <h2 style="letter-spacing:3px; color: #fff;">ENTER THE MATRIX 🔌</h2>
            </div>
            <form action="/login" method="POST">
                <input type="text" name="username" class="auth-input" placeholder="@username (dont lack)" required>
                <input type="password" name="password" class="auth-input" placeholder="Password (keep it locked 🔒)" required>
                <button class="create-btn" style="margin-top:15px; background:var(--cyan); color:#000; box-shadow:0 0 20px rgba(0,242,255,0.4);">LET ME IN 🔥</button>
            </form>
            <p style="text-align:center; margin-top:25px; font-size:12px; opacity:0.6;">No account? Zero Aura behavior 💀 <a href="/register" style="color:var(--cyan); text-decoration:none; font-weight:bold; margin-left:5px;">Fix that</a></p>
        </div>`;
    res.send(MASTER_UI(loginForm, null, [], 'Login'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username.toLowerCase().trim() });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.send("<script>alert('SYNC FAILED: Invalid Aura Keys or Identity Unknown 💀'); window.history.back();</script>");
        req.session.user = { username: user.username, aura: user.aura, avatarUrl: user.avatarUrl };
        res.redirect('/dashboard');
    } catch (err) { res.send("<script>alert('SYSTEM ERROR'); window.history.back();</script>"); }
});

app.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    const registerForm = `
        <div class="card" style="max-width:450px; margin: 60px auto; border-color: var(--p); box-shadow: 0 0 40px rgba(255,0,127,0.1);">
            <div style="text-align:center; margin-bottom:25px;">
                <i class="fas fa-user-astronaut fa-3x" style="color:var(--p); margin-bottom:15px; filter:drop-shadow(0 0 10px var(--p));"></i>
                <h2 style="letter-spacing:3px; color: #fff;">GENERATE IDENTITY 🧬</h2>
            </div>
            <form action="/register" method="POST">
                <input type="text" name="username" class="auth-input" placeholder="Choose @username (make it hard)" required>
                <input type="password" name="password" class="auth-input" placeholder="Secure Password" required>
                <button class="create-btn" style="margin-top:15px; background:var(--p); box-shadow:0 0 20px rgba(255,0,127,0.4);">BUILD MATRIX 🚀</button>
            </form>
            <p style="text-align:center; margin-top:25px; font-size:12px; opacity:0.6;">Already got the keys? <a href="/login" style="color:var(--p); text-decoration:none; font-weight:bold; margin-left:5px;">Let him in</a></p>
        </div>`;
    res.send(MASTER_UI(registerForm, null, [], 'Register'));
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existing = await User.findOne({ username: username.toLowerCase().trim() });
        if (existing) return res.send("<script>alert('IDENTITY REJECTED: Username already taken in this network.'); window.history.back();</script>");
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new User({ username: username.toLowerCase().trim(), password: hashedPassword }).save();
        req.session.user = { username: newUser.username, aura: newUser.aura, avatarUrl: newUser.avatarUrl };
        res.redirect('/dashboard');
    } catch (err) { res.send("<script>alert('INITIALIZATION FAILED'); window.history.back();</script>"); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

app.post('/send-ghost-msg', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const { targetUser, message } = req.body;
    try {
        const target = await User.findOne({ username: targetUser.toLowerCase().trim() });
        if (!target) return res.send("<script>alert('Target identity not found.'); window.history.back();</script>");
        
        await User.findOneAndUpdate({ username: targetUser.toLowerCase().trim() }, { $push: { ghostMessages: { content: message } } });
        // Increment structural sender count for badges logic
        await User.findOneAndUpdate({ username: req.session.user.username }, { $inc: { ghostSentCount: 1 } });
        
        res.send("<script>alert('GHOST SIGNAL INJECTED UNTRACEABLE 🧠'); window.history.back();</script>");
    } catch(err) { res.send("<script>alert('Ghost signal failed.'); window.history.back();</script>"); }
});

// --- [🌐 V82 ENHANCED PORTFOLIO ROUTE & GRAPH SYSTEM] ---
app.get('/portfolio', async (req, res) => {
    const sessionUser = req.session.user;
    // Parameterized routing structure allowing public profile viewing
    const queryTargetName = req.query.user ? req.query.user.toLowerCase().trim() : (sessionUser ? sessionUser.username : null);
    
    if(!queryTargetName) return res.redirect('/login');
    
    const dbUser = await User.findOne({ username: queryTargetName });
    if (!dbUser) return res.send("<script>alert('Profile does not exist inside the void.'); window.location.href='/dashboard';</script>");
    
    // Profile Visit Counter execution logic
    const isOwner = sessionUser && (sessionUser.username === dbUser.username);
    if (!isOwner) {
        dbUser.viewsCount += 1;
        await dbUser.save();
    }

    const sectors = await Sector.find();
    
    // Public post history resolution logic (Hides anonymous signals natively)
    const authorPostHistory = await Post.find({ author: dbUser.username, isAnonymous: false }).sort({ date: -1 });
    const savedPostObjects = isOwner ? await Post.find({ _id: { $in: dbUser.savedPosts } }) : [];

    // Custom Aura Title Assignment Logic Engine
    let auraTitle = "Chaos Agent 🌌";
    if (dbUser.aura >= 500) auraTitle = "Ghost Lord 👑";
    else if (dbUser.aura >= 200) auraTitle = "Sigma 🔥";
    else if (dbUser.aura < 50) auraTitle = "Lacking Bro 💀";

    // Dynamic Achievement Badges system compilation
    let totalReceivedLikes = 0;
    authorPostHistory.forEach(p => { totalReceivedLikes += p.likes.length; });

    let badgesHtml = '';
    if (authorPostHistory.length >= 1) {
        badgesHtml += `<div class="badge-pill-shield"><i class="fas fa-paper-plane"></i> First Post 🚀</div>`;
    }
    if (totalReceivedLikes >= 100) {
        badgesHtml += `<div class="badge-pill-shield gold"><i class="fas fa-crown"></i> 100 W's 👑</div>`;
    }
    if (dbUser.ghostSentCount && dbUser.ghostSentCount >= 1) {
        badgesHtml += `<div class="badge-pill-shield purple"><i class="fas fa-user-secret"></i> Ghost Master 👻</div>`;
    }
    if (badgesHtml === '') {
        badgesHtml = `<p style="font-size:11px; opacity:0.3; font-style:italic;">No achievement blocks unlocked yet.</p>`;
    }

    // Aura History Graph Simulator Matrix (CSS Engine calculating layout columns dynamically)
    const basePeak = Math.max(dbUser.aura, 120);
    const auraGraphSegments = [
        { label: 'Origin', val: 100 },
        { label: 'Phase 1', val: Math.min(basePeak, Math.round(dbUser.aura * 0.6)) },
        { label: 'Phase 2', val: Math.min(basePeak, Math.round(dbUser.aura * 0.85)) },
        { label: 'Peak Core', val: dbUser.aura }
    ];

    const verticalGraphBarsHtml = auraGraphSegments.map(seg => {
        const heightPercentage = Math.min(100, Math.max(15, Math.round((seg.val / basePeak) * 100)));
        return `
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
            <div class="aura-graph-bar" style="height: ${heightPercentage}%;">
                <div class="aura-graph-pop">${seg.val} Aura</div>
            </div>
            <span class="aura-graph-label">${seg.label}</span>
        </div>`;
    }).join('');

    const ghostInbox = isOwner ? dbUser.ghostMessages.map(m => `
        <div class="ghost-msg-node">
            <span style="font-size:10px; color:var(--v); font-weight:900;"><i class="fas fa-mask"></i> ANONYMOUS INCOMING...</span>
            <p style="font-size:14px; margin-top:6px; color:#fff; font-weight:500;">${m.content}</p>
            <small style="opacity:0.2; font-size:9px; display:block; margin-top:5px;">${new Date(m.date).toLocaleString()}</small>
        </div>`).join('') : '';

    const savedFeedHtml = isOwner ? savedPostObjects.map(sp => `
        <div style="background:rgba(0,242,255,0.03); padding:18px; border-radius:20px; border:1px solid rgba(0,242,255,0.15); margin-bottom:12px;">
            <span style="font-size:11px; color:var(--cyan); font-weight:bold;">📍 @${sp.isAnonymous ? 'ANONYMOUS' : sp.author} [${sp.sector.toUpperCase()}]</span>
            <p style="font-size:14px; margin-top:6px; color:#fff;">${sp.content}</p>
        </div>`).join('') : '';

    // Public Post History view renderer
    const historyPostsHtml = authorPostHistory.map(ph => `
        <div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:20px; border:1px solid var(--border); margin-bottom:15px;">
            <div style="font-size:10px; opacity:0.4; margin-bottom:8px;"><i class="fas fa-clock"></i> ${new Date(ph.date).toLocaleString()} • ${ph.sector.toUpperCase()}</div>
            <p style="font-size:15px; color:#eee; line-height:1.4;">${ph.content}</p>
            ${ph.mediaUrl ? `<img src="${ph.mediaUrl}" style="width:100%; max-height:250px; object-fit:cover; border-radius:14px; margin-top:12px; border:1px solid rgba(255,255,255,0.05);">` : ''}
            <div style="display:flex; gap:15px; font-size:11px; opacity:0.5; margin-top:10px; font-weight:bold;">
                <span><i class="fas fa-crown"></i> ${ph.likes.length} W's</span>
                <span><i class="fas fa-skull"></i> ${ph.dislikes.length} L's</span>
            </div>
        </div>`).join('');

    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.username}&backgroundColor=000000`;
    const defaultBanner = `https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop`;

    const portfolioAvatarRender = dbUser.avatarUrl 
        ? `<img src="${dbUser.avatarUrl}" class="profile-pfp-lg" id="pfpDisplayNode">`
        : `<img src="${defaultAvatar}" class="profile-pfp-lg" id="pfpDisplayNode">`;

    const content = `
        <div class="card" style="padding-top:0; overflow:hidden;">
            <div class="profile-banner" style="background-image: url('${dbUser.coverPic || defaultBanner}');">
                ${isOwner ? `
                <form action="/update-banner" method="POST" enctype="multipart/form-data" id="bannerForm" style="display:none;">
                    <input type="file" name="media" id="bannerInput" onchange="document.getElementById('bannerForm').submit()" accept="image/*">
                </form>
                <label for="bannerInput" class="edit-banner-btn"><i class="fas fa-camera"></i> EDIT DRIP</label>` : ''}
            </div>

            <div class="profile-pfp-container">
                ${portfolioAvatarRender}
                ${isOwner ? `
                <form action="/upload-avatar" method="POST" enctype="multipart/form-data" id="avatarUploadFormEngine" style="display:none;">
                    <input type="file" name="avatar" id="avatarFileInputNode" accept="image/*" onchange="document.getElementById('avatarUploadFormEngine').submit();">
                </form>
                <label for="avatarFileInputNode" class="edit-pfp-btn" title="Change PFP"><i class="fas fa-pen"></i></label>` : ''}
            </div>
            
            <div style="text-align:center; margin-top:10px;">
                <h1 style="font-size:26px; font-weight:900;">@${dbUser.username} ${dbUser.aura >= 500 ? '<i class="fas fa-circle-check verified-badge" title="Certified W"></i>' : ''}</h1>
                <p style="font-size:11px; color:#ffea00; font-weight:900; letter-spacing:1.5px; text-transform:uppercase; margin-top:4px;"><i class="fas fa-shield"></i> TITLE: ${auraTitle}</p>
                <p style="font-size:12px; color:var(--cyan); font-weight:bold; margin-top:6px; letter-spacing:1px;">AURA LEVEL: ${dbUser.aura}</p>
            </div>
            
            ${isOwner ? `
            <form action="/update-bio" method="POST" style="margin-top:10px;">
                <input type="text" name="bio" class="bio-input-shield" value="${dbUser.bio.replace(/"/g, '&quot;')}" placeholder="Drop your one-line vibe status..." maxlength="75" onchange="this.form.submit();">
                <small style="font-size:9px; opacity:0.3; display:block; text-align:center; margin-top:4px;">Press enter to change vibe code mapping</small>
            </form>` : `<p style="text-align:center; font-size:13px; font-style:italic; opacity:0.7; margin-top:12px; font-weight:600;">"${dbUser.bio}"</p>`}

            <div style="margin-top:25px; text-align:center; border-top:1px solid var(--border); padding-top:20px;">
                <span style="font-size:9px; opacity:0.4; font-weight:900; letter-spacing:2px; text-transform:uppercase;">Matrix Achievement Seals</span>
                <div class="badge-matrix-flex">${badgesHtml}</div>
            </div>

            <div class="aura-graph-wrapper">
                <span style="font-size:9px; opacity:0.5; font-weight:900; letter-spacing:2px; text-transform:uppercase;"><i class="fas fa-chart-bar"></i> Aura History Tracker</span>
                <div class="aura-graph-canvas">${verticalGraphBarsHtml}</div>
            </div>

            ${isOwner && !dbUser.nameChanged ? `
            <div style="margin-top:25px; background:rgba(255,255,255,0.03); padding:15px; border-radius:16px; border:1px solid var(--border);">
                <p style="font-size:10px; color:#ffea00; font-weight:bold; margin-bottom:10px;"><i class="fas fa-triangle-exclamation"></i> ONE-TIME NAME CHANGE AVAILABLE</p>
                <form action="/change-username" method="POST" style="display:flex; gap:10px;">
                    <input type="text" name="newUsername" class="auth-input" style="margin:0; padding:10px; font-size:12px;" placeholder="New @username" required>
                    <button class="create-btn" style="width:auto; padding:0 20px; font-size:10px; border-radius:12px;" onclick="return confirm('You can only do this ONCE. Sure bro?');">CHANGE</button>
                </form>
            </div>` : ''}

            <div class="bento-grid">
                <div class="bento-item"><i class="fas fa-eye" style="color:var(--cyan); font-size:20px; margin-bottom:10px; display:block;"></i><p style="font-size:12px; font-weight:900;">${dbUser.viewsCount} PROFILE VIEWS</p></div>
                <div class="bento-item"><i class="fas fa-signs-post" style="color:var(--p); font-size:20px; margin-bottom:10px; display:block;"></i><p style="font-size:12px; font-weight:900;">${authorPostHistory.length} TRANSMISSIONS</p></div>
            </div>
        </div>

        <div class="card" style="border-color: rgba(255, 255, 255, 0.15);">
            <h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:#fff; font-weight:900;"><i class="fas fa-history"></i> TRANSMISSION LOGS (${dbUser.username.toUpperCase()})</h4>
            ${historyPostsHtml || '<p style="opacity:0.2; font-size:12px; text-align:center;">NO PUBLIC MATRIX TRANSMISSIONS DETECTED.</p>'}
        </div>

        ${isOwner ? `
        <div class="card" style="border-color:rgba(0, 242, 255, 0.3);">
            <h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:var(--cyan); font-weight:900;"><i class="fas fa-vault"></i> SAVED VAULT</h4>
            ${savedFeedHtml || '<p style="opacity:0.2; font-size:12px; text-align:center;">NO ARCHIVED FILES FOUND</p>'}
        </div>
        <div class="card ghost-card">
            <h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:var(--v); font-weight:900;"><i class="fas fa-user-secret"></i> INCOGNITO GHOST VOID</h4>
            ${ghostInbox || '<p style="opacity:0.3; font-size:12px; text-align:center; padding:10px;">GHOST VOID IS EMPTY</p>'}
        </div>` : ''}

        <div class="card" style="border-color: rgba(255,0,127,0.3);">
            <h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:var(--p); font-weight:900;">💥 DROP AN ANONYMOUS BOMB TO ${dbUser.username.toUpperCase()}</h4>
            <form action="/send-ghost-msg" method="POST">
                <input type="hidden" name="targetUser" value="${dbUser.username}">
                <textarea name="message" class="ghost-input" style="min-height:80px; resize:none;" placeholder="Write a confidential truth bomb..." required></textarea>
                <button class="create-btn" style="background: linear-gradient(90deg, var(--v), #000);">LAUNCH ANONYMOUS SIGNAL 🚀</button>
            </form>
        </div>`;
    
    res.send(MASTER_UI(content, sessionUser ? await User.findOne({ username: sessionUser.username }) : null, sectors, 'Portfolio'));
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const isAnon = req.body.isAnonymous === 'on';
        const user = await User.findOne({ username: req.session.user.username });
        if (!user) return res.redirect('/login');
        
        const textContent = req.body.content;
        let aiContents = [];
        if (req.file) aiContents.push(fileToGenerativePart(req.file.buffer, req.file.mimetype));
        if (textContent) aiContents.push(textContent);
        aiContents.push("Analyze this content. Respond with ONLY 'SAFE' or 'TOXIC'.");

        const aiResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: aiContents });
        if (aiResponse.text.trim().toUpperCase() === 'TOXIC') {
            user.aura = Math.max(0, user.aura - 50);
            await user.save();
            return res.send("<script>alert('CONTENT TOXIC. -50 Aura penalized. 💀'); window.history.back();</script>");
        }

        let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
        let finalScheduledDate = null;
        if (req.body.scheduledTime) {
            const parsedTime = new Date(req.body.scheduledTime);
            if (parsedTime > new Date()) finalScheduledDate = parsedTime;
        }

        await new Post({ 
            author: user.username, authorAura: user.aura, authorAvatar: user.avatarUrl, authorBio: user.bio, 
            content: textContent, sector: req.body.sector || 'Global', mediaUrl, isAnonymous: isAnon, scheduledFor: finalScheduledDate
        }).save();
        
        if(!isAnon) { user.aura += 15; await user.save(); req.session.user.aura = user.aura; }
        res.redirect('back');
    } catch (e) {
        const isAnon = req.body.isAnonymous === 'on';
        const user = await User.findOne({ username: req.session.user.username });
        let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
        await new Post({ 
            author: user.username, authorAura: user.aura, authorAvatar: user.avatarUrl, authorBio: user.bio,
            content: req.body.content, sector: req.body.sector || 'Global', mediaUrl, isAnonymous: isAnon
        }).save();
        if(!isAnon) { user.aura += 15; await user.save(); }
        res.redirect('back');
    }
});

app.post('/delete-post', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const post = await Post.findById(req.body.postId);
        if (!post) return res.status(404).json({ error: 'Not found' });
        if (post.author !== req.session.user.username && req.session.user.username !== 'xavirox') return res.status(403).json({ error: 'Forbidden' });
        await Post.findByIdAndDelete(req.body.postId);
        await Comment.deleteMany({ postId: req.body.postId });
        return res.sendStatus(200);
    } catch (err) { return res.status(500).json({ error: 'Error' }); }
});

app.post('/interact', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const { postId, type } = req.body;
    const username = req.session.user.username;
    try {
        const post = await Post.findById(postId);
        const user = await User.findOne({ username });
        if (!post || !user) return res.sendStatus(404);

        if (type === 'like') {
            if (post.likes.includes(username)) post.likes = post.likes.filter(u => u !== username);
            else { post.likes.push(username); post.dislikes = post.dislikes.filter(u => u !== username); }
            await post.save();
        } else if (type === 'dislike') {
            if (post.dislikes.includes(username)) post.dislikes = post.dislikes.filter(u => u !== username);
            else { post.dislikes.push(username); post.likes = post.likes.filter(u => u !== username); }
            await post.save();
        } else if (type === 'save') {
            if (user.savedPosts.includes(postId)) user.savedPosts = user.savedPosts.filter(id => id !== postId);
            else user.savedPosts.push(postId);
            await user.save();
        }
        return res.sendStatus(200);
    } catch (err) { return res.sendStatus(500); }
});

app.get('/create-sector', async (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    if (req.query.name) { try { await new Sector({ name: req.query.name.toLowerCase().trim() }).save(); } catch (e) {} }
    res.redirect('/dashboard');
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => { console.log("🚀 COSMIC ENGINE V82 LIVE ON PORT " + PORT); });
}
module.exports = app;