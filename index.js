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

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// [AI MODULE IMPORT]
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Vercel / reverse-proxy: required for secure cookies & OAuth HTTPS callbacks
app.set('trust proxy', 1);

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || (
    process.env.NODE_ENV === 'production'
        ? 'https://xavirox-project.vercel.app/auth/google/callback'
        : 'http://localhost:3000/auth/google/callback'
);

// Unified auth helpers (express-session + Passport)
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
            { itemName: 'neon-glow', costInAura: 150, itemType: 'cosmetic', iconClass: 'fa-sun', description: 'Neon cyan aura frame glow' },
            { itemName: 'cyber-badge', costInAura: 250, itemType: 'badge', iconClass: 'fa-shield-halved', description: 'Elite cyber verification badge' },
            { itemName: 'ghost-cloak', costInAura: 400, itemType: 'cosmetic', iconClass: 'fa-ghost', description: 'Purple ghost transmission cloak' },
            { itemName: 'sigma-crown', costInAura: 750, itemType: 'badge', iconClass: 'fa-crown', description: 'Golden sigma rank crown asset' }
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

// --- [AI HELPER ENGINE] ---
function fileToGenerativePart(buffer, mimeType) {
    return { inlineData: { data: buffer.toString("base64"), mimeType } };
}

// --- [MASTER UI ENGINE V83] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global', allUsers = [], notifCount = 0) => {
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
        }
        * { margin: 0; padding: 0; box-sizing: border-box; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        body { background: var(--bg); color: #fff; font-family: 'Inter', system-ui, sans-serif; overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh; }

        /* Animated cosmic background gradient mesh */
        body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -3; background: radial-gradient(ellipse at 20% 50%, rgba(112,0,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,242,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255,0,127,0.05) 0%, transparent 50%); pointer-events: none; }
        
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: radial-gradient(circle at center, #060a10 0%, #000 100%); }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.3; animation: twinkle var(--d) infinite; }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; transform: scale(1.4); box-shadow: 0 0 12px rgba(0,242,255,0.6); } }

        /* ================================================================
           V85 GLASSMORPHISM CARD SYSTEM — Premium blur + neon borders
           ================================================================ */
        /* V87 Premium glass — zinc-900/40 + backdrop-blur-lg + white/10 border */
        .glass-surface, .card, .post-card, .bento-item, .ghost-poll-card, .duel-card, .glitch-market-card, .transmit-card {
            background: rgba(24, 24, 27, 0.4) !important;
            backdrop-filter: blur(16px) saturate(160%);
            -webkit-backdrop-filter: blur(16px) saturate(160%);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .card {
            border-radius: 28px;
            padding: 30px;
            margin-bottom: 25px;
            position: relative;
            box-shadow: 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .glass-btn, .action-btn, .create-btn, .nav-btn-circle, .genz-search, .cosmic-toggle-btn {
            background: rgba(0, 0, 0, 0.4) !important;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .dynamic-island, .feed-search-bar {
            background: rgba(24, 24, 27, 0.4) !important;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
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
            transition: all 0.25s ease;
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
        .card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, rgba(0,242,255,0.03) 0%, transparent 50%, rgba(112,0,255,0.03) 100%); pointer-events: none; }
        .card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.7), var(--neon-cyan-glow), inset 0 1px 0 rgba(0,242,255,0.1); }
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
        .nav-btn-circle { width: 44px; height: 44px; background: var(--glass); border: 1px solid transparent; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.7); text-decoration: none; font-size: 16px; position: relative; transition: all 0.25s ease; flex-shrink: 0; }
        .nav-btn-circle:hover { border-color: var(--cyan); box-shadow: var(--neon-cyan-glow); background: rgba(0,242,255,0.08); color: var(--cyan); transform: scale(1.08); }
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
            transform: translateX(-50%);
            width: min(320px, 90vw);
            height: 48px;
            background: rgba(0,0,0,0.85);
            border: 1px solid var(--border);
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
            backdrop-filter: blur(24px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .dynamic-island:hover { width: min(420px, 92vw); height: 75px; border-color: ${auraColor}; box-shadow: var(--dynamic-glow); background: #000; }

        /* V88 — Unified transmit pill row (GHOST / SENSITIVE / TIME CAPSULE) */
        .transmit-pill-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            margin-top: 16px;
            padding-bottom: 8px;
        }
        .transmit-pill-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(24, 24, 27, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgb(39, 39, 42);
            color: rgb(161, 161, 170);
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        .transmit-pill-btn:hover {
            border-color: #a855f7;
            color: #e4e4e7;
            transform: scale(1.02);
        }
        .transmit-pill-btn:active { transform: scale(0.98); }
        .transmit-pill-btn.is-active {
            border-color: #a855f7;
            color: #fff;
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
            background: rgba(24, 24, 27, 0.65);
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

        .genz-time-capsule { display: inline-flex; align-items: center; background: rgba(0,242,255,0.04); border: 1px solid rgba(0,242,255,0.2); border-radius: 30px; padding: 4px 14px 4px 4px; cursor: pointer; transition: all 0.3s; backdrop-filter: blur(10px); }
        .genz-time-capsule:hover { background: rgba(0,242,255,0.08); box-shadow: var(--neon-cyan-glow); }
        .capsule-icon-box { background: var(--cyan); color: #000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; margin-right: 10px; box-shadow: var(--neon-cyan-glow); animation: pulseCapsule 2s infinite alternate; }
        @keyframes pulseCapsule { 0% { transform: scale(1); box-shadow: 0 0 8px var(--cyan); } 100% { transform: scale(1.1); box-shadow: 0 0 20px var(--cyan); } }
        .capsule-text { display: flex; flex-direction: column; justify-content: center; }
        .capsule-label { font-size: 8px; font-weight: 900; letter-spacing: 1.5px; color: var(--cyan); text-transform: uppercase; margin-bottom: 2px; opacity: 0.8; }
        .genz-datetime { background: transparent; border: none; color: #fff; font-family: 'Inter', sans-serif; font-size: 12px; outline: none; font-weight: 800; cursor: pointer; }

        /* V83 INTERACTION BAR */
        .interaction-bar { display: flex !important; justify-content: flex-start !important; gap: 10px !important; flex-wrap: wrap !important; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.06); }
        .action-btn { background: rgba(255,255,255,0.03); border: 1px solid transparent; color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 6px; border-radius: 10px; padding: 6px 12px !important; backdrop-filter: blur(10px); }
        .action-btn:hover { opacity: 1; color: var(--cyan); background: rgba(0,242,255,0.08); border-color: rgba(0,242,255,0.25); box-shadow: var(--neon-cyan-glow); transform: scale(1.05); }
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
        .create-btn { display: block; width: 100%; background: linear-gradient(90deg, var(--v), var(--p)); color: #fff; border: none; padding: 16px; border-radius: 16px; font-weight: 900; cursor: pointer; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; text-align: center; box-shadow: 0 5px 20px rgba(112,0,255,0.4); }
        .create-btn:hover { filter: brightness(1.2); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,0,127,0.5), var(--neon-pink-glow); }
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
        .leaderboard-row { display: flex; align-items: center; background: rgba(255,255,255,0.02); backdrop-filter: blur(10px); border: 1px solid var(--border); padding: 14px 20px; border-radius: 20px; margin-bottom: 12px; gap: 15px; transition: all 0.2s; }
        .leaderboard-row:hover { border-color: var(--border-hover); box-shadow: var(--neon-cyan-glow); background: rgba(0,242,255,0.03); }

        /* V83 SHARED POST STYLES */
        .shared-post-wrapper { border-left: 2px solid rgba(0,242,255,0.4); padding-left: 15px; margin-top: 10px; background: rgba(0,242,255,0.02); border-radius: 0 16px 16px 0; }
        .shared-indicator { font-size: 10px; color: var(--cyan); font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }

        /* ================================================================
           V84 FEATURE STYLES — ALL PRESERVED
           ================================================================ */
        .poll-option { background: rgba(255,255,255,0.03); backdrop-filter: blur(15px); border: 1px solid var(--border); border-radius: 14px; padding: 12px 18px; margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.3s; position: relative; overflow: hidden; }
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
        body.light-mode { background: #f0f4f8; color: #111; }
        body.light-mode .card { background: rgba(255,255,255,0.92); border-color: rgba(0,0,0,0.1); color: #111; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        body.light-mode .stars-container { background: #e2e8f0; }
        body.light-mode .genz-search { background: rgba(0,0,0,0.06); color: #111; }
        body.light-mode .dynamic-island { background: rgba(240,244,248,0.95); color: #111; }
        body.light-mode .comment-node { background: rgba(0,0,0,0.04); }
        body.light-mode .ghost-input, body.light-mode .auth-input, body.light-mode .comment-mini-input { background: rgba(0,0,0,0.05); color: #111; }
        body.light-mode .cosmic-footer { background: rgba(220,228,240,0.95); }
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
        .ghost-poll-option { position: relative; overflow: hidden; background: rgba(112,0,255,0.06); border: 1px solid rgba(112,0,255,0.2); border-radius: 16px; padding: 14px 20px; margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; }
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
        .gpo-vote-btn { background: linear-gradient(90deg, var(--v), var(--p)); color: #fff; border: none; padding: 8px 20px; border-radius: 50px; font-size: 10px; font-weight: 900; cursor: pointer; letter-spacing: 1px; box-shadow: var(--neon-purple-glow); transition: all 0.3s; }
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
<body>
    <div class="stars-container" id="stars"></div>
    <div class="top-left-nav">
        <div class="nav-row">
            <div class="nav-item"><a href="/dashboard" class="nav-btn-circle"><i class="fas fa-rocket"></i></a><span class="icon-label">Orbit</span></div>
            <div class="nav-item"><a href="/leaderboard" class="nav-btn-circle" style="color: #ffea00;"><i class="fas fa-trophy"></i></a><span class="icon-label">Rankings</span></div>
            <div class="nav-item"><a href="/discover" class="nav-btn-circle" style="color: var(--p);"><i class="fas fa-compass"></i></a><span class="icon-label">Discover</span></div>
            ${!isGuest ? `<div class="nav-item"><a href="/notifications" class="nav-btn-circle"><i class="fas fa-bell"></i>${notifCount > 0 ? `<div class="notif-badge">${notifCount}</div>` : ''}</a><span class="icon-label">Alerts</span></div>` : ''}
            ${!isGuest ? `<div class="nav-item"><a href="/dms" class="nav-btn-circle"><i class="fas fa-envelope"></i></a><span class="icon-label">DMs</span></div>` : ''}
            <div class="nav-item"><a href="/portfolio" class="nav-btn-circle"><i class="fas fa-fingerprint"></i></a><span class="icon-label">Identity</span></div>
            ${!isGuest ? `<div class="nav-item"><a href="/settings" class="nav-btn-circle" style="color:#aaa;"><i class="fas fa-gear"></i></a><span class="icon-label">Settings</span></div>` : ''}
            ${!isGuest ? `<div class="nav-item"><a href="/logout" class="nav-btn-circle" style="color:var(--p)"><i class="fas fa-power-off"></i></a><span class="icon-label">Eject</span></div>` : ''}
            ${isGuest ? `<div class="nav-item" style="margin-top:20px; padding-top:15px; border-top:1px solid var(--border);"><a href="/auth/google" class="google-oauth-badge google-oauth-sidebar"><i class="fab fa-google"></i> GOOGLE SYNC</a></div>` : ''}
        </div>
    </div>
    <!-- V86: Search top-left | Dynamic Island top-center -->
    <div class="feed-search-bar fixed top-4 left-4 z-50 w-64">
        <input type="text" class="genz-search" placeholder="SEARCH THE VOID..." onkeyup="searchVoid(this.value)">
    </div>
    <div class="dynamic-island glass-surface fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full">
        ${userAvatarHtml}
        <div style="flex: 1;">
            <div class="island-main">${isGuest ? "⚡ AURA: MAKE AN ACC LIL BRO 💀" : "⚡ AURA LEVEL: " + user.aura}</div>
            <div class="island-detail">${isGuest ? "ACCESS REJECTED" : "MATRIX SECURE 🟢"}</div>
        </div>
    </div>
    ${!isGuest ? `<div class="cosmic-controls-bar glass-surface">
        <button type="button" id="sensitiveFilterBtn" class="cosmic-toggle-btn glass-btn is-active" data-filter-on="true" title="Blur sensitive posts in feed">
            <span class="indicator-dot"></span>
            <span>FEED FILTER</span>
            <span class="toggle-status-text">ON</span>
        </button>
    </div>` : ''}
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
                ${!isGuest ? `<a href="/dashboard?sector=Following" style="display:block; color:#00ff88; margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-user-group"></i> FOLLOWING FEED</a>` : ''}
                <a href="/discover" style="display:block; color:var(--p); margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-compass"></i> DISCOVER</a>
                <a href="/dashboard?sector=confessions" style="display:block; color:#ffea00; margin-bottom:15px; text-decoration:none; font-weight:900;"><i class="fas fa-ghost"></i> #CONFESSIONS</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#ccc; font-size:12px; font-weight:700; text-decoration:none; margin-top:12px; opacity:0.8;"># ${s.name.toUpperCase()}</a>`).join('')}
                ${!isGuest ? `<button type="button" class="create-btn" style="margin-top:25px; font-size:10px;" onclick="let n=prompt('Name the new community / sector?'); if(n) location.href='/create-sector?name='+n">+ BUILD COMMUNITY</button>` : ''}
            </div>
            <div class="card" style="border-color: rgba(255,234,0,0.2);">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:15px;"><i class="fas fa-fire" style="color:var(--p);"></i> TRENDING SECTORS</h4>
                ${sectors.slice(0,4).map(s => `<a href="/dashboard?sector=${s.name}" class="trending-sector-pill"># ${s.name.toUpperCase()}</a>`).join('')}
                <a href="/dashboard?sector=confessions" class="trending-sector-pill">#CONFESSIONS</a>
            </div>
            ${!isGuest ? `<div class="card" style="border-color: rgba(0,242,255,0.15);">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:12px;"><i class="fas fa-bolt" style="color:var(--cyan);"></i> QUICK ACTIONS</h4>
                <button type="button" onclick="toggleTheme()" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); margin-bottom:10px; font-size:10px;"><i class="fas fa-circle-half-stroke"></i> TOGGLE THEME</button>
                <a href="/settings" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); font-size:10px;"><i class="fas fa-gear"></i> SETTINGS</a>
            </div>` : ''}
            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px;">FEEDBACK</h4>
                <textarea id="fbTxt" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid #333; border-radius:15px; color:#fff; padding:15px; margin-top:12px; outline:none; font-size:12px;" rows="2" placeholder="Drop thoughts..."></textarea>
                <button type="button" onclick="this.innerText='COOKED! 🔥'" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border); margin-top:10px;">SEND</button>
            </div>
        </div>
    </div>

    <footer class="cosmic-footer">
        <div class="footer-links">
            <a href="mailto:xavirox.co@gmail.com" class="footer-link"><i class="fas fa-headset"></i> Support</a>
            <a href="mailto:xavirox.co@gmail.com" class="footer-link"><span><i class="fas fa-shield-halved"></i></span> DMCA Notice</a>
        </div>
        <p style="font-size: 9px; opacity: 0.3; letter-spacing: 2px; font-weight: 700;">&copy; 2026 XAVIROX COSMIC OS V86 // ALL ENGINES OPERATIONAL</p>
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
        
        // V83 Legacy Like/Save Interaction (Modified to handle reacts and saves)
        async function interact(event, postId, type) {
            try {
                const res = await fetch('/interact', { 
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: postId, type: type }) 
                });
                if(res.status === 200) {
                    const data = await res.json();
                    if(type === 'save') {
                        const targetBtn = event ? event.currentTarget : null;
                        if(targetBtn) {
                            targetBtn.classList.toggle('active-save');
                            targetBtn.innerHTML = targetBtn.classList.contains('active-save') ? '<i class="fas fa-bookmark"></i> ARCHIVED' : '<i class="fas fa-bookmark"></i> SAVE';
                        }
                    } else {
                        // Naya React System Update View
                        window.location.reload(); 
                    }
                } else if(res.status === 401) {
                    alert('MAKE AN ACC LIL BRO 💀'); window.location.href = '/login';
                }
            } catch(err) { window.location.reload(); }
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

        // V83 Block Engine Frontend
        async function blockUser(targetUser) {
            if(confirm("Block this user? You won't see their posts anymore.")) {
                try {
                    const res = await fetch('/api/block', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUsername: targetUser }) });
                    if(res.status === 200) { window.location.href='/dashboard'; }
                } catch(e) { alert('Block sync failed.'); }
            }
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

        function searchVoid(query) {
            let cards = document.querySelectorAll('.feed .post-card, .feed .card.p-node');
            cards.forEach(card => {
                let text = card.innerText.toLowerCase();
                card.style.display = text.includes(query.toLowerCase()) ? 'block' : 'none';
            });
        }

        // Feature 47: Dark/Light Mode Toggle
        function toggleTheme() {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('xavirox_theme', isLight ? 'light' : 'dark');
            fetch('/api/theme', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ theme: isLight ? 'light' : 'dark' }) });
        }
        (function() {
            const savedTheme = localStorage.getItem('xavirox_theme');
            if (savedTheme === 'light') document.body.classList.add('light-mode');
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
                alert(data.message || data.error || 'Duel resolved.');
                if (res.ok) window.location.reload();
            } catch (e) {
                alert('Duel matrix sync failed.');
            }
        }

        // Feature 50: Edit post
        function editPost(postId, currentContent) {
            const newContent = prompt('Edit your transmission:', currentContent);
            if(!newContent || newContent === currentContent) return;
            fetch('/api/edit-post', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postId, content: newContent }) })
                .then(r => r.ok ? window.location.reload() : alert('Edit failed.'))
                .catch(() => alert('Edit sync failed.'));
        }

        // Feature 25: Pin post
        function pinPost(postId) {
            fetch('/api/pin-post', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ postId }) })
                .then(r => r.ok ? (alert('Post pinned to your profile! 📌'), window.location.reload()) : alert('Pin failed.'));
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
        const user = req.session.user ? await User.findOne({ username: req.session.user.username }) : null;
        const notifCount = user ? await Notification.countDocuments({ recipient: user.username, isRead: false }) : 0;

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

        const leaderboardContent = `<div class="card" style="border-color: var(--cyan); background: rgba(0, 242, 255, 0.01);"><div style="text-align: center; margin-bottom: 30px;"><span style="font-size: 10px; font-weight: 900; letter-spacing: 3px; color: var(--cyan); text-transform: uppercase;">AURA MATRIX PROTOCOL</span><h1 style="font-size: 28px; font-weight: 900; letter-spacing: 1px; margin-top: 5px;">NETWORK LEADERBOARD</h1></div><div class="podium-container"><div class="podium-card rank-2">${makePodiumAvatar(rank2User, 'var(--p)')}<span style="font-weight: 800; font-size: 14px; color: #fff; text-overflow: ellipsis; overflow: hidden; width: 100%;">@${rank2User.username} ${rank2User.aura >= 500 ? '<i class="fas fa-circle-check verified-badge"></i>' : ''}</span><span style="font-size:9px; opacity:0.5; margin-top:3px; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${rank2User.bio}"</span><span style="font-size: 12px; font-weight: 900; color: var(--p); margin-top: auto;">${rank2User.aura} AURA</span><div class="podium-rank-badge">2</div></div><div class="podium-card rank-1"><div class="podium-crown" style="color: #ffea00;"><i class="fas fa-crown"></i></div>${makePodiumAvatar(rank1User, '#ffea00')}<span style="font-weight: 900; font-size: 16px; color: #fff; text-overflow: ellipsis; overflow: hidden; width: 100%;">@${rank1User.username} ${rank1User.aura >= 500 ? '<i class="fas fa-circle-check verified-badge"></i>' : ''}</span><span style="font-size:10px; color:var(--cyan); opacity:0.8; margin-top:3px; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${rank1User.bio}"</span><span style="font-size: 13px; font-weight: 900; color: var(--cyan); margin-top: auto;">${rank1User.aura} AURA</span><div class="podium-rank-badge">1</div></div><div class="podium-card rank-3">${makePodiumAvatar(rank3User, 'var(--v)')}<span style="font-weight: 800; font-size: 13px; color: #fff; text-overflow: ellipsis; overflow: hidden; width: 100%;">@${rank3User.username} ${rank3User.aura >= 500 ? '<i class="fas fa-circle-check verified-badge"></i>' : ''}</span><span style="font-size:9px; opacity:0.5; margin-top:3px; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${rank3User.bio}"</span><span style="font-size: 11px; font-weight: 900; color: var(--v); margin-top: auto;">${rank3User.aura} AURA</span><div class="podium-rank-badge">3</div></div></div><div style="margin-top: 20px;"><h4 style="font-size: 10px; opacity: 0.4; letter-spacing: 2px; margin-bottom: 15px; text-transform: uppercase;">Matrix Contenders</h4>${remainingUsersHtml || '<p style="text-align:center; font-size:12px; opacity:0.3; padding: 20px;">No further structural matrix records found.</p>'}</div></div>`;

        res.send(MASTER_UI(leaderboardContent, user, sectors, 'Leaderboard', [], notifCount));
    } catch (err) { res.redirect('/dashboard'); }
});

// --- [DASHBOARD RENDER ENGINE - V83 SOCIAL FEED] ---
app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    const currentTime = new Date();
    const user = req.session.user ? await User.findOne({ username: req.session.user.username }) : null;
    const notifCount = user ? await Notification.countDocuments({ recipient: user.username, isRead: false }) : 0;

    let feedFilter = {};
    if (activeSector === 'Following' && user) {
        // V83 Following Feed Filter Logic & Block Filter
        feedFilter = { author: { $in: user.following, $nin: user.blockedUsers }, isAnonymous: false };
    } else if (activeSector !== 'Global') {
        feedFilter = { sector: activeSector };
        if(user) feedFilter.author = { $nin: user.blockedUsers };
    } else if (user) {
        feedFilter.author = { $nin: user.blockedUsers };
    }

    const posts = await Post.find(buildFeedQuery(feedFilter, currentTime)).sort({ date: -1 });
    const sectors = await Sector.find();
    const allUsers = await User.find({}, 'username avatarUrl aura nameChanged coverPic bio');

    const marketItems = await MarketItem.find().sort({ costInAura: 1 });
    const ghostPolls = await GhostPoll.find().sort({ date: -1 }).limit(6);
    const unlockedSet = user && user.unlockedAssets ? user.unlockedAssets : [];

    const glitchMarketHtml = user ? `<div class="card glitch-market-card">
        <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:8px;"><i class="fas fa-store" style="color:#ffea00;"></i> GLITCH MARKET</h4>
        <div class="aura-balance-pill"><i class="fas fa-bolt"></i> ${user.aura} AURA AVAILABLE</div>
        <div class="glitch-market-grid">
            ${marketItems.map(item => {
                const owned = unlockedSet.includes(item.itemName);
                return `<div class="market-item-bento ${owned ? 'owned' : ''}">
                    <span class="market-item-icon"><i class="fas ${item.iconClass}"></i></span>
                    <div class="market-item-name">${item.itemName.toUpperCase()}</div>
                    <div class="market-item-cost">${item.costInAura} AURA</div>
                    <button type="button" class="market-buy-btn" ${owned ? 'disabled' : ''} onclick="buyMarketItem('${item.itemName}', ${item.costInAura})">${owned ? 'OWNED ✓' : 'BUY ASSET'}</button>
                </div>`;
            }).join('')}
        </div>
    </div>` : '';

    const ghostPollCreateForm = user ? `<form onsubmit="event.preventDefault(); createGhostPoll(this);" style="margin-bottom:20px; padding:18px; background:rgba(112,0,255,0.06); border-radius:20px; border:1px dashed rgba(112,0,255,0.3);">
        <p style="font-size:10px; font-weight:900; color:var(--v); margin-bottom:10px; letter-spacing:1px;">DEPLOY NEW GHOST POLL</p>
        <input type="text" name="question" class="comment-mini-input" style="margin-bottom:8px;" placeholder="Poll question..." required>
        <input type="text" name="optionA" class="comment-mini-input" style="margin-bottom:8px;" placeholder="Option A" required>
        <input type="text" name="optionB" class="comment-mini-input" style="margin-bottom:10px;" placeholder="Option B" required>
        <button type="submit" class="create-btn" style="font-size:10px; background:linear-gradient(90deg, var(--v), var(--p));">LAUNCH GHOST POLL 👻</button>
    </form>` : '';

    const ghostPollsHtml = `<div class="ghost-poll-bento-wrap">
        <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:12px;"><i class="fas fa-mask" style="color:var(--v);"></i> GHOST POLLS — ANONYMOUS VOTE MATRIX</h4>
        ${ghostPollCreateForm}
        <div class="bento-grid">
            ${ghostPolls.length > 0 ? ghostPolls.map((gp) => {
                const fillClasses = ['gpo-fill-cyan', 'gpo-fill-purple', 'gpo-fill-pink', 'gpo-fill-yellow'];
                const totalVotes = gp.totalVotes || gp.options.reduce((s, o) => s + (o.voteCount || 0), 0);
                const userVoted = user && gp.votedUsers && gp.votedUsers.some(vid => String(vid) === String(user._id));
                const optionsHtml = gp.options.map((opt, idx) => {
                    const pct = totalVotes > 0 ? Math.round(((opt.voteCount || 0) / totalVotes) * 100) : 0;
                    const fillClass = fillClasses[idx % fillClasses.length];
                    const canVote = user && !userVoted;
                    return `<div class="ghost-poll-option ${userVoted ? 'gpo-voted' : ''}" ${canVote ? `onclick="voteGhostPoll('${gp._id}', ${idx})"` : ''}>
                        <div class="gpo-fill ${fillClass}" style="width:${userVoted ? pct : 0}%;"></div>
                        <span class="gpo-option-text">${opt.text}</span>
                        ${userVoted ? `<span class="gpo-vote-count">${opt.voteCount || 0}</span><span class="gpo-pct-bar-label">${pct}%</span>` : ''}
                    </div>`;
                }).join('');
                return `<div class="ghost-poll-card">
                    <div class="ghost-poll-header">
                        <div class="ghost-poll-icon"><i class="fas fa-ghost"></i></div>
                        <div>
                            <div class="ghost-poll-question">${gp.question}</div>
                            <div class="ghost-poll-meta">${gp.isAnonymous ? '👻 ANONYMOUS SIGNAL' : 'MATRIX POLL'} • ${totalVotes} VOTES</div>
                        </div>
                    </div>
                    ${optionsHtml}
                    <div class="ghost-poll-footer">
                        <span class="gpo-total-votes">${totalVotes} total transmissions</span>
                    </div>
                </div>`;
            }).join('') : '<p style="opacity:0.3; font-size:12px; text-align:center; padding:20px;">No ghost polls in orbit. Deploy one above.</p>'}
        </div>
    </div>`;

    const auraDuelPanelHtml = user ? `<div class="card aura-duel-panel duel-card">
        <h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:var(--p); font-weight:900;"><i class="fas fa-bolt"></i> AURA DUELS — PvP WAGER MATRIX</h4>
        <p style="font-size:11px; opacity:0.5; margin-bottom:15px;">Challenge another user. Winner takes the wager instantly via secure void algorithm.</p>
        <form class="duel-challenge-form" onsubmit="submitAuraDuel(event)">
            <input type="text" id="duelOpponent" placeholder="@opponent username" required>
            <input type="number" id="duelWager" placeholder="Aura wager amount" min="1" max="${user.aura}" required>
            <button type="submit" class="duel-challenge-btn">INITIATE DUEL ⚔️</button>
        </form>
    </div>` : '';

    const postForm = `<div class="card transmit-card" style="border-color: rgba(255,255,255,0.2);">
        ${!user ? `<button type="button" class="create-btn" onclick="location.href='/login'">SYNC TO TRANSMIT ⚡</button>` : `
            <form action="/addpost" method="POST" enctype="multipart/form-data" id="mainPostForm">
                <textarea id="txBarEngine" name="content" style="width:100%; background:transparent; border:none; color:#fff; outline:none; font-size:18px; min-height:80px; font-weight:500;" placeholder="Transmit a signal... You can @mention and #tag users too!" required></textarea>
                <input type="hidden" name="sector" value="${activeSector === 'Following' ? 'Global' : activeSector}">
                <input type="hidden" name="isAnonymous" id="ghostModeHidden" value="${(user.isGhost || activeSector==='confessions') ? 'true' : 'false'}">
                <input type="checkbox" name="isSensitive" id="postSensitiveToggle" class="time-capsule-picker-hidden" tabindex="-1" aria-hidden="true">

                <div class="transmit-pill-row flex flex-wrap items-center gap-3 mt-4 pb-2">
                    <button type="button" id="ghostModeBtn" class="transmit-pill-btn bg-zinc-900/40 backdrop-blur-md border border-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider hover:border-purple-500 transition-all duration-300 ${(user.isGhost || activeSector==='confessions') ? 'is-active' : ''}" data-is-ghost="${(user.isGhost || activeSector==='confessions') ? 'true' : 'false'}">
                        ${(user.isGhost || activeSector==='confessions') ? '👻 GHOST: ON' : '👻 GHOST: OFF'}
                    </button>
                    <button type="button" id="postSensitiveBtn" class="transmit-pill-btn bg-zinc-900/40 backdrop-blur-md border border-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider hover:border-purple-500 transition-all duration-300">
                        ⚠️ SENSITIVE: OFF
                    </button>
                    <button type="button" id="timeCapsuleBtn" class="transmit-pill-btn bg-zinc-900/40 backdrop-blur-md border border-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider hover:border-purple-500 transition-all duration-300">
                        ⏳ TIME CAPSULE: OFF
                    </button>
                    <input type="datetime-local" id="timeCapsuleUnlockInput" name="unlockAt" class="time-capsule-picker-hidden" aria-label="Time capsule unlock schedule">
                </div>

                <input type="text" name="tags" id="tagsInput" style="width:100%; background:transparent; border:none; border-top:1px solid var(--border); color:rgba(0,242,255,0.8); outline:none; font-size:12px; padding:10px 0; font-weight:700;" placeholder="#add #tags #here (optional)">

                <div class="transmit-tools-row">
                    <label class="transmit-pill-btn bg-zinc-900/40 backdrop-blur-md border border-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider hover:border-purple-500 transition-all duration-300" style="cursor:pointer; margin:0;">
                        <i class="fas fa-image"></i> MEDIA
                        <input type="file" name="media" hidden accept="image/*,video/*,image/gif">
                    </label>
                    <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
                        <button type="button" onclick="togglePollForm()" class="transmit-pill-btn bg-zinc-900/40 backdrop-blur-md border border-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider hover:border-purple-500 transition-all duration-300">
                            <i class="fas fa-chart-bar"></i> POLL
                        </button>
                        <button type="submit" class="create-btn glass-btn hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" style="width:auto; padding:12px 28px; border-radius:12px; font-size:12px;">TRANSMIT 🚀</button>
                    </div>
                </div>
                <div id="pollFormSection" style="display:none; margin-top:15px; border-top:1px solid var(--border); padding-top:15px;">
                    <p style="font-size:10px; font-weight:900; color:var(--cyan); margin-bottom:10px; letter-spacing:1px;"><i class="fas fa-chart-bar"></i> POLL MODE ACTIVATED</p>
                    <input type="hidden" name="isPoll" id="isPollInput" value="0">
                    <input type="text" name="pollA" class="comment-mini-input" style="margin-bottom:8px;" placeholder="Option A: ...">
                    <input type="text" name="pollB" class="comment-mini-input" placeholder="Option B: ...">
                </div>
            </form>
            <script>
                function togglePollForm() {
                    const sec = document.getElementById('pollFormSection');
                    const isPollInput = document.getElementById('isPollInput');
                    const visible = sec.style.display !== 'none';
                    sec.style.display = visible ? 'none' : 'block';
                    isPollInput.value = visible ? '0' : '1';
                }
            </script>`}
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
            const nodeAvatarSnippet = cAvatar ? `<a href="/portfolio?user=${c.author}"><img src="${cAvatar}" class="comment-header-avatar"></a>` : `<a href="/portfolio?user=${c.author}"><img src="${defAvatar}" class="comment-header-avatar"></a>`;
            const commentLikes = c.likes ? c.likes.length : 0;
            const userLikedComment = user && c.likes && c.likes.includes(user.username);

            return `<div class="comment-node ${isNested ? 'nested' : ''}"><div style="display:flex; align-items:center; gap:8px; font-size:11px; opacity:0.9; font-weight:bold; color:var(--cyan)">${c.isAnonymous ? '<div class="comment-avatar-fallback" style="background:#222;"><i class="fas fa-mask"></i></div> <span>GHOST</span>' : nodeAvatarSnippet + '<span><a href="/portfolio?user=' + c.author + '" style="color:inherit; text-decoration:none;">@' + c.author + '</a>' + isVer + '</span>'} <span style="opacity:0.4; font-weight:normal; margin-left:5px;">${new Date(c.date).toLocaleTimeString()}</span>${user ? `<button type="button" class="comment-like-btn ${userLikedComment ? 'liked' : ''}" onclick="likeComment('${c._id}', this)">👑 ${commentLikes}</button>` : `<span style="font-size:10px; opacity:0.4; margin-left:5px;">👑 ${commentLikes}</span>`}</div><p style="font-size:13px; margin-top:5px; color:#ddd; padding-left:32px; font-weight:500;">${c.content}</p>${user ? `<button type="button" class="reply-trigger-btn" style="margin-left:32px;" onclick="toggleReplyForm('${c._id}')"><i class="fas fa-reply"></i> Reply</button><div class="reply-form-wrapper" id="form-${c._id}" style="padding-left:32px;"><form onsubmit="submitCommentAjax(event, this, 'tree-container-${c._id}')"><input type="hidden" name="postId" value="${c.postId}"><input type="hidden" name="parentCommentId" value="${c._id}"><input type="text" name="content" class="comment-mini-input" placeholder="Type reply execution..." required></form></div>` : ''}<div id="tree-container-${c._id}">${renderCommentTree(commentsList, c._id, true)}</div></div>`;
        }).join('');
    }

    const html = posts.map(p => {
        const isSaved = user && user.savedPosts && user.savedPosts.includes(p._id.toString());
        const postAuthor = p.author === 'GHOST_SIGNAL' ? null : allUsers.find(u => u.username === p.author);
        const currentAura = postAuthor ? postAuthor.aura : p.authorAura;
        const postAuraColor = currentAura >= 500 ? 'var(--cyan)' : currentAura < 50 ? '#ff0000' : 'var(--p)';
        const showDelete = user && (
            user.username === p.author ||
            user.username === p.ghostOwner ||
            (p.authorId && user._id && String(p.authorId) === String(user._id)) ||
            user.username === 'xavirox'
        );
        const showEdit = user && (user.username === p.author || user.username === p.ghostOwner) && !p.isAnonymous;
        const showPin = user && user.username === p.author && !p.isAnonymous;
        const postComments = allComments.filter(c => String(c.postId) === String(p._id));
        const commentsRenderedTree = renderCommentTree(postComments, null, false);
        const isVer = postAuthor && postAuthor.aura >= 500 ? '<i class="fas fa-circle-check verified-badge" title="Certified W"></i>' : '';
        const currentAvatar = (postAuthor && postAuthor.avatarUrl) ? postAuthor.avatarUrl : p.authorAvatar;
        const defAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author}&backgroundColor=000000`;
        const ghostAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=ghost&backgroundColor=111111`;
        const postAvatarSnippet = currentAvatar ? `<a href="/portfolio?user=${p.author}"><img src="${currentAvatar}" class="post-pfp"></a>` : `<a href="/portfolio?user=${p.author}"><img src="${defAvatar}" class="post-pfp"></a>`;

        // 🧬 V83 REACT SYSTEM LOGIC
        const rCount = { crown: p.reactions?.crown?.length || 0, skull: p.reactions?.skull?.length || 0, ghost: p.reactions?.ghost?.length || 0, fire: p.reactions?.fire?.length || 0, heart: p.reactions?.heart?.length || 0 };
        const uReact = user ? Object.keys(p.reactions || {}).find(k => p.reactions[k].includes(user.username)) : null;

        // Feature 26: Trending badge (5+ total reactions)
        const totalReacts = rCount.crown + rCount.skull + rCount.fire + rCount.heart;
        const trendingBadgeHtml = totalReacts >= 5 ? `<span class="trending-badge">🔥 TRENDING</span>` : '';

        // Feature 29: Word count badge
        const wordCount = p.content ? p.content.split(/\s+/).length : 0;
        const wordBadge = wordCount > 100 ? `<span class="word-count-badge">📡 Long Signal</span>` : '';

        // Feature 27: Hashtag rendering
        const tagsHtml = (p.tags && p.tags.length > 0) ? `<div style="margin-top:8px;">${p.tags.map(t => `<a href="/search?tag=${t}" class="post-tag">#${t}</a>`).join('')}</div>` : '';

        // Feature 38: Streak badge on posts
        const streakBadge = postAuthor && postAuthor.loginStreak >= 3 ? `<span class="streak-badge">🔥 ${postAuthor.loginStreak}d streak</span>` : '';

        // Feature 24: Link preview
        const linkPreviewHtml = p.linkPreview && p.linkPreview.title ? `<div class="link-preview-card"><a href="${p.linkPreview.url}" target="_blank" rel="noopener">${p.linkPreview.image ? `<img src="${p.linkPreview.image}" class="link-preview-img" onerror="this.style.display='none'">` : ''}<div class="link-preview-body"><div class="link-preview-title">${p.linkPreview.title}</div><div class="link-preview-desc">${p.linkPreview.description || ''}</div><div class="link-preview-url">${p.linkPreview.url}</div></div></a></div>` : '';

        // Feature 45: Content warning overlay
        const cwOverlay = p.isSensitive ? `<div class="cw-overlay"><span class="cw-label">⚠️ SENSITIVE CONTENT</span><p style="font-size:11px; opacity:0.6; text-align:center; padding:0 20px;">This post has been flagged as sensitive.</p><button onclick="revealContent(this)" style="background:var(--p); border:none; color:#fff; padding:8px 20px; border-radius:50px; cursor:pointer; font-weight:900; font-size:11px;">REVEAL ANYWAY</button></div>` : '';

        // Feature 21: Poll rendering
        let pollHtml = '';
        if(p.isPoll && p.pollOptions && p.pollOptions.length > 0) {
            const totalVotes = p.pollOptions.reduce((sum, o) => sum + (o.votes ? o.votes.length : 0), 0);
            const userVoted = user ? p.pollOptions.findIndex(o => o.votes && o.votes.includes(user.username)) : -1;
            pollHtml = `<div style="margin-top:15px;">` + p.pollOptions.map((opt, idx) => {
                const votes = opt.votes ? opt.votes.length : 0;
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                const isVoted = idx === userVoted;
                return `<div class="poll-option ${isVoted ? 'voted' : ''}" onclick="${userVoted === -1 && user ? `votePoll('${p._id}', ${idx})` : ''}"><div class="poll-bar" style="width:${userVoted >= 0 ? pct : 0}%"></div><span class="poll-text">${opt.text}</span>${userVoted >= 0 ? `<span class="poll-pct">${pct}%</span>` : ''}</div>`;
            }).join('') + `<p style="font-size:10px; opacity:0.4; margin-top:8px;">${totalVotes} votes</p></div>`;
        }

        // Feature 21: Is media a video?
        const isVideo = p.mediaUrl && (p.mediaUrl.startsWith('data:video') || p.mediaUrl.includes('video'));
        const mediaHtml = p.mediaUrl ? (isVideo ? `<video src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:15px; border:1px solid var(--border);" controls></video><span class="media-type-badge">VIDEO</span>` : `<img src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:15px; border:1px solid var(--border); box-shadow: 0 5px 15px rgba(0,0,0,0.5);">`) : '';

        const sensitiveBodyClass = p.isSensitive ? 'sensitive-post-content is-sensitive' : 'sensitive-post-content';

        return `<div class="card post-card glass-surface p-node ${p.isAnonymous ? 'ghost-card' : ''}" data-post-id="${p._id.toString()}" style="position:relative;">
            ${p.isTimeCapsule && p.unlockAt ? `<div class="pinned-indicator" style="color:var(--cyan);"><i class="fas fa-meteor"></i> TIME CAPSULE UNSEALED</div>` : ''}
            ${p.isShared ? `<div class="shared-indicator"><i class="fas fa-retweet"></i> Transmitted from @${p.originalAuthor}'s Matrix</div>` : ''}
            ${user && user.pinnedPost === p._id.toString() ? `<div class="pinned-indicator"><i class="fas fa-thumbtack"></i> PINNED TRANSMISSION</div>` : ''}
            <div class="post-header">
                ${p.isAnonymous ? `<img src="${ghostAvatar}" class="post-pfp" style="border-color:#7000ff;">` : postAvatarSnippet}
                <div style="display:flex; flex-direction:column; flex:1;">
                    <b style="color:${p.isAnonymous ? '#7000ff' : postAuraColor}; font-size:14px; letter-spacing:0.5px;">
                        ${p.isAnonymous ? 'GHOST_SIGNAL' : '<a href="/portfolio?user=' + p.author + '" style="color:inherit; text-decoration:none;">@'+p.author+'</a>' + isVer + trendingBadgeHtml + wordBadge + streakBadge}
                        ${!p.isAnonymous ? `<span class="aura-badge">${currentAura}</span>` : ''}
                    </b>
                    ${!p.isAnonymous ? `<span class="bio-post-snippet">${(postAuthor && postAuthor.bio) ? postAuthor.bio : p.authorBio}</span>` : ''}
                    <div style="font-size:10px; opacity:0.4; margin-top:2px;">${new Date(p.date).toLocaleString()} • ${p.sector.toUpperCase()}${p.isEdited ? ' • <i class="fas fa-pen" style="font-size:8px;"></i> edited' : ''}</div>
                </div>
                ${showDelete ? `<div class="del-engine-container"><button type="button" class="delete-btn glass-btn" data-post-id="${p._id.toString()}" title="Delete post"><i class="fas fa-trash-can"></i></button></div>` : ''}
            </div>
            
            <div class="${sensitiveBodyClass}">
            ${p.isSensitive ? cwOverlay : ''}
            ${p.isShared && p.originalContent ? `<div class="shared-post-wrapper"><p style="font-size:14px; font-weight:500; line-height:1.5;">${p.originalContent}</p></div>` : `<p style="margin-top:5px; font-size:16px; font-weight:500; line-height:1.5;">${p.content}</p>`}
            ${tagsHtml}
            ${pollHtml}
            ${mediaHtml}
            ${linkPreviewHtml}
            </div>
            
            <div class="interaction-bar">
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'crown')" class="action-btn react-btn ${uReact === 'crown' ? 'active' : ''}">👑 ${rCount.crown}</button>
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'skull')" class="action-btn react-btn ${uReact === 'skull' ? 'active' : ''}">💀 ${rCount.skull}</button>
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'fire')" class="action-btn react-btn ${uReact === 'fire' ? 'active' : ''}">🔥 ${rCount.fire}</button>
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'heart')" class="action-btn react-btn ${uReact === 'heart' ? 'active' : ''}">❤️ ${rCount.heart}</button>
                <button type="button" onclick="interact(event, '${p._id.toString()}', 'save')" class="action-btn save-btn ${isSaved ? 'active-save' : ''}"><i class="fas fa-bookmark"></i></button>
                ${!p.isAnonymous && user ? `<button type="button" onclick="sharePost('${p._id.toString()}')" class="action-btn share-btn"><i class="fas fa-retweet"></i> Re-shout</button>` : ''}
                ${showEdit ? `<button type="button" onclick="editPost('${p._id.toString()}', ${JSON.stringify(p.content)})" class="action-btn" style="color:#aaa;"><i class="fas fa-pen"></i></button>` : ''}
                ${showPin ? `<button type="button" onclick="pinPost('${p._id.toString()}')" class="action-btn" style="color:#ffea00;" title="Pin to profile"><i class="fas fa-thumbtack"></i></button>` : ''}
                ${user && !showDelete ? `<button type="button" onclick="reportPost('${p._id.toString()}')" class="report-btn"><i class="fas fa-flag"></i></button>` : ''}
                ${!p.isAnonymous && user && user.username !== p.author ? `<button type="button" onclick="giftAura('${p.author}')" class="action-btn" style="color:#ffea00; font-size:11px;" title="Gift Aura"><i class="fas fa-gift"></i></button>` : ''}
            </div>
            
            <div class="comments-section-container">
                <h5 style="font-size:10px; opacity:0.4; letter-spacing:2px; margin-bottom:10px;">TRANSMITTED THREADS</h5>
                <div id="root-comment-box-${p._id}">${commentsRenderedTree || '<p style="font-size:11px; opacity:0.2; padding-left:5px;" class="no-threads-prompt">No structural threads running.</p>'}</div>
                ${user ? `<form onsubmit="submitCommentAjax(event, this, 'root-comment-box-${p._id}')" style="margin-top:15px; display: flex; gap: 10px;"><input type="hidden" name="postId" value="${p._id}"><input type="text" name="content" class="comment-mini-input" placeholder="Inject thoughts into thread..." required><button class="create-btn" style="width: auto; padding: 0 20px; border-radius: 12px; font-size: 10px;">COOK 🍳</button></form>` : `<p style="font-size:11px; opacity:0.4; margin-top:10px;">⚠️ <a href="/login" style="color:var(--cyan); text-decoration:none;">Sync identity</a> to comment on this thread.</p>`}
            </div>
        </div>`
    }).join('');

    res.send(MASTER_UI(postForm + ghostPollsHtml + auraDuelPanelHtml + glitchMarketHtml + html, user, sectors, activeSector, allUsers, notifCount));
});

// --- [🌐 V83 PORTFOLIO & SOCIAL FABRIC ROUTES] ---
app.get('/portfolio', async (req, res) => {
    const sessionUser = req.session.user;
    const queryTargetName = req.query.user ? req.query.user.toLowerCase().trim() : (sessionUser ? sessionUser.username : null);
    if(!queryTargetName) return res.redirect('/login');
    
    const dbUser = await User.findOne({ username: queryTargetName });
    if (!dbUser) return res.send("<script>alert('Profile does not exist inside the void.'); window.location.href='/dashboard';</script>");
    
    const isOwner = sessionUser && (sessionUser.username === dbUser.username);
    if (!isOwner) { dbUser.viewsCount += 1; await dbUser.save(); }

    const activeSessionDbUser = sessionUser ? await User.findOne({ username: sessionUser.username }) : null;
    const isFollowing = activeSessionDbUser && activeSessionDbUser.following.includes(dbUser.username);
    const isBlocked = activeSessionDbUser && activeSessionDbUser.blockedUsers.includes(dbUser.username);
    const notifCount = activeSessionDbUser ? await Notification.countDocuments({ recipient: activeSessionDbUser.username, isRead: false }) : 0;

    const sectors = await Sector.find();
    const authorPostHistory = await Post.find({ author: dbUser.username, isAnonymous: false }).sort({ date: -1 });
    const savedPostObjects = isOwner ? await Post.find({ _id: { $in: dbUser.savedPosts } }) : [];

    let auraTitle = "Chaos Agent 🌌";
    if (dbUser.aura >= 500) auraTitle = "Ghost Lord 👑";
    else if (dbUser.aura >= 200) auraTitle = "Sigma 🔥";
    else if (dbUser.aura < 50) auraTitle = "Lacking Bro 💀";

    let totalReceivedLikes = 0;
    authorPostHistory.forEach(p => { 
        totalReceivedLikes += (p.reactions?.crown?.length || 0) + (p.reactions?.fire?.length || 0) + (p.reactions?.heart?.length || 0); 
    });

    let badgesHtml = '';
    if (authorPostHistory.length >= 1) badgesHtml += `<div class="badge-pill-shield"><i class="fas fa-paper-plane"></i> First Post 🚀</div>`;
    if (totalReceivedLikes >= 100) badgesHtml += `<div class="badge-pill-shield gold"><i class="fas fa-crown"></i> 100 W's 👑</div>`;
    if (dbUser.ghostSentCount && dbUser.ghostSentCount >= 1) badgesHtml += `<div class="badge-pill-shield purple"><i class="fas fa-user-secret"></i> Ghost Master 👻</div>`;
    if (badgesHtml === '') badgesHtml = `<p style="font-size:11px; opacity:0.3; font-style:italic;">No achievement blocks unlocked yet.</p>`;

    const basePeak = Math.max(dbUser.aura, 120);
    const auraGraphSegments = [{ label: 'Origin', val: 100 }, { label: 'Phase 1', val: Math.min(basePeak, Math.round(dbUser.aura * 0.6)) }, { label: 'Phase 2', val: Math.min(basePeak, Math.round(dbUser.aura * 0.85)) }, { label: 'Peak', val: dbUser.aura }];
    const verticalGraphBarsHtml = auraGraphSegments.map(seg => {
        const heightPercentage = Math.min(100, Math.max(15, Math.round((seg.val / basePeak) * 100)));
        return `<div style="display: flex; flex-direction: column; align-items: center; flex: 1;"><div class="aura-graph-bar" style="height: ${heightPercentage}%;"><div class="aura-graph-pop">${seg.val} Aura</div></div><span class="aura-graph-label">${seg.label}</span></div>`;
    }).join('');

    const ghostInbox = isOwner ? dbUser.ghostMessages.map(m => `<div class="ghost-msg-node"><span style="font-size:10px; color:var(--v); font-weight:900;"><i class="fas fa-mask"></i> ANONYMOUS INCOMING...</span><p style="font-size:14px; margin-top:6px; color:#fff; font-weight:500;">${m.content}</p><small style="opacity:0.2; font-size:9px; display:block; margin-top:5px;">${new Date(m.date).toLocaleString()}</small></div>`).join('') : '';
    const savedFeedHtml = isOwner ? savedPostObjects.map(sp => `<div style="background:rgba(0,242,255,0.03); padding:18px; border-radius:20px; border:1px solid rgba(0,242,255,0.15); margin-bottom:12px;"><span style="font-size:11px; color:var(--cyan); font-weight:bold;">📍 @${sp.isAnonymous ? 'ANONYMOUS' : sp.author}</span><p style="font-size:14px; margin-top:6px; color:#fff;">${sp.content}</p></div>`).join('') : '';

    const historyPostsHtml = authorPostHistory.map(ph => `<div style="background:rgba(255,255,255,0.02); padding:20px; border-radius:20px; border:1px solid var(--border); margin-bottom:15px;"><div style="font-size:10px; opacity:0.4; margin-bottom:8px;"><i class="fas fa-clock"></i> ${new Date(ph.date).toLocaleString()} • ${ph.sector.toUpperCase()}</div><p style="font-size:15px; color:#eee; line-height:1.4;">${ph.content}</p>${ph.mediaUrl ? `<img src="${ph.mediaUrl}" style="width:100%; max-height:250px; object-fit:cover; border-radius:14px; margin-top:12px; border:1px solid rgba(255,255,255,0.05);">` : ''}</div>`).join('');

    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.username}&backgroundColor=000000`;
    const defaultBanner = `https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1000&auto=format&fit=crop`;
    const portfolioAvatarRender = dbUser.avatarUrl ? `<img src="${dbUser.avatarUrl}" class="profile-pfp-lg">` : `<img src="${defaultAvatar}" class="profile-pfp-lg">`;

    const content = `
        <div class="card" style="padding-top:0; overflow:hidden;">
            <div class="profile-banner" style="background-image: url('${dbUser.coverPic || defaultBanner}');">
                ${isOwner ? `<form action="/update-banner" method="POST" enctype="multipart/form-data" id="bannerForm" style="display:none;"><input type="file" name="media" id="bannerInput" onchange="document.getElementById('bannerForm').submit()" accept="image/*"></form><label for="bannerInput" class="edit-banner-btn"><i class="fas fa-camera"></i> EDIT DRIP</label>` : ''}
            </div>

            <div class="profile-pfp-container">
                ${portfolioAvatarRender}
                ${isOwner ? `<form action="/upload-avatar" method="POST" enctype="multipart/form-data" id="avatarUploadFormEngine" style="display:none;"><input type="file" name="avatar" id="avatarFileInputNode" accept="image/*" onchange="document.getElementById('avatarUploadFormEngine').submit();"></form><label for="avatarFileInputNode" class="edit-pfp-btn" title="Change PFP"><i class="fas fa-pen"></i></label>` : ''}
            </div>
            
            <div style="text-align:center; margin-top:10px;">
                <h1 style="font-size:26px; font-weight:900;">@${dbUser.username} ${dbUser.aura >= 500 ? '<i class="fas fa-circle-check verified-badge" title="Certified W"></i>' : ''}</h1>
                <p style="font-size:11px; color:#ffea00; font-weight:900; letter-spacing:1.5px; text-transform:uppercase; margin-top:4px;"><i class="fas fa-shield"></i> TITLE: ${auraTitle}</p>
                <p style="font-size:12px; color:var(--cyan); font-weight:bold; margin-top:6px; letter-spacing:1px;">AURA LEVEL: ${dbUser.aura}</p>
                
                <div style="display:flex; justify-content:center; gap:20px; font-size:12px; font-weight:bold; margin-top:15px; opacity:0.8;">
                    <span><i class="fas fa-users"></i> ${dbUser.followers.length} Followers</span>
                    <span><i class="fas fa-user-plus"></i> ${dbUser.following.length} Following</span>
                </div>
                ${!isOwner && sessionUser ? `
                <div style="display:flex; justify-content:center; gap:10px; margin-top:15px;">
                    <button class="create-btn" style="width:auto; padding:8px 25px; border-radius:50px; font-size:10px;" onclick="followUser('${dbUser.username}')">${isFollowing ? 'UNFOLLOW' : 'FOLLOW'}</button>
                    ${!isBlocked ? `<button class="create-btn" style="width:auto; padding:8px 25px; border-radius:50px; font-size:10px; background:linear-gradient(90deg, #ff0000, #550000);" onclick="blockUser('${dbUser.username}')"><i class="fas fa-ban"></i> BLOCK</button>` : `<button class="create-btn" style="width:auto; padding:8px 25px; border-radius:50px; font-size:10px; background:#444;" disabled>BLOCKED</button>`}
                </div>` : ''}
            </div>
            
            ${isOwner ? `<form action="/update-bio" method="POST" style="margin-top:10px;"><input type="text" name="bio" class="bio-input-shield" value="${dbUser.bio.replace(/"/g, '&quot;')}" placeholder="Drop your one-line vibe status..." maxlength="75" onchange="this.form.submit();"><small style="font-size:9px; opacity:0.3; display:block; text-align:center; margin-top:4px;">Press enter to change vibe code mapping</small></form>` : `<p style="text-align:center; font-size:13px; font-style:italic; opacity:0.7; margin-top:12px; font-weight:600;">"${dbUser.bio}"</p>`}

            <div style="margin-top:25px; text-align:center; border-top:1px solid var(--border); padding-top:20px;"><span style="font-size:9px; opacity:0.4; font-weight:900; letter-spacing:2px; text-transform:uppercase;">Matrix Achievement Seals</span><div class="badge-matrix-flex">${badgesHtml}</div></div>
            <div class="aura-graph-wrapper"><span style="font-size:9px; opacity:0.5; font-weight:900; letter-spacing:2px; text-transform:uppercase;"><i class="fas fa-chart-bar"></i> Aura History Tracker</span><div class="aura-graph-canvas">${verticalGraphBarsHtml}</div></div>

            ${isOwner && !dbUser.nameChanged ? `<div style="margin-top:25px; background:rgba(255,255,255,0.03); padding:15px; border-radius:16px; border:1px solid var(--border);"><p style="font-size:10px; color:#ffea00; font-weight:bold; margin-bottom:10px;"><i class="fas fa-triangle-exclamation"></i> ONE-TIME NAME CHANGE AVAILABLE</p><form action="/change-username" method="POST" style="display:flex; gap:10px;"><input type="text" name="newUsername" class="auth-input" style="margin:0; padding:10px; font-size:12px;" placeholder="New @username" required><button class="create-btn" style="width:auto; padding:0 20px; font-size:10px; border-radius:12px;" onclick="return confirm('You can only do this ONCE. Sure bro?');">CHANGE</button></form></div>` : ''}

            <div class="bento-grid">
                <div class="bento-item"><i class="fas fa-eye" style="color:var(--cyan); font-size:20px; margin-bottom:10px; display:block;"></i><p style="font-size:12px; font-weight:900;">${dbUser.viewsCount} PROFILE VIEWS</p></div>
                <div class="bento-item"><i class="fas fa-signs-post" style="color:var(--p); font-size:20px; margin-bottom:10px; display:block;"></i><p style="font-size:12px; font-weight:900;">${authorPostHistory.length} TRANSMISSIONS</p></div>
            </div>
        </div>

        <div class="card" style="border-color: rgba(255, 255, 255, 0.15);"><h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:#fff; font-weight:900;"><i class="fas fa-history"></i> TRANSMISSION LOGS (${dbUser.username.toUpperCase()})</h4>${historyPostsHtml || '<p style="opacity:0.2; font-size:12px; text-align:center;">NO PUBLIC MATRIX TRANSMISSIONS DETECTED.</p>'}</div>
        ${isOwner ? `<div class="card" style="border-color:rgba(0, 242, 255, 0.3);"><h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:var(--cyan); font-weight:900;"><i class="fas fa-vault"></i> SAVED VAULT</h4>${savedFeedHtml || '<p style="opacity:0.2; font-size:12px; text-align:center;">NO ARCHIVED FILES FOUND</p>'}</div><div class="card ghost-card"><h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:var(--v); font-weight:900;"><i class="fas fa-user-secret"></i> INCOGNITO GHOST VOID</h4>${ghostInbox || '<p style="opacity:0.3; font-size:12px; text-align:center; padding:10px;">GHOST VOID IS EMPTY</p>'}</div>` : ''}
        <div class="card" style="border-color: rgba(255,0,127,0.3);"><h4 style="font-size:10px; letter-spacing:3px; margin-bottom:15px; color:var(--p); font-weight:900;">💥 DROP AN ANONYMOUS BOMB TO ${dbUser.username.toUpperCase()}</h4><form action="/send-ghost-msg" method="POST"><input type="hidden" name="targetUser" value="${dbUser.username}"><textarea name="message" class="ghost-input" style="min-height:80px; resize:none;" placeholder="Write a confidential truth bomb..." required></textarea><button class="create-btn" style="background: linear-gradient(90deg, var(--v), #000);">LAUNCH ANONYMOUS SIGNAL 🚀</button></form></div>`;
    
    res.send(MASTER_UI(content, activeSessionDbUser, sectors, 'Portfolio', [], notifCount));
});

// --- [V83 API ROUTES FOR MENTIONS, SHARES, REACTS, FOLLOWS & DMs] ---
app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const isAnon = req.body.isAnonymous === 'on' || req.body.isAnonymous === 'true' || !!user.isGhost;
        const isSensitive = req.body.isSensitive === 'on';
        const user = await User.findOne({ username: req.session.user.username });
        if (!user) return res.redirect('/login');

        // Feature 46: Anti-spam cooldown (30 seconds between posts)
        const now = new Date();
        if (user.lastPostDate) {
            const lastPost = new Date(user.lastPostDate);
            const diffSeconds = (now - lastPost) / 1000;
            if (diffSeconds < 30) {
                return res.send(`<script>alert('Slow down! Wait ${Math.ceil(30 - diffSeconds)} more seconds before transmitting again. ⏳'); window.history.back();</script>`);
            }
        }
        
        const textContent = req.body.content;
        let aiContents = [];
        if (req.file) aiContents.push(fileToGenerativePart(req.file.buffer, req.file.mimetype));
        if (textContent) aiContents.push(textContent);
        aiContents.push("Analyze this content. Respond with ONLY 'SAFE' or 'TOXIC'.");

        const aiResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: aiContents });
        if (aiResponse.text.trim().toUpperCase() === 'TOXIC') {
            user.aura = Math.max(0, user.aura - 50); await user.save();
            return res.send("<script>alert('CONTENT TOXIC. -50 Aura penalized. 💀'); window.history.back();</script>");
        }

        let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
        let finalScheduledDate = null;
        if (req.body.scheduledTime) {
            const parsedTime = new Date(req.body.scheduledTime);
            if (parsedTime > new Date()) finalScheduledDate = parsedTime;
        }

        let unlockAt = null;
        let isTimeCapsule = false;
        if (req.body.unlockAt) {
            const parsedUnlock = new Date(req.body.unlockAt);
            if (!isNaN(parsedUnlock.getTime()) && parsedUnlock > new Date()) {
                unlockAt = parsedUnlock;
                isTimeCapsule = true;
            }
        }

        // Feature 27: Parse hashtags from content and tags field
        const tagsFromContent = (textContent.match(/#([a-zA-Z0-9_]+)/g) || []).map(t => t.replace('#','').toLowerCase());
        const tagsFromField = req.body.tags ? req.body.tags.replace(/#/g,'').split(/[\s,]+/).filter(Boolean).map(t => t.toLowerCase()) : [];
        const allTags = [...new Set([...tagsFromContent, ...tagsFromField])].slice(0, 10);

        // Feature 21: Poll setup
        const isPoll = req.body.isPoll === '1' && req.body.pollA && req.body.pollB;
        const pollOptions = isPoll ? [{ text: req.body.pollA, votes: [] }, { text: req.body.pollB, votes: [] }] : [];

        // Feature 24: Simple link preview extraction from content
        const urlMatch = textContent ? textContent.match(/https?:\/\/[^\s]+/) : null;
        let linkPreview = {};
        if (urlMatch) { linkPreview = { url: urlMatch[0], title: '', description: '', image: '' }; }

        const displayAuthor = isAnon ? 'GHOST_SIGNAL' : user.username;
        const newPost = await new Post({ 
            author: displayAuthor,
            authorId: user._id,
            ghostOwner: isAnon ? user.username : null,
            authorAura: user.aura,
            authorAvatar: isAnon ? null : user.avatarUrl,
            authorBio: isAnon ? 'Anonymous void transmission...' : user.bio, 
            content: textContent,
            sector: req.body.sector || 'Global',
            mediaUrl,
            isAnonymous: isAnon,
            scheduledFor: finalScheduledDate,
            isTimeCapsule,
            unlockAt,
            tags: allTags,
            isPoll,
            pollOptions,
            isSensitive,
            linkPreview: Object.keys(linkPreview).length ? linkPreview : undefined
        }).save();
        
        // 🧬 V83 @Mention Extraction & Notification Engine
        if(!isAnon && textContent) {
            const mentionRegex = /@([a-zA-Z0-9_]+)/g; let match;
            while ((match = mentionRegex.exec(textContent)) !== null) {
                const mentionedUser = match[1].toLowerCase();
                const uExists = await User.findOne({ username: mentionedUser });
                if (uExists && mentionedUser !== user.username) {
                    await new Notification({ recipient: mentionedUser, sender: user.username, type: 'mention', referenceId: newPost._id }).save();
                }
            }
        }

        // Feature 38: Daily login streak bonus
        const todayStr = now.toDateString();
        if (user.lastLoginDate !== todayStr) {
            const yesterdayStr = new Date(now - 86400000).toDateString();
            if (user.lastLoginDate === yesterdayStr) {
                user.loginStreak = (user.loginStreak || 0) + 1;
            } else {
                user.loginStreak = 1;
            }
            user.lastLoginDate = todayStr;
            // Streak bonus aura
            if (user.loginStreak >= 7) { user.aura += 10; }
            else if (user.loginStreak >= 3) { user.aura += 5; }
        }

        // Feature 42: Aura milestones
        if(!isAnon) {
            const oldAura = user.aura;
            user.aura += 15;
            if (oldAura < 500 && user.aura >= 500) {
                await new Notification({ recipient: user.username, sender: 'SYSTEM', type: 'milestone', referenceId: '500' }).save();
            }
            if (oldAura < 1000 && user.aura >= 1000) {
                await new Notification({ recipient: user.username, sender: 'SYSTEM', type: 'milestone', referenceId: '1000' }).save();
            }
        }

        // Feature 43: Weekly challenge tracking
        const weekStr = `${now.getFullYear()}-W${Math.ceil(now.getDate()/7)}`;
        if (user.weeklyPostReset !== weekStr) { user.weeklyPostCount = 0; user.weeklyPostReset = weekStr; }
        user.weeklyPostCount = (user.weeklyPostCount || 0) + 1;
        if (user.weeklyPostCount === 3 && !isAnon) {
            user.aura += 100;
            await new Notification({ recipient: user.username, sender: 'SYSTEM', type: 'challenge', referenceId: 'weekly3' }).save();
        }

        user.lastPostDate = now.toISOString();
        await user.save();
        req.session.user.aura = user.aura;
        res.redirect('back');
    } catch (e) { console.error(e); res.redirect('back'); }
});

app.post('/api/follow', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const currentUsername = req.session.user.username;
    const { targetUsername } = req.body;
    if (currentUsername === targetUsername) return res.status(400).json({ error: 'Cannot follow yourself' });

    try {
        const currentUser = await User.findOne({ username: currentUsername });
        const targetUser = await User.findOne({ username: targetUsername });
        if (!targetUser || !currentUser) return res.status(404).json({ error: 'User not found' });

        if (currentUser.following.includes(targetUsername)) {
            currentUser.following = currentUser.following.filter(u => u !== targetUsername);
            targetUser.followers = targetUser.followers.filter(u => u !== currentUsername);
            await currentUser.save(); await targetUser.save();
            return res.json({ status: 'unfollowed' });
        } else {
            currentUser.following.push(targetUsername);
            targetUser.followers.push(currentUsername);
            await currentUser.save(); await targetUser.save();
            await new Notification({ recipient: targetUsername, sender: currentUsername, type: 'follow' }).save();
            return res.json({ status: 'followed' });
        }
    } catch (err) { return res.status(500).json({ error: 'Failed to update connection node' }); }
});

app.post('/api/block', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const currentUsername = req.session.user.username;
    const { targetUsername } = req.body;
    try {
        const currentUser = await User.findOne({ username: currentUsername });
        if (!currentUser.blockedUsers.includes(targetUsername)) {
            currentUser.blockedUsers.push(targetUsername);
            await currentUser.save();
        }
        return res.json({ status: 'blocked' });
    } catch (err) { return res.status(500).json({ error: 'Block execution failed' }); }
});

app.post('/api/share', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const { postId } = req.body;
    try {
        const originalPost = await Post.findById(postId);
        if(!originalPost) return res.status(404).json({ error: 'Not found' });
        const user = await User.findOne({ username: req.session.user.username });
        
        await new Post({
            author: user.username, authorAura: user.aura, authorAvatar: user.avatarUrl, authorBio: user.bio,
            content: "Reshouted this transmission 📡", sector: originalPost.sector,
            isShared: true, originalAuthor: originalPost.author, originalContent: originalPost.content
        }).save();
        return res.json({ status: 'success' });
    } catch(err) { return res.status(500).json({ error: 'Failed to share' }); }
});

app.post('/interact', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const { postId, type } = req.body;
    const username = req.session.user.username;
    try {
        const post = await Post.findById(postId);
        const user = await User.findOne({ username });
        if (!post || !user) return res.sendStatus(404);

        if (type === 'save') {
            if (user.savedPosts.includes(postId)) user.savedPosts = user.savedPosts.filter(id => id !== postId);
            else user.savedPosts.push(postId);
            await user.save();
            return res.json({ status: 'saved' });
        } else {
            // V83 GenZ React System Integration
            const validReactions = ['crown', 'skull', 'ghost', 'fire', 'heart'];
            if (!validReactions.includes(type)) return res.status(400).json({ error: 'Invalid cosmic entity' });
            if (!post.reactions) post.reactions = { crown: [], skull: [], ghost: [], fire: [], heart: [] };
            
            // Remove user from all other reactions
            validReactions.forEach(r => { if (post.reactions[r]) post.reactions[r] = post.reactions[r].filter(u => u !== username); });
            // Add new reaction
            post.reactions[type].push(username);
            
            // Trigger Notification for author
            if (post.author !== username) {
                await new Notification({ recipient: post.author, sender: username, type: 'reaction', referenceId: postId }).save();
            }
            
            await post.save();
            return res.json({ status: 'reacted', reactions: post.reactions });
        }
    } catch (err) { return res.sendStatus(500); }
});

// V83 DMs & Notifications Static Handlers (To prevent 404s before full Websocket architecture)
app.get('/notifications', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const user = await User.findOne({ username: req.session.user.username });
    const notifs = await Notification.find({ recipient: user.username }).sort({ date: -1 }).limit(30);
    // Mark as read
    await Notification.updateMany({ recipient: user.username }, { $set: { isRead: true } });
    
    const notifHtml = notifs.map(n => `<div class="card" style="padding:15px; margin-bottom:10px;"><b style="color:var(--cyan);">@${n.sender}</b> ${n.type === 'mention' ? 'mentioned you in a transmission.' : n.type === 'follow' ? 'started following your matrix.' : 'reacted to your post.'}</div>`).join('');
    
    const content = `<div class="card"><h2 style="margin-bottom:20px; color:var(--cyan);"><i class="fas fa-bell"></i> SYSTEM ALERTS</h2>${notifHtml || '<p>No structural alerts found.</p>'}</div>`;
    res.send(MASTER_UI(content, user, [], 'Alerts', [], 0));
});

app.get('/dms', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const user = await User.findOne({ username: req.session.user.username });
    const content = `<div class="card" style="text-align:center; padding:50px;"><i class="fas fa-lock fa-3x" style="color:var(--cyan); margin-bottom:15px;"></i><h2>PRIVATE CHAT MATRIX SECURING...</h2><p style="opacity:0.5; font-size:12px; margin-top:10px;">Direct Messaging relays are currently synchronizing for end-to-end encryption in V84. Hang tight.</p></div>`;
    res.send(MASTER_UI(content, user, [], 'Direct Messages', [], 0));
});

// --- [REMAINING ROUTES] ---

// V87: Time Capsule creation API
app.post('/create-time-capsule', async (req, res) => {
    if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const userDoc = req.user || await resolveRequestUser(req);
        if (!userDoc) return res.status(401).json({ error: 'Unauthorized' });
        req.user = userDoc;

        const { content, unlockDateTime } = req.body;
        if (!content || !String(content).trim() || !unlockDateTime) {
            return res.status(400).json({ error: 'Content and unlockDateTime are required.' });
        }

        const unlockAt = new Date(unlockDateTime);
        if (isNaN(unlockAt.getTime()) || unlockAt <= new Date()) {
            return res.status(400).json({ error: 'Unlock time must be in the future.' });
        }

        const isAnon = !!userDoc.isGhost;
        const capsulePost = await new Post({
            author: isAnon ? 'GHOST_SIGNAL' : userDoc.username,
            authorId: userDoc._id,
            ghostOwner: isAnon ? userDoc.username : null,
            authorAura: userDoc.aura,
            authorAvatar: isAnon ? null : userDoc.avatarUrl,
            authorBio: isAnon ? 'Anonymous void transmission...' : userDoc.bio,
            content: String(content).trim(),
            sector: req.body.sector || 'Global',
            isTimeCapsule: true,
            unlockAt,
            isAnonymous: isAnon
        }).save();

        return res.json({ success: true, postId: capsulePost._id, unlockAt });
    } catch (err) {
        console.error('create-time-capsule error:', err);
        return res.status(500).json({ error: 'Failed to create time capsule.' });
    }
});

// V87: Global Ghost Mode toggle
app.post('/toggle-ghost-mode', async (req, res) => {
    if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const userDoc = req.user || await resolveRequestUser(req);
        if (!userDoc) return res.status(401).json({ error: 'Unauthorized' });
        req.user = userDoc;

        userDoc.isGhost = !userDoc.isGhost;
        await userDoc.save();

        if (req.session && req.session.user) {
            req.session.user.isGhost = userDoc.isGhost;
        }

        return res.json({ success: true, isGhost: userDoc.isGhost });
    } catch (err) {
        console.error('toggle-ghost-mode error:', err);
        return res.status(500).json({ error: 'Failed to toggle ghost mode.' });
    }
});

app.post('/delete-post', async (req, res) => {
    if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const userDoc = req.user || await resolveRequestUser(req);
        if (!userDoc) return res.status(401).json({ error: 'Unauthorized' });
        req.user = userDoc;

        const post = await Post.findById(req.body.postId);
        if (!post) return res.status(404).json({ error: 'Not found' });

        let authorized = false;
        if (post.authorId && userDoc._id && post.authorId.toString() === userDoc._id.toString()) {
            authorized = true;
        }
        if (post.author && userDoc.username && post.author === userDoc.username) {
            authorized = true;
        }
        if (post.ghostOwner && post.ghostOwner === userDoc.username) {
            authorized = true;
        }
        if (userDoc.username === 'xavirox') {
            authorized = true;
        }

        if (!authorized) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await Post.findByIdAndDelete(req.body.postId);
        return res.sendStatus(200);
    } catch (err) {
        console.error('delete-post error:', err);
        return res.status(500).json({ error: 'Error' });
    }
});

app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    if (!req.session.user) return res.status(401).send("Unauthorized Matrix Action");
    try {
        if (!req.file) return res.redirect('/portfolio');
        const base64Avatar = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        await User.findOneAndUpdate({ username: req.session.user.username }, { $set: { avatarUrl: base64Avatar } });
        res.redirect('/portfolio');
    } catch (err) { res.redirect('/portfolio'); }
});

app.post('/update-banner', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        if (!req.file) return res.redirect('/portfolio');
        await User.findOneAndUpdate({ username: req.session.user.username }, { $set: { coverPic: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` } });
        res.redirect('/portfolio');
    } catch (err) { res.redirect('/portfolio'); }
});

app.post('/update-bio', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const pureBio = (req.body.bio || "").trim().substring(0, 75); 
    await User.findOneAndUpdate({ username: req.session.user.username }, { $set: { bio: pureBio } });
    res.redirect('/portfolio');
});

app.post('/change-username', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const newName = req.body.newUsername.toLowerCase().trim();
    const user = await User.findOne({ username: req.session.user.username });
    if (user.nameChanged) return res.send("<script>alert('Bro you already used your 1-time name change 💀'); window.history.back();</script>");
    const exists = await User.findOne({ username: newName });
    if (exists) return res.send("<script>alert('Username already taken by another sigma 😭'); window.history.back();</script>");
    const oldName = user.username; user.username = newName; user.nameChanged = true; await user.save();
    await Post.updateMany({ author: oldName }, { author: newName });
    req.session.user.username = newName;
    res.redirect('/portfolio');
});

app.get('/login', (req, res) => { res.send(MASTER_UI(`<div class="card" style="max-width:450px; margin: 60px auto; border-color: var(--cyan);"><div style="text-align:center; margin-bottom:25px;"><i class="fas fa-fingerprint fa-3x" style="color:var(--cyan); margin-bottom:15px;"></i><h2 style="color: #fff;">ENTER THE MATRIX</h2></div><a href="/auth/google" class="google-oauth-badge"><i class="fab fa-google"></i> LOGIN WITH GOOGLE</a><div class="auth-divider">or sync manually</div><form action="/login" method="POST"><input type="text" name="username" class="auth-input" placeholder="@username" required><input type="password" name="password" class="auth-input" placeholder="Password" required><button class="create-btn" style="margin-top:15px; background:var(--cyan); color:#000;">LET ME IN</button></form><p style="text-align:center; margin-top:25px; font-size:12px; opacity:0.6;">No account? <a href="/signup" style="color:var(--cyan); font-weight:bold;">Fix that</a></p></div>`, null, [], 'Login')); });
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user || !user.password) return res.send("<script>alert('SYNC FAILED — try Google login'); window.history.back();</script>");
    if (!(await bcrypt.compare(password, user.password))) return res.send("<script>alert('SYNC FAILED'); window.history.back();</script>");
    req.session.user = { _id: user._id.toString(), username: user.username, aura: user.aura, avatarUrl: user.avatarUrl };
    res.redirect('/dashboard');
});
// V87: Premium standalone signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Legacy /register redirects to new signup experience
app.get('/register', (req, res) => {
    res.redirect('/signup');
});

// V87: Manual registration handler — username, email, password, default aura 100
const handleAuthSignup = async (req, res) => {
    try {
        await connectDB();

        const rawUsername = (req.body.username || '').trim().replace(/^@/, '');
        const username = rawUsername.toLowerCase();
        const email = (req.body.email || '').toLowerCase().trim();
        const password = req.body.password || '';

        if (!username || username.length < 3 || username.length > 20) {
            return res.status(400).json({
                success: false,
                error: 'Username must be between 3 and 20 characters.'
            });
        }

        if (!/^[a-z0-9_]+$/.test(username)) {
            return res.status(400).json({
                success: false,
                error: 'Username may only contain letters, numbers, and underscores.'
            });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Please enter a valid email address.'
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long.'
            });
        }

        const existingByUsername = await User.findOne({ username });
        if (existingByUsername) {
            return res.status(409).json({
                success: false,
                error: 'This username is already claimed in the matrix. Try another handle.'
            });
        }

        const existingByEmail = await User.findOne({ email });
        if (existingByEmail) {
            return res.status(409).json({
                success: false,
                error: 'This email is already synced to another identity.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await new User({
            username,
            email,
            password: hashedPassword,
            aura: 100,
            bio: 'New signal detected in the void...'
        }).save();

        req.session.user = {
            _id: newUser._id.toString(),
            username: newUser.username,
            aura: newUser.aura,
            avatarUrl: newUser.avatarUrl,
            isGhost: false
        };

        return res.json({
            success: true,
            message: 'Identity forged successfully. Welcome to the void.',
            redirect: '/dashboard',
            user: {
                username: newUser.username,
                aura: newUser.aura
            }
        });
    } catch (err) {
        console.error('auth/signup error:', err);
        if (err.code === 11000) {
            const field = err.keyPattern?.username ? 'username' : 'email';
            return res.status(409).json({
                success: false,
                error: field === 'username'
                    ? 'This username is already taken.'
                    : 'This email is already registered.'
            });
        }
        return res.status(500).json({
            success: false,
            error: 'Matrix registration failed. Please try again shortly.'
        });
    }
};

app.post('/auth/signup', handleAuthSignup);

// Legacy POST /register — same handler (HTML form fallback)
app.post('/register', async (req, res) => {
    if (!req.body.email && req.body.username) {
        req.body.email = `${String(req.body.username).trim().toLowerCase()}@legacy.xavirox.local`;
    }
    const wantsJson = req.headers.accept && req.headers.accept.includes('application/json');
    const originalJson = res.json.bind(res);
    if (!wantsJson) {
        res.json = (payload) => {
            if (payload.success) return res.redirect(payload.redirect || '/dashboard');
            return res.send(`<script>alert(${JSON.stringify(payload.error)}); window.history.back();</script>`);
        };
    }
    return handleAuthSignup(req, res);
});
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

// ============================================================
// 🧬 V86 GOOGLE OAUTH ROUTING MATRIX
// ============================================================
app.get('/auth/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.send("<script>alert('Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.'); window.location.href='/login';</script>");
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=google_failed' }),
    async (req, res) => {
        try {
            const userDoc = req.user || await User.findOne({ username: req.session.passport?.user });
            if (userDoc) {
                req.session.user = {
                    _id: userDoc._id.toString(),
                    username: userDoc.username,
                    aura: userDoc.aura,
                    avatarUrl: userDoc.avatarUrl
                };
            }
            res.redirect('/dashboard');
        } catch (err) {
            res.redirect('/login?error=google_callback');
        }
    }
);

app.get('/auth/logout', (req, res) => {
    req.logout(() => {});
    req.session.destroy(() => {
        res.redirect('/dashboard');
    });
});

// ============================================================
// 🧬 V86 GHOST POLL VOTE — /api/poll/:pollId/vote
// ============================================================
app.post('/api/poll/:pollId/vote', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Login required to vote in the void.' });
    try {
        const voter = await User.findOne({ username: req.session.user.username });
        if (!voter) return res.status(401).json({ error: 'Identity not found.' });
        const poll = await GhostPoll.findById(req.params.pollId);
        if (!poll) return res.status(404).json({ error: 'Poll signal lost in the void.' });
        const optionIndex = parseInt(req.body.optionIndex, 10);
        if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ error: 'Invalid option index.' });
        }
        const alreadyVoted = poll.votedUsers.some(vid => String(vid) === String(voter._id));
        if (alreadyVoted) return res.status(400).json({ error: 'You already voted in this ghost poll.' });
        poll.options[optionIndex].voteCount = (poll.options[optionIndex].voteCount || 0) + 1;
        poll.votedUsers.push(voter._id);
        poll.totalVotes = (poll.totalVotes || 0) + 1;
        await poll.save();
        return res.json({ status: 'success', totalVotes: poll.totalVotes, options: poll.options });
    } catch (err) {
        return res.status(500).json({ error: 'Ghost poll vote execution failed.' });
    }
});

// ============================================================
// 🧬 V86 AURA DUELS — POST /api/aura/challenge
// ============================================================
app.post('/api/aura/challenge', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized matrix access.' });
    try {
        const wager = parseInt(req.body.wager, 10);
        const targetUsername = (req.body.targetUsername || '').toLowerCase().trim().replace('@', '');
        if (!targetUsername || !wager || wager < 1) {
            return res.status(400).json({ error: 'Invalid duel parameters.' });
        }
        const challenger = await User.findOne({ username: req.session.user.username });
        const opponent = await User.findOne({ username: targetUsername });
        if (!challenger || !opponent) return res.status(404).json({ error: 'Combatant not found in the matrix.' });
        if (challenger.username === opponent.username) {
            return res.status(400).json({ error: 'You cannot duel yourself.' });
        }
        if (challenger.aura < wager) {
            return res.status(400).json({ error: 'Insufficient aura to wager.' });
        }
        if (opponent.aura < wager) {
            return res.status(400).json({ error: 'Opponent lacks sufficient aura for this wager.' });
        }

        const challengerPower = challenger.aura + (challenger.loginStreak || 0) * 8 + (challenger.duelWins || 0) * 12 + Math.floor(Math.random() * 100);
        const opponentPower = opponent.aura + (opponent.loginStreak || 0) * 8 + (opponent.duelWins || 0) * 12 + Math.floor(Math.random() * 100);
        const challengerWins = challengerPower >= opponentPower;
        const winner = challengerWins ? challenger : opponent;
        const loser = challengerWins ? opponent : challenger;
        const winMethod = challengerWins
            ? `Challenger power ${challengerPower} vs ${opponentPower}`
            : `Opponent power ${opponentPower} vs ${challengerPower}`;

        winner.aura += wager;
        loser.aura = Math.max(0, loser.aura - wager);
        if (challengerWins) {
            challenger.duelWins = (challenger.duelWins || 0) + 1;
            opponent.duelLosses = (opponent.duelLosses || 0) + 1;
        } else {
            opponent.duelWins = (opponent.duelWins || 0) + 1;
            challenger.duelLosses = (challenger.duelLosses || 0) + 1;
        }

        const duelRecord = await new AuraDuel({
            challenger: challenger.username,
            opponent: opponent.username,
            wager,
            status: 'completed',
            winner: winner.username,
            loser: loser.username,
            winMethod,
            challengerStreak: challenger.loginStreak || 0,
            opponentStreak: opponent.loginStreak || 0,
            challengerAura: challenger.aura,
            opponentAura: opponent.aura,
            resolvedAt: new Date()
        }).save();

        const winnerHistory = {
            type: 'duel_win',
            amount: wager,
            description: `Won duel vs @${loser.username}`,
            opponent: loser.username,
            date: new Date()
        };
        const loserHistory = {
            type: 'duel_loss',
            amount: -wager,
            description: `Lost duel vs @${winner.username}`,
            opponent: winner.username,
            date: new Date()
        };
        if (!winner.auraHistory) winner.auraHistory = [];
        if (!loser.auraHistory) loser.auraHistory = [];
        winner.auraHistory.push(winnerHistory);
        loser.auraHistory.push(loserHistory);
        winner.duelHistory = winner.duelHistory || [];
        loser.duelHistory = loser.duelHistory || [];
        winner.duelHistory.push(duelRecord._id);
        loser.duelHistory.push(duelRecord._id);

        await winner.save();
        await loser.save();

        if (req.session.user.username === winner.username) {
            req.session.user.aura = winner.aura;
        } else {
            req.session.user.aura = loser.aura;
        }

        await new Notification({
            recipient: winner.username,
            sender: 'SYSTEM',
            type: 'duel_win',
            referenceId: String(duelRecord._id)
        }).save();
        await new Notification({
            recipient: loser.username,
            sender: 'SYSTEM',
            type: 'duel_loss',
            referenceId: String(duelRecord._id)
        }).save();

        return res.json({
            status: 'completed',
            message: challengerWins
                ? `Victory! You won ${wager} Aura from @${opponent.username}.`
                : `Defeat. @${opponent.username} claimed ${wager} of your Aura.`,
            winner: winner.username,
            wager
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Aura duel execution failed.' });
    }
});

// ============================================================
// 🧬 V86 GLITCH MARKET — POST /api/market/buy
// ============================================================
app.post('/api/market/buy', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Login required to access Glitch Market.' });
    try {
        const itemName = (req.body.itemName || '').trim();
        const buyer = await User.findOne({ username: req.session.user.username });
        const item = await MarketItem.findOne({ itemName });
        if (!buyer || !item) return res.status(404).json({ error: 'Item or identity not found.' });
        if (!buyer.unlockedAssets) buyer.unlockedAssets = [];
        if (buyer.unlockedAssets.includes(item.itemName)) {
            return res.status(400).json({ message: 'You already own this asset.' });
        }
        if (buyer.aura < item.costInAura) {
            return res.status(400).json({ message: 'Insufficient Aura for this purchase.' });
        }
        buyer.aura -= item.costInAura;
        buyer.unlockedAssets.push(item.itemName);
        if (!buyer.auraHistory) buyer.auraHistory = [];
        buyer.auraHistory.push({
            type: 'market_purchase',
            amount: -item.costInAura,
            description: `Purchased ${item.itemName} from Glitch Market`,
            date: new Date()
        });
        await buyer.save();
        req.session.user.aura = buyer.aura;
        return res.json({
            status: 'success',
            message: `${item.itemName} unlocked! -${item.costInAura} Aura`,
            aura: buyer.aura,
            unlockedAssets: buyer.unlockedAssets
        });
    } catch (err) {
        return res.status(500).json({ error: 'Market transaction failed.' });
    }
});

// ============================================================
// 🧬 V86 GHOST POLL CREATION — seed interactive polls in feed
// ============================================================
app.post('/api/ghost-poll/create', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const { question, optionA, optionB, isAnonymous } = req.body;
        if (!question || !optionA || !optionB) {
            return res.status(400).json({ error: 'Question and two options required.' });
        }
        const poll = await new GhostPoll({
            question: question.substring(0, 280),
            options: [
                { text: optionA.substring(0, 100), voteCount: 0 },
                { text: optionB.substring(0, 100), voteCount: 0 }
            ],
            createdBy: isAnonymous ? 'GHOST' : req.session.user.username,
            isAnonymous: isAnonymous === true || isAnonymous === 'true',
            votedUsers: [],
            totalVotes: 0
        }).save();
        return res.json({ status: 'success', pollId: poll._id });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create ghost poll.' });
    }
});

app.get('/create-sector', async (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    if (req.query.name) { try { await new Sector({ name: req.query.name.toLowerCase().trim() }).save(); } catch (e) {} }
    res.redirect('/dashboard');
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => { console.log("🚀 COSMIC ENGINE V86 LIVE ON PORT " + PORT); });
}
module.exports = app;