/* 
====================================================================================================
    🚀 XAVIROX COSMIC OS - V86 [GOOGLE OAUTH + GHOST MODE + GLITCH MARKET + TIME CAPSULES]
    STATUS: MASTER REFACTOR + ASYNCHRONOUS COMMENTING + 100% MOBILE RESPONSIVE + AI GATEKEEPER INTEGRATION

    [V85 NEW UPGRADES]:
    A. LEFT-ALIGNED PROFILE SIDEBAR — All profile buttons stacked vertically on left, desktop sidebar
       style with full mobile responsive collapsing. No backend changes, pure CSS/HTML layout shift.
    B. GLASSMORPHISM + NEON GLOW UI UPGRADE — Enhanced backdrop-filter blur, neon cyan/purple glow
       effects on cards, hover states, inputs and interactive elements. Live Notifications Ticker added
       at top of feed showing recent network events dynamically.
    C. GHOST POLLS — Dedicated GhostPoll Mongoose schema (question, options with vote counts,
       createdBy, votedUsers). POST /api/poll/:pollId/vote route with double-vote prevention.
       Premium glassmorphism poll card component with neon hover states and animated vote bars.
    D. AURA DUELS — POST /api/aura/challenge route for Player vs Player wager system. Secure
       deterministic winner algorithm (streak + aura + randomness). Automatic Aura transfer,
       milestone tracking and notification dispatch. Full duel history on profile.

    
    [MERGED PREVIOUS ENGINES (V1 - V83)]:
    1.  Custom Avatar/PFP upload — Profile picture system.
    2.  Profile Bio — One-line vibe status.
    3.  Profile Banner — Cover photo system.
    4.  Username change — One-time change allowed.
    5.  Verified badge — Cyan checkmark for 500+ aura.
    6.  Profile visit counter — View count on profiles.
    7.  Public post history — All posts on profile.
    8.  Aura history graph — Chart showing aura phases.
    9.  Achievement badges — First Post, 100 W's, Ghost Master.
    10. Custom aura title — Sigma, Ghost Lord, Chaos Agent.
    11. Follow system — Connect with other users.
    12. Followers/Following count — Real-time on portfolio.
    13. Following feed — Filter to followed users only.
    14. @ Mention notifications — Tag alerts system.
    15. React system — 👑💀🔥❤️ emoji reactions.
    16. Post sharing — Re-transmit posts to feed.
    17. DM / Direct Messages — Private chat matrix.
    18. Friend requests — Follow handshake pipeline.
    19. Block/Mute users — Filter toxic entities.
    
    [NEW INTEGRATION MERGE V84 - THE FULL PLATFORM]:
    20. Comment likes — React to comments with 👑.
    21. Poll posts — A vs B voting system on posts.
    22. Video upload support — Short clips in posts.
    23. GIF support — Giphy search integration.
    24. Link preview cards — URL og-tag preview cards.
    25. Post pinning — Pin best post to profile top.
    26. Trending posts — Most reacted posts section.
    27. Post tags/hashtags — #tag system on posts.
    28. Draft saving — Auto-save drafts in localStorage.
    29. Post word limit badge — Long Signal indicator.
    30. Real-time notifications bell — Live unread count.
    31. Trending sectors — Active communities highlighted.
    32. Discover page — Explore random interesting posts.
    33. Search by username — Find specific users.
    34. Search by hashtag — Find posts by topic.
    35. Daily digest — Top posts summary section.
    36. New follower notification — Already in notif engine.
    37. Ghost message notification — Ghost inbox alert.
    38. Daily login streak — Bonus aura for daily logins.
    39. Aura leaderboard — Already live (top 10 weekly).
    40. Aura decay — Inactive users lose aura over time.
    41. Aura gifting — Send aura to another user.
    42. Aura milestones — 500/1000 aura special rewards.
    43. Weekly challenges — Post 3x = +100 aura bonus.
    44. Report post/comment — Community flag system.
    45. Content warnings — Sensitive post blur toggle.
    46. Anti-spam cooldown — Rate limiting per user.
    47. Dark/Light mode toggle — Theme switcher.
    48. Notification preferences — Alert settings page.
    49. Account deletion — Permanent account removal.
    50. Post editing — Edit published posts.

    - SAFETY: Strictly 0% compression, full scaled line-by-line codebase integrity locked.
==================================================================================================== */

// 1. Sabse pehle environment variables load karein
require('dotenv').config();

// 2. Saare zaroori packages ko require (import) karein
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// 3. AI Module Import (Gemini Library)
const { GoogleGenAI } = require('@google/genai');

// 4. Aapki apni custom files (Cosmic Shell & Theme)
const { AUTH_UI, buildGlitchMarketHtml, COSMIC_CLIENT_JS } = require('./cosmic-shell-v91');

// Normalize AUTH_UI in case module exports change shape (fixes ERR_INVALID_ARG_TYPE from res.send(AUTH_UI))
const AUTH_UI_HTML = (typeof AUTH_UI === 'function') ? AUTH_UI() : AUTH_UI;
const {
    THEME_TOGGLE_HTML,
    THEME_RUNTIME_JS,
    POST_COMPOSER_JS,
    AURA_MATRIX_JS,
    renderPostMedia,
    wrapAuraAvatar,
    topAlphaTickerHtml
} = require('./cosmic-theme-v92');

// 5. Express App Initialization
const app = express();

// Vercel / reverse-proxy settings
app.set('trust proxy', 1);

// Body parsers (Zaroori hain taaki form ka data read ho sake)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 6. Production Session Setup
// connect-mongo can crash startup if MONGODB_URI is missing/misconfigured.
// For "web from starting" we keep sessions working in that case (memory store).
const mongoSessionUrl = process.env.MONGODB_URI || process.env.MONGO_URI;

let sessionStore = undefined;
if (mongoSessionUrl) {
    try {
        sessionStore = MongoStore.create({
            mongoUrl: mongoSessionUrl,
            ttl: 14 * 24 * 60 * 60
        });
    } catch (e) {
        console.warn('⚠️ Mongo session store disabled (init failed):', e?.message || e);
        sessionStore = undefined;
    }
} else {
    console.warn('⚠️ Mongo session store disabled: missing MONGODB_URI/MONGO_URI');
}

app.use(session({
    secret: process.env.SESSION_SECRET || 'cosmic_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 14
    }
}));


const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || (
    process.env.NODE_ENV === 'production'
        ? 'https://xavirox-project.vercel.app/auth/google/callback'
        : 'http://localhost:3000/auth/google/callback'
);

// 🌌 7. Home Page Route (Cannot GET / hal karne ke liye)
app.get('/', (req, res) => {
    try {
        const html = (typeof AUTH_UI_HTML === 'function') ? AUTH_UI_HTML() : String(AUTH_UI_HTML || '');
        if (html && typeof html === 'string') return res.send(html);
        return res.send('<h1>🌌 Cosmic Shell is Live!</h1><p>Server is running.</p>');
    } catch (e) {
        console.error('Home page render failed:', e);
        return res.send('<h1>🌌 Cosmic Shell is Live!</h1><p>Server is running (fallback UI).</p>');
    }
});

// [Yahan se aage aapka baki saara purana auth helpers aur routes ka code shuru hoga...]
const isAuthenticated = (req) => {
    return (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) || !!(req.session && req.session.user);
};


const resolveRequestUser = async (req) => {
    if (req.session && req.session.user && req.session.user.username) {
        return User.findOne({ username: req.session.user.username });
    }
    if (typeof req.isAuthenticated === 'function' && req.isAuthenticated() && req.user) {
        if (req.user._id) return User.findById(req.user._id);
        if (req.user.username) return User.findOne({ username: req.user.username });
    }
    return null;
};

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
    password: { type: String, required: false, default: '' },
    googleId: { type: String, default: null, sparse: true },
    email: { type: String, default: null, sparse: true, unique: true },
    aura: { type: Number, default: 100 },
    unlockedAssets: [{ type: String }],
    auraHistory: [{
        type: { type: String },
        amount: { type: Number },
        description: { type: String },
        opponent: { type: String, default: null },
        date: { type: Date, default: Date.now }
    }],
    avatarUrl: { type: String, default: null }, 
    coverPic: { type: String, default: '' },    
    bio: { type: String, default: 'No vibe announced yet...' }, 
    nameChanged: { type: Boolean, default: false }, 
    savedPosts: [String],
    pinnedPost: { type: String, default: null }, // 🔵 V84 FEATURE 25: Post pinning
    viewsCount: { type: Number, default: 0 }, 
    ghostSentCount: { type: Number, default: 0 }, 
    ghostMessages: [{ content: String, date: { type: Date, default: Date.now } }],
    // 🧬 V83 SOCIAL FABRIC EXTENSIONS
    followers: [{ type: String }],
    following: [{ type: String }],
    blockedUsers: [{ type: String }],
    mutedUsers: [{ type: String }],
    friendRequests: [{ from: String, status: { type: String, default: 'pending' } }],
    // 🧬 V84 NEW EXTENSIONS
    loginStreak: { type: Number, default: 0 }, // Feature 38: Daily login streak
    lastLoginDate: { type: String, default: null }, // Feature 38: Track last login date
    weeklyPostCount: { type: Number, default: 0 }, // Feature 43: Weekly challenge tracking
    weeklyPostReset: { type: String, default: null }, // Feature 43: Week reset date
    reportedPosts: [{ type: String }], // Feature 44: Reports submitted
    theme: { type: String, default: 'dark' }, // Feature 47: Dark/Light mode
    notifPrefs: { mentions: { type: Boolean, default: true }, follows: { type: Boolean, default: true }, reactions: { type: Boolean, default: true } }, // Feature 48
    contentWarning: { type: Boolean, default: true }, // Feature 45: Content warnings toggle
    lastPostDate: { type: String, default: null }, // Feature 46: Anti-spam cooldown
    isGhost: { type: Boolean, default: false }, // V87: Global ghost mode state
    // 🧬 V85 DUEL EXTENSIONS
    duelWins: { type: Number, default: 0 },      // D. Aura Duels: win counter
    duelLosses: { type: Number, default: 0 },    // D. Aura Duels: loss counter
    duelHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuraDuel' }] // D. Full duel history
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: String,
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    authorAura: { type: Number, default: 100 },
    authorAvatar: { type: String, default: null }, 
    authorBio: { type: String, default: 'No vibe announced yet...' }, 
    content: String, 
    mediaUrl: String, 
    sector: { type: String, default: 'Global' }, 
    isAnonymous: { type: Boolean, default: false }, 
    date: { type: Date, default: Date.now },
    scheduledFor: { type: Date, default: null },
    isTimeCapsule: { type: Boolean, default: false },
    unlockAt: { type: Date, default: null },
    ghostOwner: { type: String, default: null },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    // 🧬 V83 REACTION & SHARE ENGINES
    reactions: { crown: [{ type: String }], skull: [{ type: String }], ghost: [{ type: String }], fire: [{ type: String }], heart: [{ type: String }] },
    isShared: { type: Boolean, default: false },
    originalAuthor: { type: String, default: null },
    originalContent: { type: String, default: null },
    // 🧬 V84 NEW POST FIELDS
    tags: [{ type: String }], // Feature 27/34: Hashtag system
    isPoll: { type: Boolean, default: false }, // Feature 21: Poll posts
    pollOptions: [{ text: String, votes: [{ type: String }] }], // Feature 21: Poll options
    isEdited: { type: Boolean, default: false }, // Feature 50: Post editing
    editedAt: { type: Date, default: null }, // Feature 50: Edit timestamp
    isSensitive: { type: Boolean, default: false }, // Feature 45: Content warning flag
    reports: [{ reporter: String, reason: String }], // Feature 44: Report system
    linkPreview: { url: String, title: String, description: String, image: String } // Feature 24: Link preview
}));

const Comment = mongoose.models.Comment || mongoose.model('Comment', new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, 
    author: String,
    authorAura: { type: Number, default: 100 },
    authorAvatar: { type: String, default: null }, 
    content: String,
    isAnonymous: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    likes: [{ type: String }] // Feature 20: Comment likes
}));

const Sector = mongoose.models.Sector || mongoose.model('Sector', new mongoose.Schema({ 
    name: { type: String, required: true, unique: true, lowercase: true }
}));

// 🧬 V83 PRIVATE NET & NOTIFICATION MODELS
const Notification = mongoose.models.Notification || mongoose.model('Notification', new mongoose.Schema({
    recipient: String, sender: String, type: String, referenceId: String, isRead: { type: Boolean, default: false }, date: { type: Date, default: Date.now }
}));

const Message = mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({
    sender: String, receiver: String, content: String, isRead: { type: Boolean, default: false }, date: { type: Date, default: Date.now }
}));

// ============================================================
// 🧬 V85 NEW MODELS: GHOST POLLS + AURA DUELS
// ============================================================

// C. GHOST POLL SCHEMA — Anonymous interactive polls with vote protection
const GhostPoll = mongoose.models.GhostPoll || mongoose.model('GhostPoll', new mongoose.Schema({
    question: { type: String, required: true, maxlength: 280 },
    options: [{
        text: { type: String, required: true, maxlength: 100 },
        voteCount: { type: Number, default: 0 }
    }],
    createdBy: { type: String, required: true }, // username, 'GHOST' if anonymous
    isAnonymous: { type: Boolean, default: false },
    votedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sector: { type: String, default: 'Global' },
    date: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null }, // optional expiry
    totalVotes: { type: Number, default: 0 }
}));

// D. AURA DUEL SCHEMA — Player vs Player wager system
const AuraDuel = mongoose.models.AuraDuel || mongoose.model('AuraDuel', new mongoose.Schema({
    challenger: { type: String, required: true }, // username who initiated
    opponent: { type: String, required: true },   // username who was challenged
    wager: { type: Number, required: true, min: 1 }, // aura points wagered by each side
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'declined', 'completed'] },
    winner: { type: String, default: null },   // username of winner
    loser: { type: String, default: null },    // username of loser
    winMethod: { type: String, default: null }, // how winner was determined
    challengerStreak: { type: Number, default: 0 },
    opponentStreak: { type: Number, default: 0 },
    challengerAura: { type: Number, default: 0 },
    opponentAura: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    resolvedAt: { type: Date, default: null }
}));

// 🧬 V86 GLITCH MARKET — Aura economy shop items
const MarketItem = mongoose.models.MarketItem || mongoose.model('MarketItem', new mongoose.Schema({
    itemName: { type: String, required: true, unique: true },
    costInAura: { type: Number, required: true, min: 1 },
    itemType: { type: String, default: 'cosmetic' },
    tier: { type: String, default: 'STANDARD', enum: ['STANDARD', 'PRO'] },
    iconClass: { type: String, default: 'fa-bolt' },
    description: { type: String, default: '' }
}));

// --- [PASSPORT GOOGLE OAUTH 2.0] ---
passport.serializeUser((userDoc, done) => {
    done(null, userDoc.username);
});

passport.deserializeUser(async (username, done) => {
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) return done(null, false);
        done(null, {
            _id: userDoc._id,
            username: userDoc.username,
            aura: userDoc.aura,
            avatarUrl: userDoc.avatarUrl
        });
    } catch (err) {
        done(err);
    }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let userDoc = await User.findOne({ googleId: profile.id });
        const profileEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!userDoc && profileEmail) {
            userDoc = await User.findOne({ email: profileEmail });
        }
        if (!userDoc) {
            const rawBase = (profile.displayName || (profileEmail ? profileEmail.split('@')[0] : 'cosmic'))
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, '')
                .slice(0, 14) || 'cosmic';
            let candidateUsername = rawBase;
            let suffix = 1;
            while (await User.findOne({ username: candidateUsername })) {
                candidateUsername = `${rawBase}${suffix}`;
                suffix += 1;
            }
            const randomPasswordHash = await bcrypt.hash(Math.random().toString(36) + Date.now(), 10);
            userDoc = await new User({
                username: candidateUsername,
                password: randomPasswordHash,
                googleId: profile.id,
                email: profileEmail,
                aura: 100,
                avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                bio: 'Synced via Google Matrix uplink...'
            }).save();
        } else {
            if (!userDoc.googleId) userDoc.googleId = profile.id;
            if (!userDoc.email && profileEmail) userDoc.email = profileEmail;
            if (!userDoc.avatarUrl && profile.photos && profile.photos[0]) {
                userDoc.avatarUrl = profile.photos[0].value;
            }
            await userDoc.save();
        }
        return done(null, userDoc);
    } catch (err) {
        return done(err);
    }
}));
}

// --- [MIDDLEWARE] ---
app.use(express.static(path.join(__dirname)));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(session({ 
    secret: process.env.SESSION_SECRET || 'xavirox_cosmic_secret_shh', 
    resave: false, 
    saveUninitialized: false,
    proxy: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
        httpOnly: true
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Seed default Glitch Market inventory if void is empty
const seedGlitchMarket = async () => {
    const count = await MarketItem.countDocuments();
    if (count === 0) {
        await MarketItem.insertMany([
            { itemName: 'neon-glow', costInAura: 150, itemType: 'cosmetic', tier: 'STANDARD', iconClass: 'fa-sun', description: 'Neon cyan aura frame glow' },
            { itemName: 'cyber-badge', costInAura: 250, itemType: 'badge', tier: 'STANDARD', iconClass: 'fa-shield-halved', description: 'Elite cyber verification badge' },
            { itemName: 'ghost-cloak', costInAura: 400, itemType: 'cosmetic', tier: 'PRO', iconClass: 'fa-ghost', description: 'Purple ghost transmission cloak' },
            { itemName: 'sigma-crown', costInAura: 750, itemType: 'badge', tier: 'PRO', iconClass: 'fa-crown', description: 'Golden sigma rank crown asset' }
        ]);
    }
    const pollCount = await GhostPoll.countDocuments();
    if (pollCount === 0) {
        await GhostPoll.insertMany([
            {
                question: 'Which void sector dominates the matrix tonight?',
                options: [
                    { text: 'Global Feed', voteCount: 0 },
                    { text: '#Confessions', voteCount: 0 }
                ],
                createdBy: 'SYSTEM',
                isAnonymous: true,
                votedUsers: [],
                totalVotes: 0
            },
            {
                question: 'Ghost Mode: stay anonymous or reveal aura?',
                options: [
                    { text: 'Stay GHOST_SIGNAL', voteCount: 0 },
                    { text: 'Show my Aura', voteCount: 0 }
                ],
                createdBy: 'SYSTEM',
                isAnonymous: true,
                votedUsers: [],
                totalVotes: 0
            }
        ]);
    }
};
app.use(async (req, res, next) => {
    await connectDB();
    await seedGlitchMarket();
    next();
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

// V87: Feed query helpers — hide locked time capsules from main feed
const buildTimeCapsuleFeedClause = (now = new Date()) => ({
    $or: [
        { isTimeCapsule: false },
        { isTimeCapsule: true, unlockAt: { $lte: now } }
    ]
});

const buildFeedQuery = (sectorFilter = {}, now = new Date()) => ({
    $and: [
        sectorFilter,
        buildTimeCapsuleFeedClause(now),
        { $or: [{ scheduledFor: null }, { scheduledFor: { $lte: now } }] }
    ]
});

// Attach Mongoose user doc to req.user when session/passport auth is present
app.use(async (req, res, next) => {
    if (isAuthenticated(req) && !req.user) {
        req.user = await resolveRequestUser(req);
    }
    next();
});

app.use(async (req, res, next) => {
    try {
        res.locals.topAlphaAgent = await User.findOne({}).sort({ aura: -1 }).select('username aura');
    } catch (e) {
        res.locals.topAlphaAgent = null;
    }
    next();
});

const requireAuthPage = (req, res, next) => {
    if (!isAuthenticated(req)) return res.redirect('/login');
    next();
};

// --- [AUTH: EMAIL/PASSWORD LOGIN] ---
// Fixes Vercel "Cannot POST /login" by adding the missing route handler.
app.post('/login', async (req, res) => {
    try {
        const username = (req.body && (req.body.username || req.body.email || '')).toString().trim().toLowerCase();
        const password = (req.body && req.body.password != null) ? req.body.password.toString() : '';

        if (!username || !password) {
            return res.status(400).send('Missing username/email or password.');
        }

        // Ensure DB is ready (Vercel serverless can cold start)
        await connectDB();

        const userDoc = await User.findOne({
            $or: [
                { username },
                { email: username }
            ]
        });

        if (!userDoc || !userDoc.password) {
            return res.status(401).send('Invalid credentials.');
        }

        const isMatch = await bcrypt.compare(password, userDoc.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials.');
        }

        // Persist login on session (integrates with existing express-session + MongoStore)
        if (req.session) {
            req.session.user = {
                id: userDoc._id,
                username: userDoc.username
            };
        }

        return res.redirect('/');
    } catch (err) {
        console.error('Login failed:', err);
        // Clean error handling: do NOT crash server
        return res.status(500).send('Login error. Please try again.');
    }
});

// --- [AI HELPER ENGINE] ---
function fileToGenerativePart(buffer, mimeType) {
    return { inlineData: { data: buffer.toString("base64"), mimeType } };
}

// --- [MASTER UI ENGINE V83] ---
const MASTER_UI = (content, user, sectors = [], activeSector = 'Global', allUsers = [], notifCount = 0, topAlphaAgent = null) => {
    if (!user) throw new Error('MASTER_UI requires authenticated session');
    const auraColor = user.aura >= 500 ? 'var(--cyan)' : user.aura < 50 ? '#ff0000' : 'var(--p)';
    const avatarInner = user.avatarUrl
        ? `<img src="${user.avatarUrl}" class="global-navbar-avatar-frame" alt="pfp">`
        : `<div class="user-avatar-fallback" style="background: linear-gradient(45deg, var(--p), var(--v));">${user.username.charAt(0).toUpperCase()}</div>`;
    const userAvatarHtml = wrapAuraAvatar(avatarInner, user.aura);

    return `
<!DOCTYPE html>
<html lang="en" class="cosmic-root">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
    <style>
        /* ================================================================
           V85 GLASSMORPHISM & NEON GLOW UPGRADE — Enhanced Core Styles
           ================================================================ */
        :root {
            --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #020408;
            --glass: rgba(255, 255, 255, 0.04);
            --glass-strong: rgba(255, 255, 255, 0.08);
            --border: rgba(0, 242, 255, 0.12);
            --border-hover: rgba(0, 242, 255, 0.35);
            --dynamic-glow: 0 0 30px ${auraColor}44;
            --neon-cyan-glow: 0 0 20px rgba(0, 242, 255, 0.4), 0 0 40px rgba(0, 242, 255, 0.15);
            --neon-purple-glow: 0 0 20px rgba(112, 0, 255, 0.5), 0 0 40px rgba(112, 0, 255, 0.2);
            --neon-pink-glow: 0 0 20px rgba(255, 0, 127, 0.5), 0 0 40px rgba(255, 0, 127, 0.2);
            --card-blur: blur(40px) saturate(180%);
            --crystal-bg: rgba(9, 9, 11, 0.42);
            --crystal-bg-deep: rgba(0, 0, 0, 0.32);
            --crystal-blur: blur(24px) saturate(200%);
            --crystal-blur-intense: blur(40px) saturate(220%);
            --crystal-border: rgba(255, 255, 255, 0.1);
            --crystal-inset: inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
            --crystal-specular: inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.25);
            --spring-ease: cubic-bezier(0.16, 1, 0.3, 1);
            --spring-transition: transform 0.4s var(--spring-ease), opacity 0.4s var(--spring-ease), border-color 0.4s var(--spring-ease), box-shadow 0.4s var(--spring-ease), color 0.35s var(--spring-ease);
        }
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
        body.cosmic-theme-body { background: #FFF0F5; color: #0F172A; font-family: 'Inter', system-ui, sans-serif; overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh; transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out; will-change: transform, background-color, color, backdrop-filter; transform: translateZ(0); backface-visibility: hidden; }
        html.dark body.cosmic-theme-body { background: #0F172A; color: #FFF0F5; }

        /* Animated cosmic background gradient mesh */
        body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -3; background: radial-gradient(ellipse at 20% 50%, rgba(112,0,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,242,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255,0,127,0.05) 0%, transparent 50%); pointer-events: none; }
        
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: radial-gradient(circle at center, #060a10 0%, #000 100%); }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.3; animation: twinkle var(--d) infinite; }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; transform: scale(1.4); box-shadow: 0 0 12px rgba(0,242,255,0.6); } }

        /* ================================================================
           V85 GLASSMORPHISM CARD SYSTEM — Premium blur + neon borders
           ================================================================ */
        /* V89 — Ultra crystal glass + GPU layer (no global transition:all) */
        .glass-surface, .card, .post-card, .bento-item, .ghost-poll-card, .duel-card, .glitch-market-card,
        .transmit-card, .sidebar .card, .cosmic-controls-bar {
            background: var(--crystal-bg) !important;
            backdrop-filter: var(--crystal-blur-intense);
            -webkit-backdrop-filter: var(--crystal-blur-intense);
            border: 1px solid var(--crystal-border) !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45), var(--crystal-inset), var(--crystal-specular);
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform, opacity, backdrop-filter;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            contain: layout style paint;
            transition: var(--spring-transition);
        }
        .transmit-card {
            background: rgba(9, 9, 11, 0.48) !important;
            backdrop-filter: blur(40px) saturate(220%);
            -webkit-backdrop-filter: blur(40px) saturate(220%);
        }
        .sidebar .card {
            background: rgba(9, 9, 11, 0.44) !important;
            backdrop-filter: blur(32px) saturate(210%);
            -webkit-backdrop-filter: blur(32px) saturate(210%);
        }
        .card {
            border-radius: 28px;
            padding: 30px;
            margin-bottom: 25px;
            position: relative;
        }
        .glass-btn, .action-btn, .create-btn, .nav-btn-circle, .genz-search, .cosmic-toggle-btn, .transmit-pill-btn {
            background: var(--crystal-bg-deep) !important;
            backdrop-filter: blur(20px) saturate(190%);
            -webkit-backdrop-filter: blur(20px) saturate(190%);
            border: 1px solid var(--crystal-border) !important;
            box-shadow: var(--crystal-inset);
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform, opacity, backdrop-filter;
            transition: var(--spring-transition);
        }
        .cosmic-toggle-btn:hover { transform: translateZ(0) scale(1.015); box-shadow: 0 0 20px rgba(255,255,255,0.06), var(--crystal-inset); }
        .cosmic-toggle-btn:active { transform: translateZ(0) scale(0.995); }
        .dynamic-island, .feed-search-bar {
            background: rgba(9, 9, 11, 0.45) !important;
            backdrop-filter: blur(40px) saturate(220%);
            -webkit-backdrop-filter: blur(40px) saturate(220%);
            border: 1px solid var(--crystal-border) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), var(--crystal-inset), var(--crystal-specular);
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform, opacity, backdrop-filter;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            contain: layout style paint;
            transition: var(--spring-transition);
        }

        /* V90 — Scroll performance: remove heavy blur from scrolling feed surfaces */
        .feed .card,
        .feed .post-card,
        .feed .bento-item,
        .feed .ghost-poll-card,
        .feed .duel-card,
        .feed .glitch-market-card {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;

            background: rgba(9, 9, 11, 0.94) !important;
            box-shadow: 0 10px 34px rgba(0,0,0,0.55), var(--crystal-inset) !important;
            will-change: transform, opacity;
            contain: layout paint style;
        }
        .feed .post-card { content-visibility: auto; contain-intrinsic-size: 420px 280px; }
        .cosmic-controls-bar {
            position: fixed;
            top: 4.5rem;
            right: 1rem;
            z-index: 10001;
            display: flex;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 9999px;
            flex-wrap: wrap;
            max-width: min(420px, 92vw);
            backdrop-filter: blur(32px) saturate(200%);
            -webkit-backdrop-filter: blur(32px) saturate(200%);
        }
        .cosmic-toggle-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: 9999px;
            color: #fff;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 1px;
            cursor: pointer;
        }
        .cosmic-toggle-btn .indicator-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255,255,255,0.25);
            box-shadow: 0 0 6px rgba(255,255,255,0.2);
        }
        .cosmic-toggle-btn.is-active .indicator-dot {
            background: #39ff14;
            box-shadow: 0 0 12px #39ff14;
        }
        .cosmic-toggle-btn.is-active { border-color: rgba(57, 255, 20, 0.45) !important; box-shadow: 0 0 20px rgba(57, 255, 20, 0.2); }
        #sensitiveFilterBtn.is-active { border-color: rgba(255, 234, 0, 0.45) !important; }
        #sensitiveFilterBtn.is-active .indicator-dot { background: #ffea00; box-shadow: 0 0 12px #ffea00; }
        .sensitive-post-content.sensitive-blurred {
            filter: blur(12px);
            -webkit-filter: blur(12px);
            user-select: none;
            pointer-events: none;
        }
        .blur-md { filter: blur(12px); -webkit-filter: blur(12px); }
        .select-none { user-select: none; }
        .delete-btn {
            background: linear-gradient(135deg, rgba(211,0,197,0.85), rgba(112,0,255,0.85)) !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
            color: #fff;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
        }
        .delete-btn:hover { transform: scale(1.08); box-shadow: 0 0 16px rgba(255,0,127,0.45); }
        .card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, rgba(0,242,255,0.04) 0%, transparent 50%, rgba(112,0,255,0.04) 100%); pointer-events: none; }
        .card:hover { border-color: var(--border-hover); transform: translateZ(0) translateY(-2px); box-shadow: 0 16px 48px rgba(0,0,0,0.55), var(--neon-cyan-glow), var(--crystal-inset), var(--crystal-specular); }
        .ghost-card { border: 1px dashed rgba(112, 0, 255, 0.5); background: rgba(112, 0, 255, 0.04); box-shadow: 0 8px 32px rgba(0,0,0,0.5), var(--neon-purple-glow); }

        .bento-item { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 20px; padding: 20px; text-align: center; backdrop-filter: blur(20px); }
        .bento-item:hover { border-color: var(--cyan); background: rgba(0,242,255,0.03); box-shadow: var(--neon-cyan-glow); }
        .bento-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }

        /* ================================================================
           V85 LIVE NOTIFICATIONS TICKER — Top of feed system events
           ================================================================ */
        .notif-ticker-wrapper { background: rgba(0,0,0,0.5); backdrop-filter: blur(20px); border: 1px solid rgba(0,242,255,0.2); border-radius: 50px; padding: 8px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; overflow: hidden; box-shadow: var(--neon-cyan-glow); }
        .notif-ticker-icon { background: var(--cyan); color: #000; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; animation: tickerPulse 2s infinite; }
        @keyframes tickerPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(0,242,255,0.5); } 50% { box-shadow: 0 0 0 6px rgba(0,242,255,0); } }
        .notif-ticker-track { flex: 1; overflow: hidden; white-space: nowrap; }
        .notif-ticker-inner { display: inline-block; animation: tickerScroll 18s linear infinite; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: rgba(255,255,255,0.7); }
        .notif-ticker-inner:hover { animation-play-state: paused; }
        @keyframes tickerScroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .ticker-event { margin-right: 40px; }
        .ticker-event .ticker-user { color: var(--cyan); font-weight: 900; }
        .ticker-event .ticker-aura { color: #ffea00; font-weight: 900; }

        /* ================================================================
           A. LEFT SIDEBAR — Profile nav buttons left-aligned
           ================================================================ */
        /* ================================================================
           V85 FIX — LEFT SIDEBAR: fixed full-height panel, far-left edge
           ================================================================ */
        .top-left-nav {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            padding: 30px 14px;
            width: 185px;
            background: rgba(4, 8, 16, 0.55);
            backdrop-filter: blur(32px) saturate(160%);
            -webkit-backdrop-filter: blur(32px) saturate(160%);
            border-right: 1px solid var(--border);
            box-shadow: 4px 0 32px rgba(0, 0, 0, 0.55), inset -1px 0 0 rgba(0, 242, 255, 0.04);
        }
        /* Hide the search input that was previously inside the nav — it is now in its own wrapper */
        .top-left-nav .genz-search { display: none; }

        /* V86 — Search bar: fixed top-left (see style.css for overrides) */
        .feed-search-bar {
            position: fixed;
            top: 1rem;
            left: 1rem;
            right: auto;
            z-index: 10002;
            width: 16rem;
            max-width: calc(100vw - 2rem);
        }
        .feed-search-bar .genz-search { width: 100%; }
        .genz-search { background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 50px; padding: 12px 20px; color: #fff; width: 200px; outline: none; backdrop-filter: blur(15px); font-size: 11px; font-weight: 700; letter-spacing: 1px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.4); }
        .genz-search:focus { width: 280px; border-color: var(--cyan); box-shadow: var(--neon-cyan-glow), inset 0 2px 8px rgba(0,0,0,0.4); background: rgba(0,0,0,0.7); }

        /* Left sidebar nav — vertical full-width column inside the sidebar panel */
        .nav-row { display: flex; flex-direction: column; gap: 6px; background: transparent; padding: 8px 4px; border-radius: 0; border: none; backdrop-filter: none; box-shadow: none; width: 100%; }
        .nav-item { position: relative; display: flex; flex-direction: row; align-items: center; width: 100%; }
        .nav-btn-circle { width: 44px; height: 44px; background: var(--glass); border: 1px solid transparent; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 16px; position: relative; flex-shrink: 0; transform: translateZ(0); will-change: transform, opacity; transition: var(--spring-transition); }
        .nav-btn-circle:hover { border-color: var(--cyan); box-shadow: var(--neon-cyan-glow), var(--crystal-inset); background: rgba(0,242,255,0.08); color: var(--cyan); transform: translateZ(0) scale(1.05); }
        /* Inline label to the right of icon */
        .icon-label { position: static; background: transparent; color: rgba(255,255,255,0.5); font-size: 10px; font-weight: 700; padding: 0 0 0 10px; border-radius: 0; opacity: 1; transform: none; pointer-events: none; text-transform: uppercase; letter-spacing: 1px; z-index: 100; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .nav-item:hover .nav-btn-circle { border-color: var(--cyan); }
        .nav-item:hover .icon-label { color: var(--cyan); }
        .notif-badge { position: absolute; top: -2px; right: -2px; background: #ff0000; color: #fff; font-size: 8px; font-weight: 900; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #000; box-shadow: 0 0 8px rgba(255,0,0,0.7); }

        /* V86 — Dynamic Island: fixed top-center on all viewports */
        .dynamic-island {
            position: fixed;
            top: 1rem;
            left: 50%;
            right: auto;
            transform: translate3d(-50%, 0, 0);
            width: min(320px, 90vw);
            height: 48px;
            border-radius: 9999px;
            z-index: 10000;
            display: flex;
            align-items: center;
            padding: 0 15px;
            gap: 12px;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 1.5px;
            cursor: pointer;
            overflow: hidden;
            will-change: transform, opacity, backdrop-filter, width, height;
            transition: transform 0.4s var(--spring-ease), opacity 0.4s var(--spring-ease), width 0.4s var(--spring-ease), height 0.4s var(--spring-ease), border-color 0.4s var(--spring-ease), box-shadow 0.4s var(--spring-ease);
        }
        .dynamic-island:hover {
            width: min(420px, 92vw);
            height: 75px;
            border-color: ${auraColor};
            box-shadow: var(--dynamic-glow), var(--crystal-inset), var(--crystal-specular);
            will-change: transform, opacity, width, height;
        }

        /* V88 — Unified transmit pill row (GHOST / SENSITIVE / TIME CAPSULE) */
        .transmit-pill-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            margin-top: 16px;
            padding-bottom: 8px;
            contain: layout style;
        }
        .transmit-pill-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: rgb(161, 161, 170);
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            white-space: nowrap;
            background: rgba(9, 9, 11, 0.5) !important;
            backdrop-filter: blur(24px) saturate(200%);
            -webkit-backdrop-filter: blur(24px) saturate(200%);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: var(--crystal-inset), var(--crystal-specular);
            transform: translateZ(0);
            will-change: transform, opacity, backdrop-filter;
            transition: var(--spring-transition);
        }
        .transmit-pill-btn:hover {
            border-color: #a855f7;
            color: #e4e4e7;
            transform: translateZ(0) scale(1.015);
            box-shadow: 0 0 24px rgba(168, 85, 247, 0.18), var(--crystal-inset);
        }
        .transmit-pill-btn:active { transform: translateZ(0) scale(0.995); }
        .transmit-pill-btn.is-active {
            border-color: #a855f7;
            color: #fff;
            box-shadow: 0 0 28px rgba(168, 85, 247, 0.28), var(--crystal-inset), var(--crystal-specular);
            background: rgba(9, 9, 11, 0.62) !important;
        }
        #timeCapsuleBtn.is-active { border-color: rgba(0, 240, 255, 0.5); box-shadow: 0 0 20px rgba(0, 240, 255, 0.15); }
        #postSensitiveBtn.is-active { border-color: rgba(255, 234, 0, 0.45); box-shadow: 0 0 16px rgba(255, 234, 0, 0.12); }
        #ghostModeBtn.is-active { border-color: rgba(57, 255, 20, 0.45); box-shadow: 0 0 16px rgba(57, 255, 20, 0.15); }
        .time-capsule-picker-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
            opacity: 0;
            pointer-events: none;
        }
        .transmit-tools-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: 12px;
            padding-top: 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .global-navbar-avatar-frame { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(0,242,255,0.4); flex-shrink: 0; box-shadow: 0 0 8px rgba(0,242,255,0.3); }
        .user-avatar-fallback { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; color: #fff; flex-shrink: 0; }

        /* Main layout — left sidebar nav + main content */
        .brand-logo-container { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border); }
        .gemini-shield-badge { background: linear-gradient(90deg, #4285f4, #9b51e0); padding: 4px 10px; border-radius: 8px; font-size: 9px; font-weight: 900; color: #fff; display: flex; align-items: center; gap: 5px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 0 12px rgba(155, 81, 224, 0.6); }

        /* ================================================================
           V85 FIX — MAIN CONTAINER: left-offset to clear the sidebar
           ================================================================ */
        .main-container { max-width: 1100px; margin: 90px auto 50px 195px; display: flex; gap: 25px; padding: 0 20px; flex: 1; width: calc(100% - 195px); }
        .feed { flex: 2; }
        .sidebar { flex: 1; }

        /* Post elements */
        .post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
        .post-pfp { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,242,255,0.25); box-shadow: 0 0 8px rgba(0,242,255,0.15); }
        .post-avatar-fallback { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; color: #fff; }
        .verified-badge { color: var(--cyan); margin-left: 4px; font-size: 13px; text-shadow: 0 0 10px var(--cyan); filter: drop-shadow(0 0 4px var(--cyan)); }
        .comment-header-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.15); }
        .comment-avatar-fallback { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #fff; }
        
        .bio-input-shield { width: 85%; max-width: 400px; background: rgba(0,242,255,0.03); border: 1px dashed rgba(0,242,255,0.2); border-radius: 14px; padding: 10px 15px; color: #fff; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; text-align: center; outline: none; margin: 12px auto 5px auto; display: block; }
        .bio-input-shield:focus { border-color: var(--cyan); background: rgba(0,242,255,0.04); box-shadow: var(--neon-cyan-glow); }
        .bio-post-snippet { font-size: 11px; opacity: 0.55; font-style: italic; font-weight: 500; color: #ccc; margin-top: 2px; display: block; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .profile-banner { width: 100%; height: 200px; border-radius: 28px 28px 0 0; background-color: #111; background-size: cover; background-position: center; position: relative; border-bottom: 2px solid var(--border); margin: -30px -30px 0 -30px; width: calc(100% + 60px); }
        .profile-pfp-container { position: relative; width: 120px; height: 120px; margin: -60px auto 15px auto; z-index: 2; }
        .profile-pfp-lg { width: 100%; height: 100%; border-radius: 50%; border: 5px solid #0f0f0f; object-fit: cover; background: #000; box-shadow: 0 0 30px rgba(0,242,255,0.3), 0 0 60px rgba(0,0,0,0.8); }
        .edit-pfp-btn { position: absolute; bottom: 5px; right: 5px; background: var(--cyan); color: #000; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 3px solid #0f0f0f; font-size: 13px; box-shadow: var(--neon-cyan-glow); }
        .edit-banner-btn { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.7); backdrop-filter: blur(15px); color: #fff; padding: 8px 14px; border-radius: 12px; cursor: pointer; font-size: 10px; font-weight: 900; letter-spacing: 1px; border: 1px solid rgba(255,255,255,0.2); }

        .aura-graph-wrapper { background: rgba(0,242,255,0.02); border: 1px dashed rgba(0,242,255,0.15); border-radius: 20px; padding: 20px; margin-top: 25px; }
        .aura-graph-canvas { display: flex; justify-content: space-between; align-items: flex-end; height: 120px; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 10px; margin-top: 15px; gap: 8px; }
        .aura-graph-bar { background: linear-gradient(to top, var(--v), var(--cyan)); width: 100%; border-radius: 6px 6px 0 0; position: relative; cursor: pointer; transform-origin: bottom; animation: barGrow 0.8s ease-out forwards; box-shadow: 0 0 10px rgba(0,242,255,0.3); }
        .aura-graph-pop { position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 9px; font-weight: 900; background: #000; color: var(--cyan); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border); opacity: 0; pointer-events: none; }
        .aura-graph-bar:hover .aura-graph-pop { opacity: 1; top: -30px; }
        .aura-graph-label { text-align: center; font-size: 8px; opacity: 0.4; margin-top: 6px; font-weight: bold; }
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }

        .badge-matrix-flex { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 15px; }
        .badge-pill-shield { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,242,255,0.05); border: 1px solid rgba(0,242,255,0.2); padding: 6px 14px; border-radius: 50px; font-size: 10px; font-weight: 900; letter-spacing: 1px; color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
        .badge-pill-shield.gold { background: rgba(255,234,0,0.05); border-color: rgba(255,234,0,0.3); color: #ffea00; box-shadow: 0 0 10px rgba(255,234,0,0.2); }
        .badge-pill-shield.purple { background: rgba(112,0,255,0.07); border-color: rgba(112,0,255,0.3); color: #bca0ff; box-shadow: 0 0 10px rgba(112,0,255,0.2); }

        .time-capsule-input-wrapper { display: flex; align-items: center; gap: 8px; background: rgba(0,242,255,0.04); padding: 6px 12px; border-radius: 14px; border: 1px solid rgba(0,242,255,0.2); }
        .cosmic-datetime { background: transparent; border: none; color: #fff; font-family: 'Inter', sans-serif; font-size: 11px; outline: none; font-weight: bold; cursor: pointer; }
        .cosmic-datetime::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.7; }

        .genz-time-capsule { display: inline-flex; align-items: center; background: rgba(0,242,255,0.04); border: 1px solid rgba(0,242,255,0.2); border-radius: 30px; padding: 4px 14px 4px 4px; cursor: pointer; transition: transform 0.3s var(--spring-ease), opacity 0.3s var(--spring-ease), box-shadow 0.3s var(--spring-ease), background-color 0.3s var(--spring-ease), border-color 0.3s var(--spring-ease); transform: translateZ(0); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; perspective: 1000px; }
        .genz-time-capsule:hover { background: rgba(0,242,255,0.08); box-shadow: var(--neon-cyan-glow); }
        .capsule-icon-box { background: var(--cyan); color: #000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; margin-right: 10px; box-shadow: var(--neon-cyan-glow); animation: pulseCapsule 2s infinite alternate; }
        @keyframes pulseCapsule { 0% { transform: scale(1); box-shadow: 0 0 8px var(--cyan); } 100% { transform: scale(1.1); box-shadow: 0 0 20px var(--cyan); } }
        .capsule-text { display: flex; flex-direction: column; justify-content: center; }
        .capsule-label { font-size: 8px; font-weight: 900; letter-spacing: 1.5px; color: var(--cyan); text-transform: uppercase; margin-bottom: 2px; opacity: 0.8; }
        .genz-datetime { background: transparent; border: none; color: #fff; font-family: 'Inter', sans-serif; font-size: 12px; outline: none; font-weight: 800; cursor: pointer; }

        /* V83 INTERACTION BAR */
        .interaction-bar { display: flex !important; justify-content: flex-start !important; gap: 10px !important; flex-wrap: wrap !important; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.06); }
        .action-btn { background: rgba(255,255,255,0.03); border: 1px solid transparent; color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 6px; border-radius: 10px; padding: 6px 12px !important; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); transform: translateZ(0); will-change: transform, opacity; transition: var(--spring-transition); }
        .action-btn:hover { opacity: 1; color: var(--cyan); background: rgba(0,242,255,0.08); border-color: rgba(0,242,255,0.25); box-shadow: var(--neon-cyan-glow), var(--crystal-inset); transform: translateZ(0) scale(1.015); }
        .react-btn.active { opacity: 1 !important; transform: scale(1.1); box-shadow: 0 0 15px rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.2) !important; background: rgba(255,255,255,0.06) !important; }
        .active-save { color: #ffea00 !important; opacity: 1 !important; text-shadow: 0 0 12px #ffea00; border-color: rgba(255,234,0,0.3) !important; }
        .share-btn { color: var(--cyan); opacity: 0.8; }

        .comments-section-container { margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(0,242,255,0.1); }
        .comment-node { background: rgba(0,0,0,0.3); backdrop-filter: blur(15px); border-left: 2px solid rgba(112,0,255,0.5); margin-top: 12px; padding: 12px 16px; border-radius: 0 16px 16px 0; position: relative; box-shadow: inset 0 1px 0 rgba(255,255,255,0.03); }
        .comment-node.nested { margin-left: 30px; border-left-color: rgba(0,242,255,0.5); background: rgba(0,242,255,0.02); }
        .reply-trigger-btn { font-size: 10px; background: transparent; border: none; color: var(--cyan); cursor: pointer; font-weight: bold; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
        .reply-form-wrapper { display: none; margin-top: 10px; padding-left: 10px; }
        .comment-mini-input { width: 100%; background: rgba(0,0,0,0.6); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; color: #fff; font-size: 12px; outline: none; backdrop-filter: blur(10px); }
        .comment-mini-input:focus { border-color: var(--cyan); box-shadow: var(--neon-cyan-glow); }

        .del-engine-container { margin-left: auto; display: flex; align-items: center; justify-content: center; }
        .cosmic-del-btn { background: linear-gradient(135deg, #d300c5, #7000ff); border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: var(--neon-purple-glow); }
        .cosmic-del-btn:hover { transform: scale(1.1); box-shadow: var(--neon-pink-glow); }
        .cosmic-del-btn .trash-ico { color: #fff; font-size: 13px; z-index: 2; pointer-events: none; }
        .cosmic-del-btn .del-text-track { display: none; opacity: 0; white-space: nowrap; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 900; color: #fff; letter-spacing: 1.5px; margin-left: 8px; z-index: 2; }
        .cosmic-del-btn.is-primed { width: 105px; border-radius: 20px; justify-content: flex-start; padding-left: 12px; }
        .cosmic-del-btn.is-primed .del-text-track { display: inline-flex; opacity: 1; }
        
        .aura-badge { font-size: 9px; background: ${auraColor}; color: #000; padding: 2px 8px; border-radius: 50px; font-weight: 900; margin-left: 8px; box-shadow: 0 0 8px ${auraColor}88; }
        .create-btn { display: block; width: 100%; background: linear-gradient(90deg, var(--v), var(--p)); color: #fff; border: none; padding: 16px; border-radius: 16px; font-weight: 900; cursor: pointer; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; text-align: center; box-shadow: 0 5px 20px rgba(112,0,255,0.4); transform: translateZ(0); will-change: transform, opacity; transition: var(--spring-transition); }
        .create-btn:hover { filter: brightness(1.2); transform: translateZ(0) scale(1.015); box-shadow: 0 8px 25px rgba(255,0,127,0.5), var(--neon-pink-glow); }
        .create-btn:active { transform: translateZ(0) scale(0.995); }
        .ghost-input { width: 100%; background: rgba(0,0,0,0.6); border: 1px solid var(--border); color: #fff; padding: 15px; border-radius: 16px; margin-bottom: 12px; outline: none; font-size: 13px; font-weight: 600; backdrop-filter: blur(10px); }
        .ghost-input:focus { border-color: var(--cyan); box-shadow: var(--neon-cyan-glow); }
        .auth-input { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); padding: 16px; border-radius: 14px; color: #fff; outline: none; font-size: 14px; margin-bottom: 16px; backdrop-filter: blur(10px); }
        .auth-input:focus { border-color: var(--cyan); box-shadow: var(--neon-cyan-glow); }
        
        .cosmic-footer { background: rgba(0, 0, 0, 0.85); border-top: 1px solid var(--border); backdrop-filter: blur(30px); width: 100%; padding: 30px 20px; text-align: center; margin-top: auto; box-shadow: 0 -4px 20px rgba(0,0,0,0.5); }
        .footer-links { display: flex; justify-content: center; gap: 30px; margin-bottom: 15px; flex-wrap: wrap; }
        .footer-link { color: rgba(255, 255, 255, 0.4); text-decoration: none; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
        .footer-link:hover { color: var(--cyan); text-shadow: 0 0 10px var(--cyan); }

        .podium-container { display: flex; justify-content: center; align-items: flex-end; gap: 20px; margin-bottom: 40px; padding-top: 20px; }
        .podium-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(30px); border: 1px solid var(--border); border-radius: 24px; padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; align-items: center; }
        .podium-card.rank-1 { height: 230px; border-color: rgba(255,234,0,0.5); box-shadow: 0 0 30px rgba(255,234,0,0.2), var(--neon-cyan-glow); width: 35%; }
        .podium-card.rank-2 { height: 200px; border-color: rgba(200,200,200,0.3); width: 30%; }
        .podium-card.rank-3 { height: 185px; border-color: rgba(205,127,50,0.4); width: 30%; }
        .podium-crown { font-size: 24px; margin-bottom: 5px; filter: drop-shadow(0 0 8px #ffea00); }
        .podium-rank-badge { position: absolute; bottom: -15px; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; color: #000; }
        .rank-1 .podium-rank-badge { background: #ffea00; box-shadow: 0 0 15px #ffea00; } .rank-2 .podium-rank-badge { background: #ccc; } .rank-3 .podium-rank-badge { background: #cd7f32; }
        .leaderboard-row { display: flex; align-items: center; background: rgba(255,255,255,0.02); backdrop-filter: blur(10px); border: 1px solid var(--border); padding: 14px 20px; border-radius: 20px; margin-bottom: 12px; gap: 15px; transition: transform 0.25s var(--spring-ease), opacity 0.25s var(--spring-ease), box-shadow 0.25s var(--spring-ease), background-color 0.25s var(--spring-ease), border-color 0.25s var(--spring-ease); transform: translateZ(0); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; perspective: 1000px; }
        .leaderboard-row:hover { border-color: var(--border-hover); box-shadow: var(--neon-cyan-glow); background: rgba(0,242,255,0.03); }

        /* V83 SHARED POST STYLES */
        .shared-post-wrapper { border-left: 2px solid rgba(0,242,255,0.4); padding-left: 15px; margin-top: 10px; background: rgba(0,242,255,0.02); border-radius: 0 16px 16px 0; }
        .shared-indicator { font-size: 10px; color: var(--cyan); font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }

        /* ================================================================
           V84 FEATURE STYLES — ALL PRESERVED
           ================================================================ */
        .poll-option { background: rgba(255,255,255,0.03); backdrop-filter: blur(15px); border: 1px solid var(--border); border-radius: 14px; padding: 12px 18px; margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: transform 0.3s var(--spring-ease), opacity 0.3s var(--spring-ease), box-shadow 0.3s var(--spring-ease), background-color 0.3s var(--spring-ease), border-color 0.3s var(--spring-ease); transform: translateZ(0); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; perspective: 1000px; position: relative; overflow: hidden; }
        .poll-option:hover { border-color: var(--cyan); background: rgba(0,242,255,0.05); box-shadow: var(--neon-cyan-glow); }
        .poll-option.voted { border-color: var(--p); background: rgba(255,0,127,0.05); cursor: default; box-shadow: var(--neon-pink-glow); }
        .poll-bar { position: absolute; left: 0; top: 0; height: 100%; background: linear-gradient(90deg, rgba(112,0,255,0.18), rgba(255,0,127,0.12)); border-radius: 14px; z-index: 0; transition: width 0.8s ease; }
        .poll-text { z-index: 1; font-size: 13px; font-weight: 700; flex: 1; }
        .poll-pct { z-index: 1; font-size: 11px; font-weight: 900; color: var(--cyan); margin-left: auto; text-shadow: 0 0 8px var(--cyan); }
        .post-tag { display: inline-block; background: rgba(0,242,255,0.06); border: 1px solid rgba(0,242,255,0.2); color: var(--cyan); font-size: 10px; font-weight: 900; padding: 2px 10px; border-radius: 50px; margin: 2px; cursor: pointer; letter-spacing: 0.5px; text-decoration: none; }
        .post-tag:hover { background: rgba(0,242,255,0.15); box-shadow: var(--neon-cyan-glow); }
        .pinned-indicator { font-size: 10px; color: #ffea00; font-weight: 900; letter-spacing: 1px; margin-bottom: 8px; display: flex; align-items: center; gap: 5px; }
        .trending-badge { background: linear-gradient(90deg, #ff007f, #7000ff); font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 50px; color: #fff; margin-left: 8px; letter-spacing: 1px; box-shadow: var(--neon-purple-glow); }
        .word-count-badge { font-size: 9px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: rgba(255,255,255,0.4); padding: 2px 8px; border-radius: 50px; margin-left: 8px; }
        .report-btn { font-size: 10px; background: transparent; border: none; color: rgba(255,100,100,0.5); cursor: pointer; padding: 4px 8px; border-radius: 8px; font-weight: 700; }
        .report-btn:hover { color: #ff4444; background: rgba(255,0,0,0.08); }
        .cw-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.88); border-radius: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; z-index: 5; cursor: pointer; backdrop-filter: blur(12px); }
        .cw-label { font-size: 11px; font-weight: 900; color: #ffea00; letter-spacing: 2px; text-shadow: 0 0 10px #ffea00; }
        html:not(.dark) .glass-surface, html:not(.dark) .card, html:not(.dark) .post-card, html:not(.dark) .dynamic-island, html:not(.dark) .feed-search-bar, html:not(.dark) .cosmic-controls-bar { backdrop-filter: blur(24px); background: rgba(255,255,255,0.4) !important; border: 1px solid rgba(15,23,42,0.1) !important; color: #0F172A !important; }
        html.dark .glass-surface, html.dark .card, html.dark .post-card, html.dark .dynamic-island, html.dark .feed-search-bar, html.dark .cosmic-controls-bar { backdrop-filter: blur(24px); background: rgba(0,0,0,0.4) !important; border: 1px solid rgba(255,240,245,0.1) !important; color: #FFF0F5 !important; }
        .comment-like-btn { font-size: 10px; background: transparent; border: none; color: rgba(255,255,255,0.4); cursor: pointer; padding: 3px 8px; border-radius: 8px; font-weight: 700; margin-left: 8px; }
        .comment-like-btn:hover, .comment-like-btn.liked { color: var(--cyan); text-shadow: 0 0 8px var(--cyan); }
        .media-type-badge { font-size: 9px; background: rgba(112,0,255,0.2); border: 1px solid rgba(112,0,255,0.4); color: #bca0ff; padding: 2px 8px; border-radius: 50px; font-weight: 900; }
        .link-preview-card { border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-top: 12px; background: rgba(255,255,255,0.02); backdrop-filter: blur(10px); }
        .link-preview-img { width: 100%; height: 140px; object-fit: cover; }
        .link-preview-body { padding: 12px 15px; }
        .link-preview-title { font-size: 13px; font-weight: 900; color: #fff; margin-bottom: 4px; }
        .link-preview-desc { font-size: 11px; opacity: 0.5; }
        .link-preview-url { font-size: 10px; color: var(--cyan); margin-top: 4px; opacity: 0.7; }
        .streak-badge { background: linear-gradient(90deg, #ff6b00, #ffea00); color: #000; font-size: 9px; font-weight: 900; padding: 3px 10px; border-radius: 50px; margin-left: 8px; }
        .discover-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .trending-sector-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,0,127,0.06); border: 1px solid rgba(255,0,127,0.2); padding: 6px 14px; border-radius: 50px; font-size: 10px; font-weight: 900; color: var(--p); text-decoration: none; margin: 4px; }
        .trending-sector-pill:hover { background: rgba(255,0,127,0.15); box-shadow: var(--neon-pink-glow); }

        /* ================================================================
           C. GHOST POLL CARD — Glassmorphism premium component
           ================================================================ */
        .ghost-poll-card { background: rgba(4, 8, 20, 0.75); backdrop-filter: blur(40px); border: 1px solid rgba(112,0,255,0.3); border-radius: 28px; padding: 28px; margin-bottom: 20px; position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.6), var(--neon-purple-glow), inset 0 1px 0 rgba(112,0,255,0.1); }
        .ghost-poll-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, rgba(112,0,255,0.04) 0%, transparent 60%); pointer-events: none; }
        .ghost-poll-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .ghost-poll-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--v), #3d00a0); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: var(--neon-purple-glow); flex-shrink: 0; }
        .ghost-poll-question { font-size: 16px; font-weight: 900; color: #fff; line-height: 1.4; letter-spacing: 0.3px; }
        .ghost-poll-meta { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 2px; letter-spacing: 0.5px; }
        .ghost-poll-option { position: relative; overflow: hidden; background: rgba(112,0,255,0.06); border: 1px solid rgba(112,0,255,0.2); border-radius: 16px; padding: 14px 20px; margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: transform 0.3s var(--spring-ease), opacity 0.3s var(--spring-ease), box-shadow 0.3s var(--spring-ease), background-color 0.3s var(--spring-ease), border-color 0.3s var(--spring-ease); transform: translateZ(0); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; perspective: 1000px; }
        .ghost-poll-option:hover:not(.gpo-voted) { border-color: var(--cyan); background: rgba(0,242,255,0.06); box-shadow: var(--neon-cyan-glow); transform: translateX(4px); }
        .ghost-poll-option.gpo-voted { cursor: default; border-color: rgba(0,242,255,0.35); }
        .ghost-poll-option.gpo-winner { border-color: rgba(255,234,0,0.5); background: rgba(255,234,0,0.04); box-shadow: 0 0 15px rgba(255,234,0,0.2); }
        .gpo-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 16px; z-index: 0; transition: width 1s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .gpo-fill-cyan { background: linear-gradient(90deg, rgba(0,242,255,0.15), rgba(0,242,255,0.05)); }
        .gpo-fill-purple { background: linear-gradient(90deg, rgba(112,0,255,0.15), rgba(112,0,255,0.05)); }
        .gpo-fill-pink { background: linear-gradient(90deg, rgba(255,0,127,0.15), rgba(255,0,127,0.05)); }
        .gpo-fill-yellow { background: linear-gradient(90deg, rgba(255,234,0,0.15), rgba(255,234,0,0.05)); }
        .gpo-option-text { z-index: 1; font-size: 13px; font-weight: 700; color: #fff; flex: 1; }
        .gpo-vote-count { z-index: 1; font-size: 11px; font-weight: 900; color: var(--cyan); text-shadow: 0 0 8px var(--cyan); min-width: 40px; text-align: right; }
        .gpo-pct-bar-label { z-index: 1; font-size: 10px; color: rgba(255,255,255,0.5); margin-left: auto; }
        .ghost-poll-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(112,0,255,0.15); }
        .gpo-total-votes { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 700; letter-spacing: 0.5px; }
        .gpo-vote-btn { background: linear-gradient(90deg, var(--v), var(--p)); color: #fff; border: none; padding: 8px 20px; border-radius: 50px; font-size: 10px; font-weight: 900; cursor: pointer; letter-spacing: 1px; box-shadow: var(--neon-purple-glow); transition: transform 0.3s var(--spring-ease), opacity 0.3s var(--spring-ease), box-shadow 0.3s var(--spring-ease), filter 0.3s var(--spring-ease); transform: translateZ(0); will-change: transform, opacity; backface-visibility: hidden; -webkit-backface-visibility: hidden; perspective: 1000px; }
        .gpo-vote-btn:hover { filter: brightness(1.2); transform: scale(1.05); }

        /* ================================================================
           D. AURA DUEL CARD — PvP wager component
           ================================================================ */
        .duel-card { background: rgba(8, 4, 20, 0.8); backdrop-filter: blur(40px); border: 1px solid rgba(255,0,127,0.3); border-radius: 28px; padding: 28px; margin-bottom: 20px; position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.7), var(--neon-pink-glow), inset 0 1px 0 rgba(255,0,127,0.1); overflow: hidden; }
        .duel-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, rgba(255,0,127,0.04) 0%, transparent 60%, rgba(112,0,255,0.04) 100%); pointer-events: none; }
        .duel-vs-row { display: flex; align-items: center; justify-content: center; gap: 20px; margin: 20px 0; }
        .duel-player { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
        .duel-player-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,0,127,0.5); box-shadow: 0 0 20px rgba(255,0,127,0.4); }
        .duel-player-name { font-size: 13px; font-weight: 900; color: #fff; }
        .duel-player-aura { font-size: 11px; color: var(--p); font-weight: 700; }
        .duel-vs-badge { background: linear-gradient(135deg, var(--p), var(--v)); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; color: #fff; box-shadow: var(--neon-pink-glow); animation: duelVsPulse 1.5s infinite alternate; flex-shrink: 0; }
        @keyframes duelVsPulse { 0% { transform: scale(1); box-shadow: var(--neon-pink-glow); } 100% { transform: scale(1.1); box-shadow: 0 0 30px rgba(255,0,127,0.8); } }
        .duel-wager-display { text-align: center; background: rgba(255,234,0,0.06); border: 1px solid rgba(255,234,0,0.2); border-radius: 16px; padding: 10px 20px; margin: 10px auto; width: fit-content; }
        .duel-wager-amount { font-size: 22px; font-weight: 900; color: #ffea00; text-shadow: 0 0 15px #ffea00; }
        .duel-wager-label { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 2px; font-weight: 700; }
        .duel-result-banner { background: linear-gradient(90deg, rgba(0,242,255,0.1), rgba(112,0,255,0.1)); border: 1px solid rgba(0,242,255,0.3); border-radius: 16px; padding: 14px 20px; text-align: center; margin-top: 15px; }
        .duel-win-text { color: var(--cyan); font-weight: 900; font-size: 16px; text-shadow: var(--neon-cyan-glow); }
        .duel-lose-text { color: var(--p); font-weight: 900; font-size: 16px; }
        .duel-method-text { font-size: 10px; opacity: 0.5; margin-top: 4px; letter-spacing: 1px; }
        .duel-action-row { display: flex; gap: 10px; margin-top: 15px; justify-content: center; }
        .duel-accept-btn { background: linear-gradient(90deg, #00a040, #006030); color: #fff; border: none; padding: 10px 25px; border-radius: 50px; font-weight: 900; font-size: 11px; cursor: pointer; box-shadow: 0 0 15px rgba(0,160,64,0.4); }
        .duel-decline-btn { background: rgba(255,0,0,0.15); color: #ff4444; border: 1px solid rgba(255,0,0,0.3); padding: 10px 25px; border-radius: 50px; font-weight: 900; font-size: 11px; cursor: pointer; }
        .duel-challenge-form input[type="text"], .duel-challenge-form input[type="number"] { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); color: #fff; padding: 12px 15px; border-radius: 12px; outline: none; font-size: 13px; margin-bottom: 10px; backdrop-filter: blur(10px); }
        .duel-challenge-form input:focus { border-color: var(--p); box-shadow: var(--neon-pink-glow); }

        @media (max-width: 768px) {
            /* Collapse the full-height sidebar to a thin top strip on mobile */
            .top-left-nav { position: fixed; top: 0; left: 0; right: 0; height: auto; width: 100%; flex-direction: row; justify-content: center; padding: 8px 10px; border-right: none; border-bottom: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
            .nav-row { flex-direction: row; gap: 4px; padding: 2px 0; width: auto; }
            .nav-item { flex-direction: column; }
            .icon-label { display: none !important; }
            .nav-btn-circle { width: 36px; height: 36px; font-size: 14px; border-radius: 50%; }
            /* Search stays top-left; offset below mobile nav strip */
            .feed-search-bar { top: 4.5rem; left: 0.75rem; right: auto; width: 14rem; }
            .feed-search-bar .genz-search { width: 100%; padding: 8px 14px; font-size: 10px; }
            .feed-search-bar .genz-search:focus { width: 100%; }
            /* Dynamic Island stays centered and visible */
            .dynamic-island { top: 0.75rem; left: 50%; transform: translateX(-50%); width: min(300px, 88vw); height: 42px; font-size: 9px; letter-spacing: 1px; display: flex !important; }
            .transmit-pill-row { gap: 8px; }
            .transmit-pill-btn { font-size: 10px; padding: 8px 12px; }
            /* Main container: no left offset on mobile, stack vertically */
            .main-container { margin: 120px auto 30px auto; margin-left: auto; flex-direction: column; gap: 15px; padding: 0 12px; width: 100%; }
            .feed { order: 1; width: 100%; } .sidebar { order: 2; width: 100%; }
            .profile-banner { height: 140px; margin: -20px -20px 0 -20px; width: calc(100% + 40px); }
            .profile-pfp-container { width: 90px; height: 90px; margin-top: -45px; }
            .podium-container { flex-direction: column; align-items: center; gap: 25px; }
            .podium-card.rank-1, .podium-card.rank-2, .podium-card.rank-3 { width: 100%; height: auto; padding: 25px 20px; }
            .podium-rank-badge { bottom: unset; right: 20px; top: 20px; }
            .discover-grid { grid-template-columns: 1fr; }
            .duel-vs-row { gap: 10px; }
            .duel-player-avatar { width: 45px; height: 45px; }
        }
    </style>
</head>
<body class="cosmic-theme-body transition-colors duration-500">
    ${THEME_TOGGLE_HTML}
    ${topAlphaTickerHtml(topAlphaAgent)}
    <div class="stars-container" id="stars"></div>
    <div class="top-left-nav">
        <div class="nav-row">
            <div class="nav-item"><a href="/dashboard" class="nav-btn-circle"><i class="fas fa-rocket"></i></a><span class="icon-label">Orbit</span></div>
            <div class="nav-item"><a href="/leaderboard" class="nav-btn-circle" style="color: #ffea00;"><i class="fas fa-trophy"></i></a><span class="icon-label">Rankings</span></div>
            <div class="nav-item"><a href="/discover" class="nav-btn-circle" style="color: var(--p);"><i class="fas fa-compass"></i></a><span class="icon-label">Discover</span></div>
            <div class="nav-item"><a href="/notifications" class="nav-btn-circle"><i class="fas fa-bell"></i>${notifCount > 0 ? `<div class="notif-badge">${notifCount}</div>` : ''}</a><span class="icon-label">Alerts</span></div>
            <div class="nav-item"><a href="/dms" class="nav-btn-circle"><i class="fas fa-envelope"></i></a><span class="icon-label">DMs</span></div>
            <div class="nav-item"><a href="/portfolio" class="nav-btn-circle"><i class="fas fa-fingerprint"></i></a><span class="icon-label">Identity</span></div>
            <div class="nav-item"><a href="/settings" class="nav-btn-circle" style="color:#aaa;"><i class="fas fa-gear"></i></a><span class="icon-label">Settings</span></div>
            <div class="nav-item"><a href="/logout" class="nav-btn-circle" style="color:var(--p)"><i class="fas fa-power-off"></i></a><span class="icon-label">Eject</span></div>
        </div>
    </div>
    <!-- V86: Search top-left | Dynamic Island top-center -->
    <div class="feed-search-bar fixed top-4 left-4 z-50 w-64">
        <input type="text" class="genz-search genz-search-pill rounded-full" placeholder="SEARCH THE VOID..." onkeyup="searchVoid(this.value)">
    </div>
    <div class="system-status-node glass-surface" aria-live="polite">[ SYSTEM STATUS: OPERATIONAL // LATENCY: 14ms ]</div>
    <div class="dynamic-island glass-surface fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full">
        ${userAvatarHtml}
        <div style="flex: 1;">
            <div class="island-main" data-self-aura="${user.aura}">⚡ AURA LEVEL: ${user.aura}</div>
            <div class="island-detail">MATRIX SECURE 🟢</div>
        </div>
    </div>
    <div class="cosmic-controls-bar glass-surface">
        <button type="button" id="sensitiveFilterBtn" class="cosmic-toggle-btn glass-btn is-active" data-filter-on="true" title="Blur sensitive posts in feed">
            <span class="indicator-dot"></span>
            <span>FEED FILTER</span>
            <span class="toggle-status-text">ON</span>
        </button>
        <button type="button" id="matrixModeBtn" class="cosmic-toggle-btn glass-btn" title="Cyber glitch matrix mode">
            <span class="indicator-dot"></span>
            <span>MATRIX</span>
        </button>
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
                <a href="/dashboard?sector=Following" style="display:block; color:#00ff88; margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-user-group"></i> FOLLOWING FEED</a>
                <a href="/discover" style="display:block; color:var(--p); margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-compass"></i> DISCOVER</a>
                <a href="/dashboard?sector=confessions" style="display:block; color:#ffea00; margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-ghost"></i> #CONFESSIONS</a>
                <a href="/glitch-market" class="glitch-market-nav-link"><i class="fas fa-satellite-dish"></i> 📡 GLITCH MARKET</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#ccc; font-size:12px; font-weight:700; text-decoration:none; margin-top:12px; opacity:0.8;"># ${s.name.toUpperCase()}</a>`).join('')}
                <button type="button" class="create-btn" style="margin-top:25px; font-size:10px;" onclick="let n=prompt('Name the new community / sector?'); if(n) location.href='/create-sector?name='+n">+ BUILD COMMUNITY</button>
            </div>
            <div class="card" style="border-color: rgba(255,234,0,0.2);">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:15px;"><i class="fas fa-fire" style="color:var(--p);"></i> TRENDING SECTORS</h4>
                ${sectors.slice(0,4).map(s => `<a href="/dashboard?sector=${s.name}" class="trending-sector-pill"># ${s.name.toUpperCase()}</a>`).join('')}
                <a href="/dashboard?sector=confessions" class="trending-sector-pill">#CONFESSIONS</a>
            </div>
            <div class="card" style="border-color: rgba(0,242,255,0.15);">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:12px;"><i class="fas fa-bolt" style="color:var(--cyan);"></i> QUICK ACTIONS</h4>
                <button type="button" onclick="toggleTheme()" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); margin-bottom:10px; font-size:10px;"><i class="fas fa-circle-half-stroke"></i> TOGGLE THEME</button>
                <a href="/settings" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); font-size:10px;"><i class="fas fa-gear"></i> SETTINGS</a>
            </div>
            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px;">FEEDBACK</h4>
                <textarea id="fbTxt" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid #333; border-radius:15px; color:#fff; padding:15px; margin-top:12px; outline:none; font-size:12px;" rows="2" placeholder="Drop thoughts..."></textarea>
                <button type="button" onclick="this.innerText='COOKED! 🔥'" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); margin-top:10px;">SEND</button>
            </div>
        </div>
    </div>

    <div id="dmComposer" class="dm-composer glass-surface" hidden>
        <div class="dm-composer-header">
            <span><i class="fas fa-envelope"></i> DM UPLINK — <strong id="dmPeerLabel">@void</strong></span>
            <button type="button" class="action-btn" onclick="closeDmComposer()" aria-label="Close DM">✕</button>
        </div>
        <div id="dmMessages" class="dm-messages-scroll"></div>
        <form class="dm-send-form" onsubmit="sendDmMessage(event)">
            <input type="text" id="dmMessageInput" class="comment-mini-input" placeholder="Transmit encrypted signal..." autocomplete="off">
            <button type="submit" class="create-btn" style="width:auto;padding:0 18px;font-size:10px;">SEND</button>
        </form>
    </div>
    <div id="matrixCommandBar" class="matrix-command-bar">
        <span class="matrix-cmd-prefix">&gt;</span>
        <input type="text" id="matrixCommandInput" class="matrix-cmd-input" placeholder="matrix command (help, orbit, market)..." onkeydown="if(event.key==='Enter'){event.preventDefault();runMatrixCommand();}">
        <button type="button" class="create-btn" style="width:auto;font-size:10px;padding:8px 16px;" onclick="runMatrixCommand()">EXEC</button>
    </div>

    <footer class="cosmic-footer cosmic-brand-footer">
        <p class="cosmic-footer-signature">getxavirox.xyz</p>
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

        // V83 Post Sharing Engine Frontend
        async function sharePost(postId) {
            if(confirm("Share this transmission to your global feed?")) {
                try {
                    const res = await fetch('/api/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: postId }) });
                    if(res.status === 200) { alert('Successfully Reshouted! 🚀'); window.location.href = '/dashboard'; }
                    else { alert('MAKE AN ACC LIL BRO 💀'); }
                } catch(e) { alert('Share failed.'); }
            }
        }

        // V83 Follow Engine Frontend
        async function followUser(targetUser) {
            try {
                const res = await fetch('/api/follow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUsername: targetUser }) });
                if(res.status === 200) { window.location.reload(); }
                else { alert('MAKE AN ACC LIL BRO 💀'); }
            } catch(e) { alert('Follow sync failed.'); }
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
                if (response.ok) { window.location.reload(); } 
                else { alert("Identity sync dropped."); }
            } catch (err) { window.location.reload(); }
        }

        // V87: Delegated delete — confirm, POST /delete-post, remove .post-card from DOM
        document.addEventListener('click', async function(e) {
            const deleteBtn = e.target.closest('.delete-btn');
            if (!deleteBtn) return;
            e.preventDefault();
            e.stopPropagation();
            const postCard = deleteBtn.closest('.post-card');
            const postId = deleteBtn.dataset.postId || (postCard && postCard.dataset.postId);
            if (!postId) return;
            if (!confirm('Delete this transmission from the matrix?')) return;
            try {
                const res = await fetch('/delete-post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ postId: postId })
                });
                if (res.status === 200) {
                    if (postCard) postCard.remove();
                } else if (res.status === 401) {
                    alert('Session expired — log in again to delete.');
                    window.location.href = '/login';
                } else if (res.status === 403) {
                    alert('You cannot delete this transmission.');
                } else {
                    alert('Delete sync failed.');
                }
            } catch (err) {
                alert('Delete uplink failed.');
            }
        });

        // V88: Ghost Mode pill in transmit card — POST /toggle-ghost-mode
        (function initGhostModeBtn() {
            const ghostModeBtn = document.getElementById('ghostModeBtn');
            if (!ghostModeBtn) return;

            const syncGhostBtnUI = (isGhost) => {
                ghostModeBtn.classList.toggle('is-active', isGhost);
                ghostModeBtn.dataset.isGhost = isGhost ? 'true' : 'false';
                ghostModeBtn.textContent = isGhost ? '👻 GHOST: ON' : '👻 GHOST: OFF';
                const ghostHidden = document.getElementById('ghostModeHidden');
                if (ghostHidden) ghostHidden.value = isGhost ? 'true' : 'false';
            };

            ghostModeBtn.addEventListener('click', async () => {
                try {
                    const res = await fetch('/toggle-ghost-mode', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'same-origin'
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        syncGhostBtnUI(data.isGhost);
                    } else {
                        alert(data.error || 'Ghost mode sync failed.');
                    }
                } catch (err) {
                    alert('Ghost mode uplink failed.');
                }
            });

            syncGhostBtnUI(ghostModeBtn.dataset.isGhost === 'true');
        })();

        // V87: Sensitive content filter — toggle blur on .sensitive-post-content
        (function initSensitiveFilterBtn() {
            const sensitiveFilterBtn = document.getElementById('sensitiveFilterBtn');
            if (!sensitiveFilterBtn) return;
            let showSensitive = sensitiveFilterBtn.dataset.filterOn !== 'false';
            const statusText = sensitiveFilterBtn.querySelector('.toggle-status-text');
            const applySensitiveBlur = () => {
                document.querySelectorAll('.sensitive-post-content').forEach(el => {
                    if (!showSensitive) {
                        el.classList.add('blur-md', 'select-none', 'sensitive-blurred');
                    } else {
                        el.classList.remove('blur-md', 'select-none', 'sensitive-blurred');
                    }
                });
            };
            const syncSensitiveBtnUI = () => {
                sensitiveFilterBtn.classList.toggle('is-active', showSensitive);
                sensitiveFilterBtn.dataset.filterOn = showSensitive ? 'true' : 'false';
                if (statusText) statusText.textContent = showSensitive ? 'ON' : 'OFF';
                applySensitiveBlur();
            };
            sensitiveFilterBtn.addEventListener('click', () => {
                showSensitive = !showSensitive;
                syncSensitiveBtnUI();
            });
            syncSensitiveBtnUI();
        })();

        // V88: Time Capsule pill — native datetime picker
        (function initTimeCapsuleBtn() {
            const timeCapsuleBtn = document.getElementById('timeCapsuleBtn');
            const timeCapsuleInput = document.getElementById('timeCapsuleUnlockInput');
            if (!timeCapsuleBtn || !timeCapsuleInput) return;

            const formatCapsuleLabel = (isoValue) => {
                if (!isoValue) return '⏳ TIME CAPSULE: OFF';
                const d = new Date(isoValue);
                if (isNaN(d.getTime())) return '⏳ TIME CAPSULE: OFF';
                const stamp = d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                return '⏳ ' + stamp;
            };

            const syncCapsuleUI = () => {
                const hasValue = !!timeCapsuleInput.value;
                timeCapsuleBtn.classList.toggle('is-active', hasValue);
                timeCapsuleBtn.textContent = formatCapsuleLabel(timeCapsuleInput.value);
            };

            timeCapsuleBtn.addEventListener('click', () => {
                if (timeCapsuleInput.value && timeCapsuleBtn.classList.contains('is-active')) {
                    if (confirm('Clear scheduled unlock time?')) {
                        timeCapsuleInput.value = '';
                        syncCapsuleUI();
                    }
                    return;
                }
                if (typeof timeCapsuleInput.showPicker === 'function') {
                    timeCapsuleInput.showPicker();
                } else {
                    timeCapsuleInput.click();
                }
            });

            timeCapsuleInput.addEventListener('change', syncCapsuleUI);
            syncCapsuleUI();
        })();

        // V88: Post sensitive pill — marks this transmission as sensitive
        (function initPostSensitiveBtn() {
            const postSensitiveBtn = document.getElementById('postSensitiveBtn');
            const postSensitiveToggle = document.getElementById('postSensitiveToggle');
            if (!postSensitiveBtn || !postSensitiveToggle) return;

            const syncPostSensitiveUI = () => {
                const isOn = postSensitiveToggle.checked;
                postSensitiveBtn.classList.toggle('is-active', isOn);
                postSensitiveBtn.textContent = isOn ? '⚠️ SENSITIVE: ON' : '⚠️ SENSITIVE: OFF';
            };

            postSensitiveBtn.addEventListener('click', () => {
                postSensitiveToggle.checked = !postSensitiveToggle.checked;
                syncPostSensitiveUI();
            });

            syncPostSensitiveUI();
        })();

        ${THEME_RUNTIME_JS}
        (function applyServerThemePreference() {
            const serverTheme = ${JSON.stringify(user.theme === 'dark' ? 'dark' : 'light')};
            const root = document.documentElement;
            const isDark = serverTheme === 'dark';
            root.classList.toggle('dark', isDark);
            document.body.classList.toggle('dark', isDark);
            localStorage.setItem('xavirox_theme', serverTheme);
            const btn = document.getElementById('cosmicThemeToggle');
            if (btn) {
                btn.classList.toggle('is-dark', isDark);
                btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            }
        })();

        // Feature 28: Draft Auto-save
        const txBar = document.getElementById('txBarEngine');
        if(txBar) {
            const savedDraft = localStorage.getItem('xavirox_draft');
            if(savedDraft) { txBar.value = savedDraft; }
            txBar.addEventListener('input', () => { localStorage.setItem('xavirox_draft', txBar.value); });
            txBar.closest('form') && txBar.closest('form').addEventListener('submit', () => { localStorage.removeItem('xavirox_draft'); });
        }

        // Feature 21: Poll voting
        async function votePoll(postId, optionIndex) {
            try {
                const res = await fetch('/api/poll-vote', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postId, optionIndex }) });
                if(res.ok) window.location.reload();
                else alert('Login required to vote 💀');
            } catch(e) { alert('Vote sync failed.'); }
        }

        // Feature 20: Comment like
        async function likeComment(commentId, btn) {
            try {
                const res = await fetch('/api/like-comment', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ commentId }) });
                if(res.ok) {
                    const data = await res.json();
                    btn.classList.toggle('liked');
                    btn.innerHTML = '👑 ' + data.count;
                } else { alert('Login required 💀'); }
            } catch(e) {}
        }

        // Feature 45: Content warning toggle
        function revealContent(btn) {
            const overlay = btn.closest('.cw-overlay');
            if(overlay) overlay.style.display = 'none';
        }

        // Feature 44: Report post
        async function reportPost(postId) {
            const reason = prompt('Why are you reporting this? (spam / nsfw / hate / fake)');
            if(!reason) return;
            try {
                const res = await fetch('/api/report', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postId, reason }) });
                if(res.ok) alert('Report submitted. Gemini AI will review this. 🛡️');
                else alert('Login required 💀');
            } catch(e) {}
        }

        // Feature 41: Aura gifting
        async function giftAura(targetUser) {
            const amount = prompt('How much aura to gift? (max 50 per day)');
            if(!amount || isNaN(amount)) return;
            try {
                const res = await fetch('/api/gift-aura', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ targetUser, amount: parseInt(amount) }) });
                const data = await res.json();
                alert(data.message || 'Aura gifted! 🎁');
                if(res.ok) window.location.reload();
            } catch(e) {}
        }

        // V86 Ghost Mode Toggle — client-side neon state without reload

        // V86 Ghost Poll vote handler
        async function voteGhostPoll(pollId, optionIndex) {
            try {
                const res = await fetch('/api/poll/' + pollId + '/vote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ optionIndex: optionIndex })
                });
                const data = await res.json();
                if (res.ok) {
                    window.location.reload();
                } else {
                    alert(data.error || 'Vote rejected by the void.');
                }
            } catch (e) {
                alert('Ghost poll sync failed.');
            }
        }

        // V86 Glitch Market purchase
        async function buyMarketItem(itemName, cost) {
            if (!confirm('Spend ' + cost + ' Aura on ' + itemName + '?')) return;
            try {
                const res = await fetch('/api/market/buy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemName: itemName })
                });
                const data = await res.json();
                alert(data.message || (res.ok ? 'Asset unlocked!' : 'Purchase failed.'));
                if (res.ok) window.location.reload();
            } catch (e) {
                alert('Market uplink failed.');
            }
        }

        // V86 Create Ghost Poll
        async function createGhostPoll(formEl) {
            const fd = new FormData(formEl);
            try {
                const res = await fetch('/api/ghost-poll/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question: fd.get('question'),
                        optionA: fd.get('optionA'),
                        optionB: fd.get('optionB'),
                        isAnonymous: true
                    })
                });
                if (res.ok) window.location.reload();
                else alert('Ghost poll deployment failed.');
            } catch (e) {
                alert('Ghost poll uplink failed.');
            }
        }

     // V86 Aura Duel challenge
    async function submitAuraDuel(event) {
        event.preventDefault();
        const opponentInput = document.getElementById('duelOpponent');
        const wagerInput = document.getElementById('duelWager');
        if (!opponentInput || !wagerInput) return;
        
        try {
            const res = await fetch('/api/aura/challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUsername: opponentInput.value.trim(),
                    wager: parseInt(wagerInput.value, 10)
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert('Success: ' + (data.message || 'Operation successful!'));
            } else {
                alert('Error: ' + (data.error || 'Something went wrong'));
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("Server error, please try again.");
        }
    }

    init();
</script>
`;
}

module.exports = app;