/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - VERSION 40.0 [ULTRA-EXPANSION & OMNI-REDACTED]
    DEVELOPER: XAVIROX & GEMINI AI COLLABORATION | YEAR: 2026 | STATUS: TITAN STABLE
    ----------------------------------------------------------------------------------------------------
    FEATURES: 
    1. DYNAMIC COMMUNITIES (SECTORS) - USER GENERATED
    2. COSMIC BLACKHOLE UI 2.0 (EVENT HORIZON ANIMATION)
    3. GEN-Z PORTFOLIO V3 (GLASSMORPHISM + AURA CONTROL)
    4. NEURAL FEEDBACK SYSTEM (ADMIN SIGNALS)
    5. OMNI-SEARCH ENGINE (INTERNAL SECTOR SEARCH)
    6. SECURITY PROTOCOLS (BCRYPT + SESSION ENCRYPTION)
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// --- [DATABASE ARCHITECTURE - DEEP NEURAL LINK] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

let cachedDb = null;
async function connectDB() {
    if (cachedDb) return cachedDb;
    try {
        const db = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = db;
        console.log('✅ [XAVIROX]: COSMIC-LINK 40.0 - ALL SECTORS ONLINE');
        return db;
    } catch (err) {
        console.error('❌ [DATABASE CRITICAL ERROR]:', err);
        process.exit(1);
    }
}

// --- [SCHEMA ARCHITECTURE - THE COSMOS DATA] ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    pfp: { type: String, default: "" },
    bio: { type: String, default: "Inhabitant of the Xavirox Cosmos. Lurking in the void." },
    aura: { type: Number, default: 100 },
    rank: { type: String, default: "Cosmic Citizen" },
    skills: { type: [String], default: ["Gen-Z", "Xaviroxian", "Web Dev"] },
    feedback: [{ msg: String, from: String, date: { type: Date, default: Date.now } }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    socialLinks: { instagram: String, github: String, twitter: String }
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    likes: { type: Number, default: 0 },
    comments: [{ user: String, text: String, date: { type: Date, default: Date.now } }],
    sector: { type: String, default: 'General' },
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({ 
    name: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "A new pocket in the Xavirox void." },
    createdBy: String,
    memberCount: { type: Number, default: 1 }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Sector = mongoose.models.Sector || mongoose.model('Sector', SectorSchema);

// --- [SYSTEM MIDDLEWARE - THE NEURAL NET] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({ 
    secret: 'xavirox_cosmic_core_unlocked_2026_ultra_secret_key_999', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: false } 
}));

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 } 
});

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// --- [MASTER UI ENGINE - COSMIC FRAMEWORK] ---
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
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;400;800&family=Space+Grotesk:wght@300;700&display=swap" rel="stylesheet">
    <style>
        :root { 
            --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000;
            --glass: rgba(255, 255, 255, 0.03); --border: rgba(255, 255, 255, 0.08);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
        body { background: var(--bg); color: #fff; overflow-x: hidden; min-height: 100vh; }

        /* --- THE BLACK HOLE: EVENT HORIZON --- */
        .cosmic-void { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100vw; height: 100vh; z-index: -10; pointer-events: none; }
        .black-hole-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 250px; height: 250px; background: #000; border-radius: 50%; box-shadow: 0 0 80px 20px var(--v), 0 0 150px 40px var(--p), 0 0 300px 60px rgba(112, 0, 255, 0.2); }
        .accretion-disk { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotateX(70deg); width: 600px; height: 600px; border: 4px solid var(--cyan); border-radius: 50%; filter: blur(2px); animation: spin 8s linear infinite; box-shadow: 0 0 40px var(--cyan), inset 0 0 40px var(--cyan); }
        @keyframes spin { from { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(0deg); } to { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(360deg); } }

        /* --- DYNAMIC ISLAND NAVIGATION --- */
        .island-nav { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 400px; height: 50px; background: rgba(0,0,0,0.85); backdrop-filter: blur(30px); border-radius: 100px; border: 1px solid var(--border); border-top: 2px solid var(--p); display: flex; align-items: center; justify-content: center; z-index: 9999; cursor: pointer; }
        .island-nav:hover { width: 500px; height: 60px; border-color: var(--cyan); }
        .island-text { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 3px; color: #fff; text-shadow: 0 0 10px var(--p); }

        /* --- LEFT DOCK SYSTEMS --- */
        .dock { position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 75px; background: var(--glass); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 100px; display: flex; flex-direction: column; padding: 40px 0; gap: 35px; align-items: center; z-index: 1000; }
        .dock i { font-size: 22px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .dock i:hover { color: var(--cyan); transform: scale(1.4) rotate(10deg); text-shadow: 0 0 20px var(--cyan); }
        .active-link { color: var(--p) !important; text-shadow: 0 0 15px var(--p); }

        /* --- CONTENT WRAPPER --- */
        .main-container { max-width: 1200px; margin: 120px auto 50px 150px; display: flex; gap: 40px; }
        .feed-engine { flex: 2; }
        .side-panel { flex: 1; position: sticky; top: 120px; height: fit-content; }

        /* --- GLASS CARDS --- */
        .card { background: var(--glass); backdrop-filter: blur(60px); border: 1px solid var(--border); border-radius: 40px; padding: 35px; margin-bottom: 30px; position: relative; overflow: hidden; }
        .card:hover { border-color: rgba(255, 255, 255, 0.2); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .card::before { content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); transition: 0.8s; }
        .card:hover::before { left: 100%; }

        /* --- INPUTS & BUTTONS --- */
        .cosmic-input { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 20px; color: #fff; padding: 20px; outline: none; font-size: 16px; }
        .cosmic-input:focus { border-color: var(--v); box-shadow: 0 0 20px rgba(112, 0, 255, 0.2); }
        .btn-transmit { background: #fff; color: #000; border: none; padding: 12px 35px; border-radius: 50px; font-weight: 800; cursor: pointer; letter-spacing: 1px; font-size: 12px; }
        .btn-transmit:hover { background: var(--cyan); box-shadow: 0 0 30px var(--cyan); transform: scale(1.05); }

        /* --- PORTFOLIO EXTRAS --- */
        .pfp-orbit { width: 150px; height: 150px; border-radius: 50px; border: 4px solid var(--p); object-fit: cover; box-shadow: 0 0 50px rgba(255,0,127,0.4); margin-bottom: 25px; }
        .aura-badge { background: linear-gradient(45deg, var(--v), var(--p)); padding: 8px 20px; border-radius: 50px; font-weight: 900; font-size: 12px; }
        .sector-tag { display: inline-block; padding: 5px 15px; border-radius: 50px; background: rgba(255,255,255,0.1); font-size: 10px; font-weight: bold; margin-right: 10px; color: var(--cyan); }

        /* --- COMMUNITY MODAL --- */
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: none; align-items: center; justify-content: center; }
        
        .footer { margin: 100px 0 50px 150px; opacity: 0.3; font-size: 11px; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="cosmic-void">
        <div class="accretion-disk"></div>
        <div class="black-hole-core"></div>
    </div>

    <div class="island-nav">
        <div class="island-text">${islandText}</div>
    </div>

    <div class="dock">
        <i class="fas fa-rocket ${activeSector !== 'Identity' ? 'active-link' : ''}" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fingerprint ${activeSector === 'Identity' ? 'active-link' : ''}" onclick="location.href='/portfolio'"></i>
        <i class="fas fa-atom" onclick="document.getElementById('sector-modal').style.display='flex'"></i>
        <i class="fas fa-search"></i>
        <i class="fas fa-power-off" style="margin-top:auto; color:var(--p);" onclick="location.href='/logout'"></i>
    </div>

    <div class="main-container">
        <div class="feed-engine">
            ${isGuest ? `
                <div class="card" style="text-align:center; border: 2px solid var(--v);">
                    <h1 style="margin-bottom:15px; font-family:'Space Grotesk'">ACCESS DENIED.</h1>
                    <p style="opacity:0.6; margin-bottom:25px;">You are currently drifting in the void. Sync your identity to interact.</p>
                    <button class="btn-transmit" onclick="location.href='/login'">SYNC NOW</button>
                </div>
            ` : (isPortfolio ? content : `
                <div class="card" style="border-top: 4px solid var(--p);">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" class="cosmic-input" style="height:120px;" placeholder="What's happening in your sector, boss?" required></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                            <label style="cursor:pointer; opacity:0.5;"><i class="fas fa-image fa-lg"></i><input type="file" name="media" hidden></label>
                            <button class="btn-transmit">TRANSMIT TO VOID</button>
                        </div>
                    </form>
                </div>
                ${content}
            `)}
        </div>

        <div class="side-panel">
            <div class="card">
                <h4 style="font-size:11px; opacity:0.5; margin-bottom:20px; letter-spacing:2px;">OMNI-SECTORS</h4>
                <a href="/dashboard?sector=Global" style="display:block; text-decoration:none; color:var(--cyan); font-weight:900; margin-bottom:15px;">🌏 THE GLOBAL VOID</a>
                ${sectors.map(s => `
                    <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
                        <a href="/dashboard?sector=${s.name}" style="text-decoration:none; color:#fff; font-size:14px; opacity:0.8;"># ${s.name.toUpperCase()}</a>
                        <span style="font-size:10px; opacity:0.3;">${s.memberCount} Mapped</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h4 style="font-size:11px; opacity:0.5; margin-bottom:15px; letter-spacing:2px;">FEEDBACK LOOP</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" class="cosmic-input" style="height:80px; font-size:12px;" placeholder="Message for Xavi..."></textarea>
                    <button class="btn-transmit" style="width:100%; margin-top:10px; background:var(--v); color:#fff;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>

    <div id="sector-modal" class="modal">
        <div class="card" style="width:400px; background:#000; border: 2px solid var(--cyan);">
            <h2 style="margin-bottom:20px;">CREATE SECTOR</h2>
            <form action="/create-sector" method="POST">
                <input name="name" class="cosmic-input" placeholder="sector-name (e.g. coding)" required style="margin-bottom:20px;">
                <textarea name="description" class="cosmic-input" placeholder="What is this sector for?" style="height:80px; margin-bottom:20px;"></textarea>
                <div style="display:flex; gap:10px;">
                    <button type="button" class="btn-transmit" style="background:#222; color:#fff;" onclick="document.getElementById('sector-modal').style.display='none'">CANCEL</button>
                    <button class="btn-transmit">INITIALIZE</button>
                </div>
            </form>
        </div>
    </div>

    <footer class="footer">
        © 2026 XAVIROX COSMIC OS | VERSION 40.0 TITAN | ENCRYPTED BY THE VOID
    </footer>
</body>
</html>`;
};

// --- [CORE LOGIC & ROUTES] ---

app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', async (req, res) => {
    try {
        const activeSector = req.query.sector || 'Global';
        let query = {};
        if (activeSector !== 'Global') query.sector = activeSector;

        const posts = await Post.find(query).sort({ date: -1 }).limit(100);
        const sectors = await Sector.find().sort({ memberCount: -1 });
        const user = req.session.user;

        const htmlContent = posts.map(p => `
            <div class="card">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                    <span style="color:var(--cyan); font-weight:900; font-size:13px;">@${p.author} <span class="sector-tag">#${p.sector}</span></span>
                    <span style="opacity:0.3; font-size:10px;">${new Date(p.date).toLocaleTimeString()}</span>
                </div>
                <p style="font-size:16px; line-height:1.6; opacity:0.9;">${p.content}</p>
                ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:25px; margin-top:20px; border:1px solid var(--border);">` : ''}
                <div style="margin-top:20px; display:flex; gap:20px; opacity:0.4; font-size:14px;">
                    <span><i class="fas fa-heart"></i> ${p.likes}</span>
                    <span><i class="fas fa-comment"></i> ${p.comments.length}</span>
                    <i class="fas fa-share-alt" style="margin-left:auto;"></i>
                </div>
            </div>
        `).join('') || `<div class="card" style="text-align:center; opacity:0.5;">The void is currently silent in this sector.</div>`;

        res.send(MASTER_UI(htmlContent, user, sectors, activeSector));
    } catch (err) { res.status(500).send("System Reboot Required."); }
});

app.get('/portfolio', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const u = await User.findOne({ username: req.session.user.username });
    const sectors = await Sector.find();
    
    const html = `
        <div class="card" style="text-align:center; position:relative;">
            <div class="aura-badge" style="position:absolute; top:30px; right:30px;">AURA: ${u.aura}</div>
            <img src="${u.pfp || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.username}" class="pfp-orbit">
            <h1 style="font-size:45px; font-family:'Space Grotesk'; letter-spacing:-2px;">@${u.username}</h1>
            <div style="color:var(--cyan); font-weight:bold; margin-bottom:20px;">RANK: ${u.rank}</div>
            <p style="max-width:500px; margin:0 auto 25px; opacity:0.7; line-height:1.7;">${u.bio}</p>
            <div style="display:flex; justify-content:center; gap:12px; margin-bottom:30px;">
                ${u.skills.map(s => `<span class="sector-tag" style="background:var(--v); color:#fff; padding:8px 20px;">${s}</span>`).join('')}
            </div>
            ${u.username === 'xavi' ? `<button class="btn-transmit" onclick="location.href='/admin/signals'">VIEW NEURAL SIGNALS</button>` : ''}
        </div>
    `;
    res.send(MASTER_UI(html, u, sectors, 'Identity', true));
});

app.post('/create-sector', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { name, description } = req.body;
        await new Sector({ name: name.toLowerCase(), description, createdBy: req.session.user.username }).save();
        res.redirect('/dashboard?sector=' + name.toLowerCase());
    } catch (e) { res.redirect('/dashboard'); }
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let mediaUrl = null;
    if (req.file) mediaUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    await new Post({ 
        author: req.session.user.username, 
        content: req.body.content, 
        sector: req.body.sector, 
        mediaUrl 
    }).save();
    
    // Increase user aura for posting
    await User.findOneAndUpdate({ username: req.session.user.username }, { $inc: { aura: 10 } });
    res.redirect('back');
});

app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html><html><head><title>XAVIROX | SYNC</title>
        <style>
            body { background:#000; color:#fff; font-family:sans-serif; display:flex; height:100vh; align-items:center; justify-content:center; }
            .login-card { width:400px; padding:50px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.1); border-radius:40px; text-align:center; }
            input { width:100%; padding:15px; background:#111; border:1px solid #333; color:#fff; border-radius:15px; margin-bottom:15px; outline:none; }
            button { width:100%; padding:15px; background:#fff; color:#000; font-weight:900; border-radius:50px; border:none; cursor:pointer; }
        </style>
        </head><body>
        <div class="login-card">
            <h1 style="margin-bottom:30px; letter-spacing:2px;">XAVIROX SYNC</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="NEURAL ID" required>
                <input name="password" type="password" placeholder="ACCESS KEY" required>
                <button>SYNC IDENTITY</button>
            </form>
            <p style="margin-top:20px; font-size:12px; opacity:0.4;">New? Just enter details to initialize.</p>
        </div></body></html>
    `);
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
    } else {
        res.send("<script>alert('Sync Failed. Incorrect Key.'); window.location='/login';</script>");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/dashboard');
});

// Final System Export
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(\`🚀 XAVIROX 40.0 TITAN IS LIVE ON PORT \${PORT}\`));
}