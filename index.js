/* =============================================================================
   🚀 XAVIROX COSMIC OPERATING SYSTEM - VER 20.0 (COMMUNITY POSTING FIX)
=============================================================================
   AUTHOR: XAVIROX BOSS | YEAR: 2026 | STATUS: FULLY OPERATIONAL
   
   CHANGELOG VER 20.0:
   - ✅ FIXED: Posts now correctly link to selected Sectors/Communities.
   - ✅ FIXED: Sector selection dropdown in the broadcast box.
   - ✅ ADDED: Sector Tags on every post to identify where it belongs.
   - 🐱🦜 Animated Login: Cat & Parrot (Foster's Video Style) fully merged.
   - 💎 Glassmorphism: Ultra-high transparency with backdrop-blur.
   - 🌌 Background: Black Hole & Stardust engine active.
=============================================================================
*/

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// --- [SECTION 1: DATA CORE] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log('🌌 [SYNCED]: COSMIC DATABASE ONLINE'))
    .catch(err => console.log('💥 [CRITICAL ERROR]:', err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }]
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    mediaType: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
    sector: { type: String, required: true, default: 'General' }, // Linked to Community
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Sector = mongoose.model('Sector', SectorSchema);

// --- [SECTION 2: CONFIGURATION] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' })); 

app.use(session({
    secret: 'xavirox_sector_fix_2026_ultra_supreme',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const upload = multer({ storage: multer.memoryStorage() });

const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.send(`<script>alert('Vibe Check: Neural ID Required!'); window.location='/login';</script>`);
};

// --- [SECTION 3: THE SUPREME INTERFACE] ---
const MASTER_UI = (content, user, sectors) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | Community Hub</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        :root { --p: #ff007f; --b: #007AFF; --v: #7000ff; --glass: rgba(255, 255, 255, 0.04); --border: rgba(255, 255, 255, 0.1); }
        * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        body { background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }

        /* Effects */
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: #000; border-radius: 50%; box-shadow: 0 0 100px #fff, 0 0 200px var(--v), 0 0 400px var(--p); z-index: -10; opacity: 0.3; filter: blur(80px); animation: swirl 20s infinite linear; }
        @keyframes swirl { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        
        /* Glass UI Components */
        .side-dock { position: fixed; left: 25px; top: 50%; transform: translateY(-50%); width: 85px; background: rgba(255,255,255,0.06); backdrop-filter: blur(60px); border: 1px solid var(--border); border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 45px 0; gap: 45px; z-index: 2000; }
        .side-dock i { font-size: 26px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .side-dock i:hover { color: var(--p); transform: scale(1.3); }

        .nav { position: fixed; top: 0; width: 100%; height: 90px; background: rgba(0,0,0,0.85); backdrop-filter: blur(30px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 60px 0 145px; z-index: 1000; }
        .logo { font-size: 32px; font-weight: 900; background: linear-gradient(to right, var(--p), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 7px; cursor: pointer; }

        .wrapper { display: flex; max-width: 1400px; margin: 120px 20px 150px 145px; gap: 45px; }
        .feed { flex: 2; }
        .sidebar { flex: 1; position: sticky; top: 120px; height: fit-content; }

        .card { background: var(--glass); border-radius: 35px; padding: 35px; margin-bottom: 35px; border: 1px solid var(--border); backdrop-filter: blur(50px); }
        .card:hover { border-color: var(--p); }

        textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 25px; color: #fff; padding: 25px; font-size: 18px; outline: none; }
        .primary-btn { background: #fff; color: #000; border: none; padding: 18px 45px; border-radius: 60px; font-weight: 900; cursor: pointer; }
        .primary-btn:hover { background: var(--p); color: #fff; box-shadow: 0 0 30px var(--p); }

        .tag { background: var(--v); padding: 7px 18px; border-radius: 12px; font-size: 12px; display: inline-block; margin-bottom: 15px; font-weight: bold; }
        .footer { text-align: center; padding: 70px; border-top: 1px solid var(--border); margin-left: 145px; background: rgba(0,0,0,0.4); }
        .gmail { color: var(--p); text-decoration: none; font-weight: bold; font-size: 18px; }

        @media (max-width: 950px) {
            .wrapper { margin: 100px 15px; flex-direction: column; }
            .side-dock { bottom: 20px; top: auto; left: 50%; transform: translateX(-50%); flex-direction: row; width: 92%; height: 75px; padding: 0 30px; }
            .footer { margin-left: 0; }
        }
    </style>
</head>
<body>
    <div class="black-hole"></div>
    
    <div class="side-dock">
        <i class="fas fa-home" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fire"></i>
        <div style="width:55px; height:55px; background:var(--p); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})"><i class="fas fa-plus" style="color:white;"></i></div>
        <i class="fas fa-globe"></i>
        ${user ? `<i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);"></i>` : `<i class="fas fa-key" onclick="location.href='/login'"></i>`}
    </div>

    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        <div style="font-weight:bold;">${user ? '@'+user.username : 'GUEST_USER'}</div>
    </nav>

    <div class="wrapper">
        <div class="feed">
            <div class="card" style="border-left: 10px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" placeholder="Share lore in a community..." required></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px;">
                        <div style="display:flex; gap:20px; align-items:center;">
                            <label style="cursor:pointer; font-size:28px; color:var(--b);">
                                <i class="fas fa-paperclip"></i>
                                <input type="file" name="media" hidden accept="image/*,video/*">
                            </label>
                            <select name="sector" style="background:#000; color:#fff; border:1px solid var(--border); padding:12px; border-radius:15px; font-weight:bold;">
                                <option value="General"># General_Sector</option>
                                ${sectors.map(s => `<option value="${s.name}"># ${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div style="display:flex; align-items:center; gap:15px;">
                            <input type="checkbox" name="isAnonymous" id="gh" style="width:20px; height:20px;">
                            <label for="gh">GHOST</label>
                            <button class="primary-btn">TRANSMIT</button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="void-feed">${content}</div>
        </div>

        <div class="sidebar">
            <div class="card">
                <h3 style="color:var(--b); margin-bottom:20px;">🛰️ ESTABLISHED COMMUNITIES</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${sectors.length > 0 ? sectors.map(s => `<div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:15px; margin-bottom:12px; border-left:3px solid var(--v);"># ${s.name}</div>`).join('') : '<p style="opacity:0.4;">No sectors found.</p>'}
                </div>
                <form action="/addsector" method="POST" style="margin-top:25px;">
                    <input name="sName" placeholder="New Community Name..." required style="width:100%; padding:15px; border-radius:15px; background:#000; border:1px solid var(--border); color:#fff; margin-bottom:15px;">
                    <button class="primary-btn" style="width:100%; background:var(--v); color:white;">CREATE SECTOR</button>
                </form>
            </div>

            <div class="card">
                <h3 style="margin-bottom:20px;"><i class="fas fa-headset"></i> SIGNAL FEEDBACK</h3>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Tell Admin Boss..." style="height:100px; font-size:15px;"></textarea>
                    <button class="primary-btn" style="width:100%; margin-top:20px;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>

    <footer class="footer">
        <p>XAVIROX COSMOS © 2026 | ALL SIGNALS ENCRYPTED</p>
        <a href="mailto:xavirox.co@gmail.com" class="gmail"><i class="fas fa-envelope-open"></i> xavirox.co@gmail.com</a>
    </footer>
</body>
</html>
`;

// --- [SECTION 4: FOSTER-STYLE LOGIN] ---
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>XAVIROX | Access</title>
        <style>
            body { background: #1a0518; color: white; font-family: sans-serif; margin: 0; display: flex; height: 100vh; overflow: hidden; }
            .char-side { flex: 1.2; background: #2d0a28; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 80px; position: relative; border-right: 1px solid rgba(255,255,255,0.1); }
            .form-side { flex: 1; background: rgba(0,0,0,0.3); backdrop-filter: blur(60px); display: flex; align-items: center; justify-content: center; }
            
            .character { font-size: 110px; transition: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: absolute; filter: drop-shadow(0 0 20px rgba(0,0,0,0.5)); }
            .cat { left: 20%; bottom: 15%; }
            .parrot { right: 20%; bottom: 25%; }
            
            .hide { transform: translateY(150px) scale(0); opacity: 0; }
            .focus { transform: scale(1.4) translateY(-40px); filter: drop-shadow(0 0 30px #ff007f); }

            .box { width: 420px; padding: 65px; border-radius: 45px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(40px); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
            input { width: 100%; padding: 22px; margin: 15px 0; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.6); color: white; outline: none; font-size: 16px; }
            button { width: 100%; padding: 22px; border-radius: 60px; background: #ff007f; color: white; border: none; font-weight: 900; cursor: pointer; margin-top: 25px; font-size: 18px; }
        </style>
    </head>
    <body>
        <div class="char-side">
            <div id="c" class="character cat">🐱</div>
            <div id="p" class="character parrot">🦜</div>
            <h1 style="position:absolute; top:60px; opacity:0.1; font-size:120px; letter-spacing:10px;">XAVIROX</h1>
        </div>
        <div class="form-side">
            <div class="box">
                <h2 style="font-size:38px; margin-bottom:10px;">Welcome Back</h2>
                <p style="opacity:0.5; margin-bottom:40px;">Please authenticate your neural ID</p>
                <form action="/login" method="POST">
                    <input name="username" placeholder="Username" onfocus="watch()" required>
                    <input name="password" type="password" placeholder="Password" onfocus="hide()" required>
                    <button>INITIALIZE SYNC</button>
                </form>
                <p style="margin-top:30px; font-size:14px; opacity:0.6;">Don't have an ID? <a href="/signup" style="color:#ff007f; text-decoration:none;">Sign Up</a></p>
            </div>
        </div>
        <script>
            const cat = document.getElementById('c');
            const parrot = document.getElementById('p');
            function watch() { 
                cat.classList.remove('hide'); parrot.classList.remove('hide'); 
                cat.classList.add('focus'); cat.innerText = '😺'; parrot.innerText = '🧐'; 
            }
            function hide() { 
                cat.classList.add('hide'); parrot.classList.add('hide'); 
            }
        </script>
    </body>
    </html>
    `);
});

// --- [SECTION 5: SYSTEM ROUTES] ---

app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        const sectors = await Sector.find();
        const user = req.session.user;

        const html = posts.map(p => `
            <div class="card">
                <span class="tag"># ${p.sector}</span>
                <div style="display:flex; align-items:center; gap:20px; margin-bottom:20px;">
                    <div style="width:55px; height:55px; background:linear-gradient(45deg, var(--v), var(--p)); border-radius:18px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:20px;">
                        ${(p.isAnonymous ? 'G' : p.author)[0].toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight:bold; color:var(--p); font-size:18px;">@${p.isAnonymous ? 'Ghost_Entity' : p.author}</div>
                        <div style="font-size:11px; opacity:0.4;">${new Date(p.date).toLocaleString()}</div>
                    </div>
                </div>
                <p style="font-size:20px; line-height:1.7; font-weight:300;">${p.content}</p>
                ${p.mediaUrl ? (p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`) : ''}
            </div>
        `).join('');

        res.send(MASTER_UI(html, user, sectors));
    } catch (e) { res.status(500).send("Cosmic Sync Failure."); }
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ 
        author: req.session.user.username, 
        content: req.body.content, 
        sector: req.body.sector, // THE FIX: This now takes the value from dropdown
        mediaUrl, 
        mediaType: req.file ? req.file.mimetype : null,
        isAnonymous: req.body.isAnonymous === 'on'
    }).save();
    res.redirect('/dashboard');
});

app.post('/addsector', isAuth, async (req, res) => {
    try { 
        const name = req.body.sName.trim().replace(/\s+/g, '_');
        await new Sector({ name: name, createdBy: req.session.user.username }).save(); 
    } catch(e){}
    res.redirect('/dashboard');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Neural ID Mismatch!'); window.location='/login';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

// Feedback Fix
app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } });
    res.send("<script>alert('Signal Sent to Master Console!'); window.location='/dashboard';</script>");
});

app.listen(3000, () => console.log('🚀 [XAVIROX LIVE]: NEURAL LINK ACTIVE ON PORT 3000'));