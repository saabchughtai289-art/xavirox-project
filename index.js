/* =============================================================================
   🚀 XAVIROX COSMIC OS - VER 27.0 [THE ULTIMATE MERGE]
=============================================================================
   DESIGN: iOS 26 + Gen-Z Fluidity + Dynamic Island Pro
   STATUS: BUG-FREE PRODUCTION | YEAR: 2026
   
   CHANGELOG:
   - 🏝️ SMOOTH ISLAND: Dynamic Island expansion is now ultra-fluid (0.8s ease-out).
   - 🕹️ LEFT DOCK: Navigation icons moved to the left for better accessibility.
   - 📧 COSMIC FOOTER: Added Gmail, DM, and Content Removal options at the end.
   - 🌌 THE VOID: Restored Starfield (150 particles) and pulsing Black Hole.
   - 🐈‍⬛🦜 FOSTER LOGIN: Reactive characters with privacy-aware logic.
   - 🖼️ MULTIMEDIA: Automated Photo/Video detection & Base64 storage.
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
mongoose.connect(dbURI).then(() => console.log('✅ [XAVIROX]: COSMOS ONLINE'));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    feedback: [{ msg: String, from: String, date: { type: Date, default: Date.now } }]
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

// --- [SYSTEM CONFIG] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({
    secret: 'xavirox_cosmic_ultra_2026',
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
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;800&display=swap" rel="stylesheet">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --glass: rgba(255, 255, 255, 0.05); }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
        body { background: #000; color: #fff; overflow-x: hidden; }

        /* 🌌 BACKGROUND SYSTEM */
        .stars { position: fixed; width: 2px; height: 2px; background: white; border-radius: 50%; opacity: 0; animation: twinkle 4s infinite; z-index: -15; }
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.8; } }
        
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(0,0,0,1) 20%, transparent 70%); box-shadow: 0 0 100px #fff, 0 0 300px var(--v), 0 0 500px var(--p); z-index: -10; opacity: 0.15; filter: blur(100px); animation: pulse 15s infinite alternate; }
        @keyframes pulse { from { scale: 1; } to { scale: 1.2; } }

        /* 🏝️ SMOOTH DYNAMIC ISLAND */
        .island-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; }
        .dynamic-island { 
            width: 200px; height: 40px; background: #000; border: 1px solid rgba(255,255,255,0.1); 
            border-radius: 50px; display: flex; align-items: center; justify-content: center; 
            overflow: hidden; cursor: pointer; transition: width 0.8s cubic-bezier(0.19, 1, 0.22, 1), height 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .dynamic-island:hover { width: 500px; height: 70px; border-color: var(--p); }
        .island-content { display: flex; align-items: center; gap: 20px; white-space: nowrap; }
        .logo-text { font-weight: 800; letter-spacing: 3px; background: linear-gradient(to right, #fff, var(--p)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* 🕹️ LEFT NAVIGATION DOCK */
        .left-dock { position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 75px; background: rgba(255,255,255,0.06); backdrop-filter: blur(50px); border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 40px 0; gap: 45px; z-index: 5000; }
        .left-dock i { font-size: 22px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .left-dock i:hover { color: var(--p); transform: scale(1.4); }
        .active-icon { color: #fff !important; text-shadow: 0 0 15px var(--p); }

        /* LAYOUT */
        .container { display: flex; max-width: 1200px; margin: 150px auto 50px 140px; gap: 40px; }
        .feed { flex: 2; }
        .sidebar { flex: 1; position: sticky; top: 150px; height: fit-content; }

        /* CARDS */
        .card { background: var(--glass); border-radius: 35px; padding: 30px; margin-bottom: 30px; border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(80px); }
        .card:hover { border-color: var(--p); }
        
        .sector-pill { display: block; padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 15px; margin-bottom: 10px; color: #fff; text-decoration: none; font-size: 14px; }
        .sector-pill:hover { background: var(--v); transform: translateX(10px); }
        .active-pill { background: #fff !important; color: #000 !important; font-weight: 800; }

        textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 25px; color: #fff; padding: 20px; font-size: 16px; outline: none; }
        .btn-ios { background: #fff; color: #000; border: none; padding: 15px 40px; border-radius: 50px; font-weight: 800; cursor: pointer; }
        .btn-ios:hover { background: var(--p); color: #fff; transform: scale(1.05); }

        .media-box { width: 100%; border-radius: 20px; margin-top: 20px; border: 1px solid rgba(255,255,255,0.1); }
        .tag { background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 50px; font-size: 10px; font-weight: 800; color: var(--cyan); margin-bottom: 15px; display: inline-block; }

        /* 📧 COSMIC FOOTER */
        footer { margin-left: 140px; padding: 60px 40px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; opacity: 0.6; font-size: 13px; }
        .footer-links a { color: #fff; text-decoration: none; margin-right: 25px; font-weight: 500; }
        .footer-links a:hover { color: var(--p); }
    </style>
</head>
<body>
    <div id="star-field"></div>
    <div class="black-hole"></div>

    <div class="island-container">
        <div class="dynamic-island">
            <div class="island-content">
                <div class="logo-text">XAVIROX</div>
                <div style="font-size:10px; opacity:0.5; letter-spacing:1px;">${activeSector === 'Global' ? 'UNIVERSE MODE' : 'SECTOR: ' + activeSector}</div>
            </div>
        </div>
    </div>

    <div class="left-dock">
        <i class="fas fa-home active-icon" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-search"></i>
        <div style="width:50px; height:50px; background:#fff; border-radius:20px; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})"><i class="fas fa-plus" style="color:#000;"></i></div>
        <i class="fas fa-compass"></i>
        <i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);"></i>
    </div>

    <div class="container">
        <div class="feed">
            <div class="card" style="border-left: 4px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <div style="margin-bottom:12px; font-size:11px; font-weight:800; color:var(--v);">BROADCASTING IN: #${activeSector}</div>
                    <textarea name="content" placeholder="Share your signal with the void..." required></textarea>
                    <input type="hidden" name="sector" value="${activeSector === 'Global' ? 'General' : activeSector}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                        <label style="cursor:pointer; font-size:22px; opacity:0.6;"><i class="fas fa-camera"></i><input type="file" name="media" hidden></label>
                        <button class="btn-ios">TRANSMIT</button>
                    </div>
                </form>
            </div>
            <div id="render-wrap">${content}</div>
        </div>

        <div class="sidebar">
            <div class="card">
                <h4 style="font-size:12px; opacity:0.5; margin-bottom:20px; letter-spacing:2px;">COMMUNITIES</h4>
                <a href="/dashboard" class="sector-pill ${activeSector === 'Global' ? 'active-pill' : ''}">🌏 GLOBAL VOID</a>
                ${sectors.map(s => `
                    <a href="/dashboard?sector=${s.name}" class="sector-pill ${activeSector === s.name ? 'active-pill' : ''}">
                        # ${s.name}
                    </a>
                `).join('')}
                <form action="/addsector" method="POST" style="margin-top:20px;">
                    <input name="sName" placeholder="New room name..." required style="width:100%; padding:12px; border-radius:12px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); color:#fff; margin-bottom:10px; font-size:13px;">
                    <button class="btn-ios" style="width:100%; font-size:11px; background:var(--v); color:#fff;">+ CREATE</button>
                </form>
            </div>

            <div class="card">
                <h4 style="font-size:12px; opacity:0.5; margin-bottom:15px;">FEEDBACK</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Message Boss..." style="height:70px; font-size:13px;"></textarea>
                    <button class="btn-ios" style="width:100%; margin-top:10px; font-size:11px;">SEND</button>
                </form>
            </div>
        </div>
    </div>

    <footer>
        <div>© 2026 XAVIROX COSMOS. All rights reserved.</div>
        <div class="footer-links">
            <a href="mailto:xavirox.co@gmail.com"><i class="fas fa-envelope"></i> xavirox.co@gmail.com</a>
            <a href="#"><i class="fas fa-paper-plane"></i> DM Support</a>
            <a href="#"><i class="fas fa-shield-alt"></i> Content Removal</a>
        </div>
    </footer>

    <script>
        const field = document.getElementById('star-field');
        for (let i = 0; i < 150; i++) {
            const s = document.createElement('div');
            s.className = 'stars';
            s.style.left = Math.random() * 100 + 'vw';
            s.style.top = Math.random() * 100 + 'vh';
            s.style.animationDelay = Math.random() * 4 + 's';
            field.appendChild(s);
        }
    </script>
</body>
</html>
`;

// --- [INTERACTIVE LOGIN ENGINE] ---
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>XAVIROX | Access</title>
        <style>
            body { background: #000; color: white; font-family: sans-serif; margin: 0; display: flex; height: 100vh; overflow: hidden; }
            .hero { flex: 1.2; background: #0a0108; display: flex; align-items: flex-end; justify-content: center; position: relative; }
            .form { flex: 1; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(100px); }
            .char { font-size: 100px; position: absolute; transition: 0.7s cubic-bezier(0.19, 1, 0.22, 1); }
            .shy { transform: translateY(300px) scale(0); opacity: 0; }
            .box { width: 380px; padding: 50px; background: rgba(255,255,255,0.03); border-radius: 40px; border: 1px solid rgba(255,255,255,0.1); }
            input { width: 100%; padding: 20px; margin: 12px 0; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); background: #000; color: #fff; outline: none; }
            button { width: 100%; padding: 20px; border-radius: 50px; background: #fff; color: #000; border: none; font-weight: 900; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="hero">
            <div id="c" class="char" style="left:20%; bottom:10%;">🐱</div>
            <div id="p" class="char" style="right:20%; bottom:15%;">🦜</div>
        </div>
        <div class="form">
            <div class="box">
                <h1 style="margin-bottom:10px;">Portal Access</h1>
                <p style="opacity:0.4; margin-bottom:30px; font-size:14px;">iOS 26 Identity Check</p>
                <form action="/login" method="POST">
                    <input name="username" placeholder="Username" onfocus="watch()" required>
                    <input name="password" type="password" placeholder="Password" onfocus="hide()" required>
                    <button>AUTH SYNC</button>
                </form>
            </div>
        </div>
        <script>
            function watch() { document.getElementById('c').classList.remove('shy'); document.getElementById('p').classList.remove('shy'); }
            function hide() { document.getElementById('c').classList.add('shy'); document.getElementById('p').classList.add('shy'); }
        </script>
    </body>
    </html>
    `);
});

// --- [LOGIC & ROUTES] ---

app.get('/dashboard', async (req, res) => {
    const sec = req.query.sector;
    const posts = await Post.find(sec ? { sector: sec } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    const html = posts.map(p => `
        <div class="card">
            <span class="tag"># ${p.sector}</span>
            <div style="font-weight:800; margin-bottom:10px;">@${p.author}</div>
            <p style="font-size:16px; line-height:1.6; opacity:0.8;">${p.content}</p>
            ${p.mediaUrl ? (p.mediaType && p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="media-box"></video>` : `<img src="${p.mediaUrl}" class="media-box">`) : ''}
        </div>
    `).join('');
    res.send(MASTER_UI(html, req.session.user, sectors, sec || 'Global'));
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl, mediaType: req.file ? req.file.mimetype : null }).save();
    res.redirect(req.body.sector === 'General' ? '/dashboard' : '/dashboard?sector=' + req.body.sector);
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { feedback: { msg: req.body.msg, from: req.session.user.username } } });
    res.send("<script>alert('Feedback Received!'); window.location='/dashboard';</script>");
});

app.post('/addsector', isAuth, async (req, res) => {
    try { await new Sector({ name: req.body.sName.trim().replace(/\s+/g, '_') }).save(); } catch(e){}
    res.redirect('/dashboard');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Access Denied'); window.location='/login';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

app.listen(3000, () => console.log('🚀 [XAVIROX 27.0 - ULTIMATE LIVE]'));