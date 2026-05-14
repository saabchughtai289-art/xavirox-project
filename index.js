/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - VERSION 40.0 [STABLE DEPLOYMENT]
    FIXED: connect-mongo, app.listen syntax, and DB caching
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

// --- [DATABASE ARCHITECTURE - CACHED FOR VERCEL] ---
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(dbURI);
        isConnected = db.connections[0].readyState;
        console.log('✅ COSMIC-LINK ONLINE');
    } catch (err) {
        console.error('❌ DB ERROR:', err);
    }
};

// --- [SCHEMAS] ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    pfp: { type: String, default: "" },
    bio: { type: String, default: "Inhabitant of the Xavirox Cosmos." },
    aura: { type: Number, default: 100 },
    rank: { type: String, default: "Cosmic Citizen" },
    skills: { type: [String], default: ["Gen-Z", "Web Dev"] },
    socialLinks: { instagram: String, github: String, twitter: String }
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    sector: { type: String, default: 'Global' },
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({ 
    name: { type: String, required: true, unique: true, lowercase: true },
    createdBy: String,
    memberCount: { type: Number, default: 1 }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Sector = mongoose.models.Sector || mongoose.model('Sector', SectorSchema);

// --- [MIDDLEWARE & SESSION] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to ensure DB is connected before any request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use(session({ 
    secret: 'xavirox_cosmic_core_unlocked_2026', 
    resave: false, 
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbURI }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: false } 
}));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// --- [MASTER UI ENGINE] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global', isPortfolio = false) => {
    const isGuest = !user;
    const islandText = isGuest ? "LURKER MODE ENABLED 👁️" : `SYNCED: @${user.username.toUpperCase()}`;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000; --glass: rgba(255, 255, 255, 0.03); --border: rgba(255, 255, 255, 0.08); }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.3s ease; }
        body { background: var(--bg); color: #fff; overflow-x: hidden; min-height: 100vh; }
        .cosmic-void { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .black-hole-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: #000; border-radius: 50%; box-shadow: 0 0 60px var(--v), 0 0 100px var(--p); }
        .accretion-disk { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotateX(75deg); width: 500px; height: 500px; border: 2px solid var(--cyan); border-radius: 50%; animation: spin 10s linear infinite; box-shadow: 0 0 30px var(--cyan); }
        @keyframes spin { from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg); } to { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); } }
        .island-nav { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 350px; height: 45px; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); border-radius: 100px; border: 1px solid var(--border); border-top: 2px solid var(--p); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .island-text { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 2px; text-shadow: 0 0 10px var(--p); }
        .dock { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); width: 60px; background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 50px; display: flex; flex-direction: column; padding: 30px 0; gap: 25px; align-items: center; z-index: 1000; }
        .dock i { font-size: 18px; color: rgba(255,255,255,0.4); cursor: pointer; }
        .dock i:hover { color: var(--cyan); transform: scale(1.2); }
        .main-container { max-width: 1000px; margin: 100px auto 50px 100px; display: flex; gap: 30px; padding: 0 20px; }
        .feed-engine { flex: 2; }
        .side-panel { flex: 1; position: sticky; top: 100px; height: fit-content; }
        .card { background: var(--glass); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 30px; padding: 25px; margin-bottom: 25px; }
        .cosmic-input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 15px; color: #fff; padding: 15px; outline: none; }
        .btn-transmit { background: #fff; color: #000; border: none; padding: 10px 25px; border-radius: 50px; font-weight: 800; cursor: pointer; }
        .btn-transmit:hover { background: var(--cyan); box-shadow: 0 0 20px var(--cyan); }
        .pfp-orbit { width: 100px; height: 100px; border-radius: 35px; border: 3px solid var(--p); object-fit: cover; }
    </style>
</head>
<body>
    <div class="cosmic-void"><div class="accretion-disk"></div><div class="black-hole-core"></div></div>
    <div class="island-nav"><div class="island-text">${islandText}</div></div>
    <div class="dock">
        <i class="fas fa-rocket" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fingerprint" onclick="location.href='/portfolio'"></i>
        <i class="fas fa-power-off" style="color:var(--p);" onclick="location.href='/logout'"></i>
    </div>
    <div class="main-container">
        <div class="feed-engine">
            ${isGuest ? `<div class="card" style="text-align:center;"><button class="btn-transmit" onclick="location.href='/login'">SYNC IDENTITY</button></div>` : 
            (isPortfolio ? content : `
                <div class="card">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" class="cosmic-input" placeholder="What's happening, boss?" required></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; margin-top:15px;">
                            <input type="file" name="media" id="media" hidden>
                            <label for="media" style="cursor:pointer; opacity:0.6;"><i class="fas fa-image"></i></label>
                            <button class="btn-transmit">TRANSMIT</button>
                        </div>
                    </form>
                </div>
                ${content}
            `)}
        </div>
        <div class="side-panel">
            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; margin-bottom:15px;">OMNI-SECTORS</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:10px; text-decoration:none;">🌏 GLOBAL VOID</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#fff; font-size:13px; text-decoration:none; margin-top:5px;"># ${s.name.toUpperCase()}</a>`).join('')}
            </div>
        </div>
    </div>
</body></html>`;
};

// --- [ROUTES] ---
app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    let query = activeSector !== 'Global' ? { sector: activeSector } : {};
    const posts = await Post.find(query).sort({ date: -1 });
    const sectors = await Sector.find().sort({ memberCount: -1 });
    
    const htmlContent = posts.map(p => `
        <div class="card">
            <span style="color:var(--cyan); font-weight:800;">@${p.author} <small style="opacity:0.5;">#${p.sector}</small></span>
            <p style="margin-top:10px;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:15px;">` : ''}
        </div>
    `).join('') || `<div class="card">The void is silent.</div>`;

    res.send(MASTER_UI(htmlContent, req.session.user, sectors, activeSector));
});

app.get('/portfolio', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const u = await User.findOne({ username: req.session.user.username });
    const html = `<div class="card" style="text-align:center;"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}" class="pfp-orbit"><h1>@${u.username}</h1><div style="background:var(--v); display:inline-block; padding:5px 15px; border-radius:50px; margin-top:10px;">AURA: ${u.aura}</div></div>`;
    res.send(MASTER_UI(html, u, [], 'Identity', true));
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    await User.findOneAndUpdate({ username: req.session.user.username }, { $inc: { aura: 10 } });
    res.redirect('back');
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
        <form action="/login" method="POST" style="text-align:center;">
            <h1>SYNC IDENTITY</h1>
            <input name="username" placeholder="USERNAME" required style="display:block; margin:10px auto; padding:10px;"><input name="password" type="password" placeholder="KEY" required style="display:block; margin:10px auto; padding:10px;"><button style="padding:10px 40px; border-radius:50px; cursor:pointer;">SYNC</button>
        </form></body>`);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
        const hashed = await bcrypt.hash(password, 10);
        user = await new User({ username: username.toLowerCase(), password: hashed }).save();
    }
    if (await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else res.send("Denied.");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

// --- [FINAL EXPORT] ---
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('🚀 LIVE ON 3000'));
}
module.exports = app;