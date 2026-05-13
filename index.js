/* =============================================================================
   🚀 XAVIROX COSMIC OPERATING SYSTEM - VER 24.0 (THE OMNI-MERGE)
=============================================================================
   AUTHOR: XAVIROX BOSS | STATUS: ALL SYSTEMS OPERATIONAL | YEAR: 2026
   
   MERGED FEATURES:
   - 🛰️ SECTOR LOCK: Posting is context-aware (Post where you are).
   - 🐱🦜 FOSTER LOGIN: Interactive characters respond to input focus.
   - 🖼️ MULTIMEDIA: Base64 image/video support integrated into the feed.
   - 💎 GLASS UI: 60px backdrop-blur with drifting black-hole engine.
   - 🔐 SECURE AUTH: Bcrypt hashing & Session-based persistence.
=============================================================================
*/

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();

// --- [DATABASE ARCHITECTURE] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";
mongoose.connect(dbURI).then(() => console.log('🌌 [SYNC]: COSMIC CORE ONLINE'));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    author: String,
    content: String,
    mediaUrl: String,
    mediaType: String,
    sector: { type: String, default: 'General' },
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Sector = mongoose.model('Sector', SectorSchema);

// --- [SYSTEM CONFIGURATION] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({
    secret: 'xavirox_omni_merge_2026_ultra',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const upload = multer({ storage: multer.memoryStorage() });
const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- [MASTER UI ENGINE] ---
const MASTER_UI = (content, user, sectors, activeSector = 'Global') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --glass: rgba(255, 255, 255, 0.05); --border: rgba(255, 255, 255, 0.1); }
        * { box-sizing: border-box; margin: 0; padding: 0; transition: 0.4s cubic-bezier(0.1, 0.7, 1.0, 0.1); }
        body { background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }

        /* Void Engine */
        .void { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 750px; height: 750px; background: #000; border-radius: 50%; box-shadow: 0 0 100px #fff, 0 0 300px var(--v), 0 0 500px var(--p); z-index: -10; opacity: 0.25; filter: blur(100px); animation: orbit 20s infinite linear; }
        @keyframes orbit { from { rotate: 0deg; transform: translate(-50%, -50%) scale(1); } to { rotate: 360deg; transform: translate(-50%, -50%) scale(1.1); } }

        /* Navigation & Dock */
        .nav { position: fixed; top: 0; width: 100%; height: 90px; background: rgba(0,0,0,0.8); backdrop-filter: blur(40px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 60px 0 145px; z-index: 1000; }
        .logo { font-size: 32px; font-weight: 900; background: linear-gradient(to right, var(--p), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 7px; cursor: pointer; }

        .side-dock { position: fixed; left: 25px; top: 50%; transform: translateY(-50%); width: 85px; background: rgba(255,255,255,0.06); backdrop-filter: blur(50px); border: 1px solid var(--border); border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 45px 0; gap: 40px; z-index: 2000; }
        .side-dock i { font-size: 26px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .side-dock i:hover { color: var(--p); transform: scale(1.3); filter: drop-shadow(0 0 15px var(--p)); }

        /* Layout */
        .main { display: flex; max-width: 1400px; margin: 120px 20px 100px 145px; gap: 45px; }
        .feed { flex: 2; }
        .sidebar { flex: 1; position: sticky; top: 120px; height: fit-content; }

        /* UI Components */
        .card { background: var(--glass); border-radius: 40px; padding: 40px; margin-bottom: 35px; border: 1px solid var(--border); backdrop-filter: blur(60px); position: relative; }
        .card:hover { border-color: var(--p); }

        .sector-link { display: block; padding: 18px 25px; background: rgba(255,255,255,0.03); border-radius: 20px; color: #fff; text-decoration: none; font-weight: bold; margin-bottom: 15px; border: 1px solid transparent; }
        .sector-link:hover { background: var(--p); transform: translateX(15px); color: #fff; }
        .active-room { background: var(--v) !important; border-color: #fff !important; }

        textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 25px; color: #fff; padding: 25px; font-size: 19px; outline: none; resize: none; }
        .btn-transmit { background: #fff; color: #000; border: none; padding: 18px 50px; border-radius: 60px; font-weight: 900; cursor: pointer; font-size: 16px; }
        .btn-transmit:hover { background: var(--p); color: #fff; box-shadow: 0 0 40px var(--p); }

        .post-media { width: 100%; border-radius: 25px; margin-top: 20px; border: 1px solid var(--border); }
        .tag { background: var(--v); padding: 7px 18px; border-radius: 12px; font-size: 11px; font-weight: 800; margin-bottom: 15px; display: inline-block; }
    </style>
</head>
<body>
    <div class="void"></div>
    
    <div class="side-dock">
        <i class="fas fa-layer-group" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-bolt"></i>
        <div style="width:55px; height:55px; background:var(--p); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})"><i class="fas fa-plus" style="color:white;"></i></div>
        <i class="fas fa-globe-americas"></i>
        <i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);"></i>
    </div>

    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        <div style="font-weight:900; letter-spacing:2px; color:var(--p);">${activeSector === 'Global' ? 'UNIVERSE_FEED' : '#' + activeSector.toUpperCase()}</div>
    </nav>

    <div class="main">
        <div class="feed">
            <div class="card" style="border-left: 10px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <div style="margin-bottom:15px; font-weight:bold; opacity:0.7;">
                        <i class="fas fa-satellite"></i> BROADCASTING TO: <span style="color:var(--v);">#${activeSector}</span>
                    </div>
                    <textarea name="content" placeholder="Share your signal..." required></textarea>
                    <input type="hidden" name="sector" value="${activeSector === 'Global' ? 'General' : activeSector}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px;">
                        <label style="cursor:pointer; font-size:28px; color:var(--b);"><i class="fas fa-cloud-upload-alt"></i><input type="file" name="media" hidden></label>
                        <button class="btn-transmit">TRANSMIT</button>
                    </div>
                </form>
            </div>
            <div id="render-zone">${content}</div>
        </div>

        <div class="sidebar">
            <div class="card">
                <h3 style="color:var(--b); margin-bottom:25px;"><i class="fas fa-network-wired"></i> SECTORS</h3>
                <a href="/dashboard" class="sector-link ${activeSector === 'Global' ? 'active-room' : ''}">🌏 ALL_SIGNALS</a>
                ${sectors.map(s => `
                    <a href="/dashboard?sector=${s.name}" class="sector-link ${activeSector === s.name ? 'active-room' : ''}">
                        # ${s.name.toUpperCase()}
                    </a>
                `).join('')}
                <form action="/addsector" method="POST" style="margin-top:35px;">
                    <input name="sName" placeholder="Initialize New Sector..." required style="width:100%; padding:15px; border-radius:15px; background:#000; border:1px solid var(--border); color:#fff; margin-bottom:15px;">
                    <button class="btn-transmit" style="width:100%; background:var(--v); color:white; font-size:14px;">+ NEW SECTOR</button>
                </form>
            </div>
            <div class="card" style="text-align:center;">
                <p style="opacity:0.5; font-size:12px;">SYSTEM_ENCRYPTED_2026</p>
                <a href="mailto:xavirox.co@gmail.com" style="color:var(--p); text-decoration:none; font-weight:bold;">xavirox.co@gmail.com</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

// --- [INTERACTIVE LOGIN ENGINE] ---
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>XAVIROX | Portal</title>
        <style>
            body { background: #0a0108; color: white; display: flex; height: 100vh; margin: 0; font-family: 'Space Grotesk', sans-serif; overflow: hidden; }
            .side { flex: 1.2; background: #1a0515; display: flex; align-items: flex-end; justify-content: center; position: relative; border-right: 1px solid rgba(255,255,255,0.05); }
            .form { flex: 1; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(60px); background: rgba(0,0,0,0.4); }
            .char { font-size: 110px; position: absolute; transition: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); filter: drop-shadow(0 0 20px rgba(0,0,0,0.8)); }
            .shy { transform: translateY(280px) scale(0); opacity: 0; }
            .focus { transform: scale(1.3) translateY(-40px); filter: drop-shadow(0 0 30px #ff007f); }
            .box { width: 420px; padding: 65px; background: rgba(255,255,255,0.03); border-radius: 45px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
            input { width: 100%; padding: 22px; margin: 15px 0; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); background: #000; color: #fff; outline: none; font-size: 16px; }
            button { width: 100%; padding: 22px; border-radius: 60px; background: #ff007f; color: #fff; border: none; font-weight: 900; cursor: pointer; font-size: 18px; margin-top: 20px; }
            button:hover { box-shadow: 0 0 30px #ff007f; }
        </style>
    </head>
    <body>
        <div class="side">
            <div id="c" class="char" style="left:20%; bottom:15%;">🐱</div>
            <div id="p" class="char" style="right:20%; bottom:25%;">🦜</div>
        </div>
        <div class="form">
            <div class="box">
                <h1 style="font-size:35px; margin-bottom:10px;">Portal Sync</h1>
                <p style="opacity:0.5; margin-bottom:35px;">Neural authentication required.</p>
                <form action="/login" method="POST">
                    <input name="username" placeholder="Username" onfocus="watch()" required>
                    <input name="password" type="password" placeholder="Password" onfocus="hide()" required>
                    <button>INITIALIZE LINK</button>
                </form>
            </div>
        </div>
        <script>
            const cat = document.getElementById('c'), par = document.getElementById('p');
            function watch() { 
                cat.classList.remove('shy'); par.classList.remove('shy'); 
                cat.classList.add('focus'); cat.innerText = '😺'; par.innerText = '🧐';
            }
            function hide() { 
                cat.classList.add('shy'); par.classList.add('shy'); 
            }
        </script>
    </body>
    </html>
    `);
});

// --- [CORE LOGIC & MERGED ROUTES] ---

app.get('/dashboard', async (req, res) => {
    const sec = req.query.sector;
    const posts = await Post.find(sec ? { sector: sec } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    
    const html = posts.map(p => `
        <div class="card">
            <span class="tag"># ${p.sector.toUpperCase()}</span>
            <div style="font-weight:900; color:var(--p); margin-bottom:15px; font-size:18px;">@${p.author}</div>
            <p style="font-size:19px; line-height:1.7; opacity:0.9;">${p.content}</p>
            ${p.mediaUrl ? (p.mediaType && p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`) : ''}
        </div>
    `).join('');
    res.send(MASTER_UI(html, req.session.user, sectors, sec || 'Global'));
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ 
        author: req.session.user.username, content: req.body.content, 
        sector: req.body.sector, mediaUrl, mediaType: req.file ? req.file.mimetype : null 
    }).save();
    res.redirect(req.body.sector === 'General' ? '/dashboard' : '/dashboard?sector=' + req.body.sector);
});

app.post('/addsector', isAuth, async (req, res) => {
    try { 
        const name = req.body.sName.trim().replace(/\s+/g, '_');
        await new Sector({ name: name }).save(); 
    } catch(e){}
    res.redirect('/dashboard');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Neural Link Failed'); window.location='/login';</script>");
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><div style="background:#111; padding:50px; border-radius:40px; border:1px solid #333;"><h2>NEW_ENTITY</h2><form action="/signup" method="POST"><input name="username" placeholder="Username" required style="width:100%; padding:15px; margin:10px 0; border-radius:12px; background:#000; border:1px solid #333; color:#fff;"><input name="password" type="password" placeholder="Password" required style="width:100%; padding:15px; margin:10px 0; border-radius:12px; background:#000; border:1px solid #333; color:#fff;"><button style="width:100%; padding:15px; background:linear-gradient(to right, #ff007f, #7000ff); border:none; color:#fff; font-weight:bold; border-radius:50px; cursor:pointer; margin-top:20px;">CREATE ID</button></form></div></body>`);
});

app.post('/signup', async (req, res) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        await new User({ username: req.body.username.toLowerCase(), password: hashed }).save();
        res.redirect('/login');
    } catch(e) { res.send("Username Taken."); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

app.listen(3000, () => console.log('🚀 [XAVIROX OMNI-MERGE VER 24.0 LIVE]'));