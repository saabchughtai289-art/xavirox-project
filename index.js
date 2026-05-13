/* =============================================================================
   🚀 XAVIROX COSMIC OPERATING SYSTEM - VER 16.0 (THE FINAL MERGE)
=============================================================================
   AUTHOR: XAVIROX DEV TEAM (LEAD BY BOSS)
   YEAR: 2026 | STATUS: UNSTOPPABLE AURA
   
   FEATURES INCLUDED:
   - 🐱 Privacy Cat Login (Eyes follow/hide)
   - 🛰️ Sector/Community Creation System
   - 💬 Professional Feedback Transmission Bar
   - 🎭 Ghost Mode (Anonymous Posting)
   - 📂 Hybrid Media Engine (Image/Video Base64)
   - 🌌 Black Hole & Stardust UI Animation
   - ⚡ Unhinged Placeholder Engine (100+ Lines)
   - 🛡️ Neural Guard (Password Hashing & Session Security)
=============================================================================
*/

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// --- [SECTION 1: DATABASE ARCHITECTURE] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('--------------------------------------------------');
        console.log('🌌 [SYSTEM]: NEURAL LINK ESTABLISHED WITH MONGODB');
        console.log('🚀 [STATUS]: COSMIC CORE IS NOW ONLINE');
        console.log('--------------------------------------------------');
    })
    .catch(err => console.log('💥 [CRITICAL FAILURE]:', err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }],
    bio: { type: String, default: "Exploring the XAVIROX void." },
    auraPoints: { type: Number, default: 100 }
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    mediaType: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
    sector: { type: String, default: 'General' },
    votes: { type: Number, default: 0 },
    votedBy: [String],
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "A new sector in the cosmic web." },
    createdBy: String,
    memberCount: { type: Number, default: 0 }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Sector = mongoose.model('Sector', SectorSchema);

// --- [SECTION 2: INFRASTRUCTURE & SETTINGS] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' })); 

app.use(session({
    secret: 'xavirox_ultra_unhinged_cat_privacy_2026_supreme_edition',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 Hour Life
}));

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB HQ Support
});

const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.send(`<script>alert('Vibe Check Failed! Redirecting to Auth...'); window.location='/login';</script>`);
};

// --- [SECTION 3: THE COSMIC UI ENGINE] ---
const MASTER_UI = (content, user, sectors) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>XAVIROX | Cosmic Horizon</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        :root { 
            --p: #ff007f; --b: #007AFF; --v: #7000ff; --glass: rgba(255, 255, 255, 0.04); --border: rgba(255, 255, 255, 0.1); 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        body { background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }

        /* Animated Background Elements */
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; height: 500px; background: #000; border-radius: 50%; box-shadow: 0 0 60px 20px #fff, 0 0 140px 60px var(--v), 0 0 240px 90px var(--p); z-index: -5; opacity: 0.25; filter: blur(80px); animation: drift 20s infinite alternate; }
        @keyframes drift { from { transform: translate(-55%, -45%); } to { transform: translate(-45%, -55%); } }
        
        /* Sidebar Dock */
        .side-dock { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); width: 75px; background: var(--glass); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 40px 0; gap: 45px; z-index: 2000; }
        .side-dock i { font-size: 24px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .side-dock i:hover { color: var(--p); transform: scale(1.3); filter: drop-shadow(0 0 10px var(--p)); }
        .active-btn { color: var(--p) !important; }

        /* Top Navigation */
        .nav { position: fixed; top: 0; width: 100%; height: 85px; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 50px 0 130px; z-index: 1000; }
        .logo { font-size: 28px; font-weight: 900; background: linear-gradient(to right, var(--p), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 5px; cursor: pointer; }

        /* Main Feed Layout */
        .wrapper { display: flex; max-width: 1350px; margin: 110px 20px 150px 130px; gap: 40px; }
        .feed { flex: 2; min-width: 0; }
        .sidebar { flex: 1; position: sticky; top: 110px; height: fit-content; }

        /* Components */
        .card { background: var(--glass); border-radius: 35px; padding: 30px; margin-bottom: 30px; border: 1px solid var(--border); backdrop-filter: blur(30px); }
        .card:hover { border-color: var(--p); box-shadow: 0 10px 40px rgba(255, 0, 127, 0.1); }
        
        textarea { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 20px; color: #fff; padding: 20px; font-size: 17px; outline: none; }
        .primary-btn { background: #fff; color: #000; border: none; padding: 15px 35px; border-radius: 50px; font-weight: bold; cursor: pointer; }
        .primary-btn:hover { background: var(--p); color: #fff; box-shadow: 0 0 20px var(--p); }

        .post-media { width: 100%; border-radius: 25px; margin-top: 20px; border: 1px solid var(--border); }
        .tag { background: var(--v); padding: 5px 15px; border-radius: 10px; font-size: 12px; margin-bottom: 15px; display: inline-block; }

        @media (max-width: 950px) {
            .wrapper { margin: 100px 15px; flex-direction: column; }
            .side-dock { bottom: 20px; top: auto; left: 50%; transform: translateX(-50%); flex-direction: row; width: 92%; height: 70px; padding: 0 30px; border-radius: 20px; }
            .nav { padding: 0 20px; justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="black-hole"></div>
    
    <div class="side-dock">
        <i class="fas fa-home active-btn" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fire"></i>
        <div style="width:50px; height:50px; background:var(--p); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            <i class="fas fa-plus" style="color:white; margin:0;"></i>
        </div>
        <i class="fas fa-compass"></i>
        ${user ? `<i class="fas fa-power-off" onclick="location.href='/logout'" style="color:red;"></i>` : `<i class="fas fa-user-circle" onclick="location.href='/login'"></i>`}
    </div>

    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        <div style="font-weight:bold;">${user ? '@'+user.username : 'GUEST_ENTITY'}</div>
    </nav>

    <div class="wrapper">
        <div class="feed">
            <div class="card" style="border-left: 5px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" id="unhinged-input" placeholder="Loading brainrot..." ${user ? '' : 'disabled'}></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                        <div style="display:flex; gap:20px; align-items:center;">
                            <label style="cursor:pointer; font-size:22px; color:var(--b);">
                                <i class="fas fa-photo-video"></i>
                                <input type="file" name="media" hidden accept="image/*,video/*">
                            </label>
                            <select name="sector" style="background:#000; color:#fff; border:1px solid var(--border); border-radius:10px; padding:8px;">
                                <option value="General">General Sector</option>
                                ${sectors.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <input type="checkbox" name="isAnonymous" id="ghst" style="accent-color:var(--p);">
                            <label for="ghst" style="font-size:12px;">GHOST</label>
                            <button class="primary-btn">TRANSMIT</button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="content-flow">${content}</div>
        </div>

        <div class="sidebar">
            <div class="card">
                <h3 style="margin-bottom:20px;"><i class="fas fa-users"></i> SECTORS</h3>
                ${sectors.map(s => `
                    <div style="padding:12px; background:rgba(255,255,255,0.03); border-radius:15px; margin-bottom:10px; display:flex; justify-content:space-between;">
                        <span># ${s.name}</span>
                        <i class="fas fa-chevron-right" style="font-size:10px; opacity:0.3;"></i>
                    </div>
                `).join('')}
                <form action="/addsector" method="POST" style="margin-top:20px;">
                    <input name="sName" placeholder="Create Community..." required style="width:100%; padding:12px; border-radius:12px; background:#000; border:1px solid var(--border); color:#fff; margin-bottom:10px;">
                    <button style="width:100%; padding:12px; border-radius:12px; background:var(--b); border:none; color:white; font-weight:bold; cursor:pointer;">ADD SECTOR</button>
                </form>
            </div>

            <div class="card" style="border-top: 1px solid var(--p);">
                <h3 style="margin-bottom:15px;"><i class="fas fa-headset"></i> FEEDBACK</h3>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Message Xavi..." style="height:80px; font-size:14px;"></textarea>
                    <button class="primary-btn" style="width:100%; margin-top:15px;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        const lines = ["type before the cringe hits", "certified yap zone", "drop lore immediately", "bro is thinking...", "summong chaos here", "enter your villain arc"];
        const input = document.getElementById('unhinged-input');
        if(input) input.placeholder = lines[Math.floor(Math.random()*lines.length)];
    </script>
</body>
</html>
`;

// --- [SECTION 4: CORE ROUTES & LOGIC] ---

app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        const sectors = await Sector.find();
        const user = req.session.user;

        const postHTML = posts.map(p => `
            <div class="card">
                <span class="tag"># ${p.sector}</span>
                <div style="display:flex; align-items:center; gap:15px; margin-bottom:20px;">
                    <div style="width:45px; height:45px; background:linear-gradient(45deg, var(--v), var(--p)); border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                        ${(p.isAnonymous ? 'G' : p.author)[0].toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight:bold; color:var(--p);">@${p.isAnonymous ? 'Ghost_Entity' : p.author}</div>
                        <div style="font-size:10px; opacity:0.4;">${new Date(p.date).toLocaleString()}</div>
                    </div>
                </div>
                <div style="font-size:18px; line-height:1.6;">${p.content}</div>
                ${p.mediaUrl ? (p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`) : ''}
            </div>
        `).join('');

        res.send(MASTER_UI(postHTML, user, sectors));
    } catch (e) { res.send("System Error."); }
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({
        author: req.session.user.username,
        content: req.body.content,
        sector: req.body.sector,
        isAnonymous: req.body.isAnonymous === 'on',
        mediaUrl,
        mediaType: req.file ? req.file.mimetype : null
    }).save();
    res.redirect('/dashboard');
});

app.post('/addsector', isAuth, async (req, res) => {
    try { await new Sector({ name: req.body.sName.trim(), createdBy: req.session.user.username }).save(); } catch(e){}
    res.redirect('/dashboard');
});

// --- [SECTION 5: THE LEGENDARY CAT LOGIN] ---
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>XAVIROX | Access</title>
        <style>
            body { background:#000; color:#fff; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }
            .box { background:#111; padding:50px; border-radius:40px; width:360px; text-align:center; border:1px solid #222; }
            .cat-box { font-size:70px; margin-bottom:20px; transition: 0.5s; display:inline-block; }
            .privacy-mode { transform: rotateY(180deg); filter: blur(2px); }
            input { width:100%; padding:15px; margin:10px 0; border-radius:12px; background:#000; border:1px solid #333; color:#fff; outline:none; }
            button { width:100%; padding:15px; background:#ff007f; border:none; color:#fff; font-weight:bold; border-radius:50px; cursor:pointer; margin-top:20px; }
        </style>
    </head>
    <body>
        <div class="box">
            <div id="cat" class="cat-box">🐱</div>
            <h2 style="letter-spacing:3px;">AUTHORIZE</h2>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" onfocus="look()" required>
                <input name="password" type="password" placeholder="Passkey" onfocus="hide()" required>
                <button>INITIALIZE SYNC</button>
            </form>
            <p style="margin-top:20px; font-size:12px; opacity:0.5;">No ID? <a href="/signup" style="color:#ff007f;">Sync Here</a></p>
        </div>
        <script>
            const c = document.getElementById('cat');
            function look() { c.classList.remove('privacy-mode'); c.innerText = '😺'; }
            function hide() { c.classList.add('privacy-mode'); c.innerText = '🙈'; }
        </script>
    </body>
    </html>
    `);
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Mismatch!'); window.location='/login';</script>");
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><div style="background:#111; padding:50px; border-radius:40px; width:360px; text-align:center; border:1px solid #222;"><h2>NEW ENTITY</h2><form action="/signup" method="POST"><input name="username" placeholder="Username" required style="width:100%; padding:15px; margin:10px 0; border-radius:12px; background:#000; border:1px solid #333; color:#fff;"><input name="email" type="email" placeholder="Email" required style="width:100%; padding:15px; margin:10px 0; border-radius:12px; background:#000; border:1px solid #333; color:#fff;"><input name="password" type="password" placeholder="Password" required style="width:100%; padding:15px; margin:10px 0; border-radius:12px; background:#000; border:1px solid #333; color:#fff;"><button style="width:100%; padding:15px; background:#007AFF; border:none; color:#fff; font-weight:bold; border-radius:50px; cursor:pointer; margin-top:20px;">CREATE ID</button></form></div></body>`);
});

app.post('/signup', async (req, res) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        await new User({ username: req.body.username.toLowerCase(), email: req.body.email, password: hashed }).save();
        res.redirect('/login');
    } catch(e) { res.send("ID already exists."); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

// --- [SECTION 6: FEEDBACK ENGINE] ---
app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } });
    res.send("<script>alert('Signal Sent to Xavi!'); window.location='/dashboard';</script>");
});

// --- [SECTION 7: LAUNCH] ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🚀 [XAVIROX LIVE ON PORT ' + PORT + ']'));