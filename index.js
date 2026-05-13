/* =============================================================================
   🚀 XAVIROX COSMIC OPERATING SYSTEM - VER 19.0 (THE FINAL GLASS MERGE)
=============================================================================
   AUTHOR: XAVIROX DEV TEAM (LEAD BY BOSS)
   YEAR: 2026 | STATUS: MAX AURA | THEME: GLASSMORPHISM & COSMIC VOID
   
   CHANGELOG & FEATURES:
   - 🌌 Restored: Black Hole & Stardust Background Engine.
   - 💎 Restored: Ultra-Glass Transparency (Backdrop-filter: blur(50px)).
   - 🐱🦜 Interactive Characters: Cat & Parrot reacting to input fields.
   - 🛰️ Communities: Sector creation and post-filtering system.
   - 💬 Feedback: Admin communication bar restored in sidebar.
   - 📧 Support: Gmail link added to a glass-styled footer.
   - 🎭 Ghost Mode: Anonymous posting with Base64 media support.
   - 🛡️ Stability: Fixed /dashboard routing and logout bugs.
=============================================================================
*/

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// --- [SECTION 1: DATABASE & NEURAL SCHEMAS] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log('🌌 [XAVIROX]: DATABASE NEURAL LINK SYNCED'))
    .catch(err => console.log('💥 [SYSTEM ERROR]:', err));

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
    sector: { type: String, default: 'General' },
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdBy: String
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Sector = mongoose.model('Sector', SectorSchema);

// --- [SECTION 2: INFRASTRUCTURE CONFIG] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' })); 

app.use(session({
    secret: 'xavirox_master_glass_void_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const upload = multer({ storage: multer.memoryStorage() });

const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.send(`<script>alert('Aura Check Required!'); window.location='/login';</script>`);
};

// --- [SECTION 3: THE SUPREME GLASS UI ENGINE] ---
const MASTER_UI = (content, user, sectors) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | Cosmic Void</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        :root { 
            --p: #ff007f; --b: #007AFF; --v: #7000ff; 
            --glass: rgba(255, 255, 255, 0.03); 
            --border: rgba(255, 255, 255, 0.1); 
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        body { background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; min-height: 100vh; }

        /* --- [BACKGROUND ENGINE RESTORED] --- */
        .black-hole { 
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            width: 600px; height: 600px; background: #000; border-radius: 50%; 
            box-shadow: 0 0 100px #fff, 0 0 200px var(--v), 0 0 400px var(--p); 
            z-index: -10; opacity: 0.35; filter: blur(80px); animation: pulse 15s infinite alternate;
        }
        .stardust { 
            position: fixed; top: 0; width: 100%; height: 100%; 
            background: url('https://www.transparenttextures.com/patterns/stardust.png'); 
            opacity: 0.3; z-index: -9; 
        }
        @keyframes pulse { from { transform: translate(-50%, -50%) scale(1); } to { transform: translate(-50%, -50%) scale(1.15); } }

        /* --- [GLASS DOCK RESTORED] --- */
        .side-dock { 
            position: fixed; left: 25px; top: 50%; transform: translateY(-50%); 
            width: 80px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(50px); 
            border: 1px solid var(--border); border-radius: 100px; 
            display: flex; flex-direction: column; align-items: center; padding: 45px 0; gap: 50px; z-index: 2000; 
        }
        .side-dock i { font-size: 26px; color: rgba(255,255,255,0.4); cursor: pointer; }
        .side-dock i:hover { color: var(--p); transform: scale(1.3); filter: drop-shadow(0 0 10px var(--p)); }

        .nav { 
            position: fixed; top: 0; width: 100%; height: 90px; 
            background: rgba(0,0,0,0.8); backdrop-filter: blur(30px); 
            border-bottom: 1px solid var(--border); display: flex; align-items: center; 
            justify-content: space-between; padding: 0 60px 0 140px; z-index: 1000; 
        }
        .logo { font-size: 30px; font-weight: 900; background: linear-gradient(to right, var(--p), #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 6px; cursor: pointer; }

        /* --- [LAYOUT CONFIG] --- */
        .wrapper { display: flex; max-width: 1350px; margin: 120px 20px 150px 140px; gap: 40px; }
        .feed { flex: 2; }
        .sidebar { flex: 1; position: sticky; top: 120px; height: fit-content; }

        /* --- [GLASS COMPONENTS] --- */
        .card { 
            background: var(--glass); border-radius: 35px; padding: 35px; margin-bottom: 40px; 
            border: 1px solid var(--border); backdrop-filter: blur(45px); -webkit-backdrop-filter: blur(45px);
        }
        .card:hover { border-color: var(--p); box-shadow: 0 15px 50px rgba(255, 0, 127, 0.15); }

        textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 25px; color: #fff; padding: 25px; font-size: 18px; outline: none; }
        .primary-btn { background: #fff; color: #000; border: none; padding: 18px 40px; border-radius: 60px; font-weight: 900; cursor: pointer; }
        .primary-btn:hover { background: var(--p); color: #fff; box-shadow: 0 0 30px var(--p); }

        .post-media { width: 100%; border-radius: 30px; margin-top: 25px; border: 1px solid var(--border); }
        .tag { background: var(--v); padding: 6px 15px; border-radius: 12px; font-size: 12px; display: inline-block; margin-bottom: 15px; }

        .footer { text-align: center; padding: 60px; border-top: 1px solid var(--border); margin-left: 140px; background: rgba(0,0,0,0.5); backdrop-filter: blur(20px); }
        .gmail-link { color: var(--p); text-decoration: none; font-weight: bold; font-size: 18px; margin-top: 15px; display: inline-block; }

        @media (max-width: 950px) {
            .wrapper { margin: 100px 15px; flex-direction: column; }
            .side-dock { bottom: 20px; top: auto; left: 50%; transform: translateX(-50%); flex-direction: row; width: 92%; height: 75px; padding: 0 30px; }
            .footer { margin-left: 0; }
        }
    </style>
</head>
<body>
    <div class="black-hole"></div>
    <div class="stardust"></div>
    
    <div class="side-dock">
        <i class="fas fa-home" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fire"></i>
        <div style="width:55px; height:55px; background:var(--p); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})"><i class="fas fa-plus" style="color:white;"></i></div>
        <i class="fas fa-users"></i>
        ${user ? `<i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);"></i>` : `<i class="fas fa-key" onclick="location.href='/login'"></i>`}
    </div>

    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        <div style="font-weight:bold;">${user ? '@'+user.username : 'GUEST_ENTITY'}</div>
    </nav>

    <div class="wrapper">
        <div class="feed">
            <div class="card" style="border-left: 8px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" id="void-input" placeholder="Type something unhinged..." ${user ? '' : 'disabled'}></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px;">
                        <div style="display:flex; gap:25px; align-items:center;">
                            <label style="cursor:pointer; font-size:28px; color:var(--b);">
                                <i class="fas fa-image"></i>
                                <input type="file" name="media" hidden accept="image/*,video/*">
                            </label>
                            <select name="sector" style="background:#000; color:#fff; border:1px solid var(--border); padding:10px; border-radius:12px;">
                                <option value="General">General Sector</option>
                                ${sectors.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                            </select>
                        </div>
                        <div style="display:flex; align-items:center; gap:15px;">
                            <input type="checkbox" name="isAnonymous" id="gh" style="width:20px; height:20px; accent-color:var(--p);">
                            <label for="gh" style="font-weight:bold;">GHOST</label>
                            <button class="primary-btn">TRANSMIT</button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="void-feed">${content}</div>
        </div>

        <div class="sidebar">
            <div class="card">
                <h3 style="margin-bottom:20px; color:var(--b);"><i class="fas fa-globe"></i> ACTIVE SECTORS</h3>
                ${sectors.map(s => `<div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:15px; margin-bottom:12px;"># ${s.name}</div>`).join('')}
                <form action="/addsector" method="POST" style="margin-top:20px;">
                    <input name="sName" placeholder="Create Community..." required style="width:100%; padding:15px; border-radius:15px; background:#000; border:1px solid var(--border); color:#fff; margin-bottom:12px;">
                    <button class="primary-btn" style="width:100%; background:var(--v); color:white;">ADD SECTOR</button>
                </form>
            </div>

            <div class="card" style="border-top: 1px solid var(--p);">
                <h3 style="margin-bottom:20px;"><i class="fas fa-comment-dots"></i> FEEDBACK</h3>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Message Xavi..." style="height:100px; font-size:15px;"></textarea>
                    <button class="primary-btn" style="width:100%; margin-top:20px;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>

    <footer class="footer">
        <p>XAVIROX COSMOS &copy; 2026 | ALL SIGNALS ENCRYPTED</p>
        <a href="mailto:xavirox.co@gmail.com" class="gmail-link"><i class="fas fa-envelope-open-text"></i> xavirox.co@gmail.com</a>
    </footer>
    <script>
        const lines = ["certified yap zone", "drop lore immediately", "bro is thinking...", "type before the cringe hits"];
        const el = document.getElementById('void-input');
        if(el) el.placeholder = lines[Math.floor(Math.random()*lines.length)];
    </script>
</body>
</html>
`;

// --- [SECTION 4: INTERACTIVE VIDEO-STYLE LOGIN] ---
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>XAVIROX | Access</title>
        <style>
            body { background: #1a0518; color: white; font-family: sans-serif; margin: 0; display: flex; height: 100vh; overflow: hidden; }
            .char-side { flex: 1.2; background: #2d0a28; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 80px; position: relative; }
            .form-side { flex: 1; background: rgba(0,0,0,0.4); backdrop-filter: blur(50px); display: flex; align-items: center; justify-content: center; border-left: 1px solid rgba(255,255,255,0.1); }
            
            .character { font-size: 100px; transition: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: absolute; }
            .cat { left: 20%; bottom: 15%; }
            .parrot { right: 20%; bottom: 25%; }
            
            .hide { transform: translateY(100px) scale(0); opacity: 0; }
            .focus { transform: scale(1.3) translateY(-30px); filter: drop-shadow(0 0 20px #ff007f); }

            .box { width: 400px; padding: 60px; border-radius: 40px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(30px); }
            input { width: 100%; padding: 20px; margin: 15px 0; border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.5); color: white; outline: none; }
            button { width: 100%; padding: 20px; border-radius: 50px; background: #ff007f; color: white; border: none; font-weight: bold; cursor: pointer; margin-top: 20px; box-shadow: 0 10px 30px rgba(255,0,127,0.3); }
        </style>
    </head>
    <body>
        <div class="char-side">
            <div id="c" class="character cat">🐱</div>
            <div id="p" class="character parrot">🦜</div>
            <h1 style="position:absolute; top:50px; opacity:0.05; font-size:100px;">VOID ACCESS</h1>
        </div>
        <div class="form-side">
            <div class="box">
                <h2 style="font-size:35px; margin-bottom:10px;">Welcome Back</h2>
                <p style="opacity:0.5; margin-bottom:35px;">Neural sync required</p>
                <form action="/login" method="POST">
                    <input name="username" placeholder="Username" onfocus="watch()" required>
                    <input name="password" type="password" placeholder="Password" onfocus="hide()" required>
                    <button>INITIALIZE</button>
                </form>
            </div>
        </div>
        <script>
            const cat = document.getElementById('c');
            const parrot = document.getElementById('p');
            function watch() { cat.classList.remove('hide'); parrot.classList.remove('hide'); cat.classList.add('focus'); cat.innerText = '😺'; parrot.innerText = '🧐'; }
            function hide() { cat.classList.add('hide'); parrot.classList.add('hide'); }
        </script>
    </body>
    </html>
    `);
});

// --- [SECTION 5: SERVER LOGIC & ROUTES] ---

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
                    <div style="width:50px; height:50px; background:linear-gradient(45deg, var(--v), var(--p)); border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                        ${(p.isAnonymous ? 'G' : p.author)[0].toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight:bold; color:var(--p);">@${p.isAnonymous ? 'Ghost_Entity' : p.author}</div>
                        <div style="font-size:11px; opacity:0.4;">${new Date(p.date).toLocaleString()}</div>
                    </div>
                </div>
                <p style="font-size:19px; line-height:1.7;">${p.content}</p>
                ${p.mediaUrl ? (p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`) : ''}
            </div>
        `).join('');

        res.send(MASTER_UI(html, user, sectors));
    } catch (e) { res.status(500).send("Cosmic Failure."); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Auth Mismatch!'); window.location='/login';</script>");
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ 
        author: req.session.user.username, 
        content: req.body.content, 
        sector: req.body.sector, 
        mediaUrl, 
        mediaType: req.file ? req.file.mimetype : null,
        isAnonymous: req.body.isAnonymous === 'on'
    }).save();
    res.redirect('/dashboard');
});

app.post('/addsector', isAuth, async (req, res) => {
    try { await new Sector({ name: req.body.sName.trim(), createdBy: req.session.user.username }).save(); } catch(e){}
    res.redirect('/dashboard');
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } });
    res.send("<script>alert('Signal Transmitted to Xavi!'); window.location='/dashboard';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🚀 [SYSTEM LIVE]: PORT ' + PORT));