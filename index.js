// ==========================================
// XAVIROX COSMIC CORE ENGINE - VER 7.0
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const app = express();

// --- 1. CORE CONFIGURATION & NEURAL LINK ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
.then(() => console.log('🌌 [COSMIC LOG]: NEURAL NETWORK STABILIZED'))
.catch(err => console.error('💥 [SYSTEM ERROR]: NEURAL COLLAPSE', err));

// --- 2. DATA ARCHITECTURE ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }]
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    mediaType: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// --- 3. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({
    secret: 'xavirox_nebula_ultra_2026_final_v7',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.send(`<script>alert('Vibe Check Failed! Login required.'); window.location='/login';</script>`);
};

// --- 4. THE SUPREME UI (BLACK HOLE & GLASSMORPHISM) ---
const MASTER_UI = (content, user) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>XAVIROX | Universe</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { 
            --p: #ff007f; --b: #007AFF; --v: #7000ff;
            --glass: rgba(255, 255, 255, 0.05);
            --border: rgba(255, 255, 255, 0.1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.4s ease; }
        body { background: #000; color: #fff; font-family: sans-serif; overflow-x: hidden; }

        /* 🌌 BACKGROUND SYSTEM */
        .black-hole {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 450px; height: 450px; background: #000; border-radius: 50%;
            box-shadow: 0 0 60px 20px #fff, 0 0 120px 40px var(--v), 0 0 200px 70px var(--p);
            z-index: -5; opacity: 0.3; filter: blur(50px); animation: pulse 8s infinite alternate;
        }
        @keyframes pulse { from { transform: translate(-50%, -50%) scale(1); opacity: 0.2; } to { transform: translate(-50%, -50%) scale(1.1); opacity: 0.4; } }

        .stars { 
            position: fixed; top: 0; width: 100%; height: 100%; 
            background: url('https://www.transparenttextures.com/patterns/stardust.png'); 
            opacity: 0.5; z-index: -4; animation: spin 250s linear infinite; 
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* 🚀 NAV & WRAPPER */
        .nav { 
            position: fixed; top: 0; width: 100%; height: 75px; 
            background: rgba(0,0,0,0.8); backdrop-filter: blur(30px);
            border-bottom: 1px solid var(--border); display: flex; align-items: center; 
            justify-content: space-between; padding: 0 40px; z-index: 1000; 
        }
        .logo { font-size: 26px; font-weight: 900; background: linear-gradient(to right, var(--p), #fff, var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 4px; cursor: pointer; }

        .main-wrapper { display: flex; max-width: 1200px; margin: 100px auto; padding: 0 20px 150px; gap: 30px; }
        .feed-container { flex: 2; }
        .sidebar-container { flex: 1; }

        /* 📦 GLASS CARDS */
        .card { 
            background: var(--glass); border-radius: 30px; padding: 25px; margin-bottom: 30px; 
            border: 1px solid var(--border); backdrop-filter: blur(25px);
        }
        .card:hover { border-color: var(--p); box-shadow: 0 0 30px var(--p); transform: translateY(-5px); }

        textarea { 
            width: 100%; background: rgba(0,0,0,0.4); border: 1px solid var(--border); 
            border-radius: 20px; color: white; padding: 20px; outline: none; resize: none; font-size: 16px;
        }

        .primary-btn { 
            background: white; color: black; border: none; padding: 14px 28px; 
            border-radius: 50px; font-weight: 900; cursor: pointer;
        }
        .primary-btn:hover { background: var(--p); color: white; transform: scale(1.05); }

        /* 🌐 SECTORS (COMMUNITIES) - RESTORED */
        .sector-tag { 
            background: rgba(255,255,255,0.05); color: var(--b); padding: 12px 18px; 
            border-radius: 15px; margin-bottom: 12px; border: 1px solid var(--border); 
            cursor: pointer; display: flex; align-items: center; gap: 10px;
        }
        .sector-tag:hover { background: var(--b); color: white; transform: translateX(10px); }

        .post-media { width: 100%; border-radius: 20px; margin-top: 20px; border: 1px solid var(--border); }

        /* ✉️ GMAIL FOOTER */
        .footer { 
            text-align: center; padding: 50px 20px; opacity: 0.6; font-size: 13px; 
            border-top: 1px solid var(--border); margin-top: 50px;
        }
        .footer a { color: var(--p); text-decoration: none; font-weight: bold; }

        /* 📱 TAB BAR */
        .tab-bar { 
            position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); 
            width: 90%; max-width: 450px; background: rgba(0,0,0,0.85); backdrop-filter: blur(40px);
            border-radius: 100px; display: flex; justify-content: space-around; padding: 20px; 
            border: 1px solid var(--border); z-index: 1000;
        }
        .tab-bar i { font-size: 24px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .tab-bar i:hover { color: var(--p); transform: translateY(-8px); }

        @media (max-width: 850px) { .main-wrapper { flex-direction: column; } .sidebar-container { order: 2; } }
    </style>
</head>
<body>
    <div class="black-hole"></div><div class="stars"></div>
    
    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        <div>
            ${user ? `<span style="font-size:12px; color:var(--b);">● @${user.username}</span>` : `<button onclick="location.href='/login'" class="primary-btn">GET IN</button>`}
        </div>
    </nav>

    <div class="main-wrapper">
        <div class="feed-container">
            ${user ? `
            <div class="card" style="border-top: 3px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" placeholder="Drop your vibe signal..." required></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                        <label style="cursor:pointer; font-size:22px;"><i class="fas fa-image"></i> <input type="file" name="media" hidden accept="image/*,video/*"></label>
                        <div style="display:flex; align-items:center; gap:8px; font-size:13px;">
                            <input type="checkbox" name="isAnonymous"> <span>Ghost Mode 👻</span>
                        </div>
                        <button type="submit" class="primary-btn" style="background:var(--p); color:white;">TRANSMIT</button>
                    </div>
                </form>
            </div>` : ''}
            <div id="feed-flow">${content}</div>
        </div>

        <div class="sidebar-container">
            <div class="card">
                <h4 style="color:var(--b); margin-bottom:15px;"><i class="fas fa-satellite"></i> SECTORS</h4>
                <div class="sector-tag"><i class="fas fa-bolt"></i> #Viral_Vibes</div>
                <div class="sector-tag"><i class="fas fa-user-secret"></i> #Shadow_Chat</div>
                <div class="sector-tag"><i class="fas fa-code"></i> #Xavi_Dev_Zone</div>
                <button class="primary-btn" style="width:100%; background:transparent; color:white; border:1px solid var(--border); font-size:11px;">+ CREATE SECTOR</button>
            </div>
            
            <div class="card">
                <h4><i class="fas fa-envelope-open-text"></i> DM XAVI</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Spill the tea..." style="height:70px;"></textarea>
                    <button class="primary-btn" style="width:100%; margin-top:10px;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>

    <footer class="footer">
        <p>XAVIROX COSMOS &copy; 2026 | ALL SIGNALS ENCRYPTED</p>
        <p style="margin-top:10px;">Content Removal / Support: <a href="mailto:xavirox.co@gmail.com">xavirox.co@gmail.com</a></p>
    </footer>

    <div class="tab-bar">
        <i class="fas fa-house" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fire"></i>
        <i class="fas fa-plus-circle" style="color:var(--p); font-size:35px;" onclick="window.scrollTo(0,0)"></i>
        <i class="fas fa-user-circle" onclick="alert('Profile Locked in Beta!')"></i>
        ${user ? `<i class="fas fa-power-off" onclick="location.href='/logout'"></i>` : `<i class="fas fa-key" onclick="location.href='/login'"></i>`}
    </div>
</body>
</html>`;

// --- 5. SERVER ROUTES & LOGIC ---

app.get('/dashboard', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const user = req.session.user ? await User.findById(req.session.user._id) : null;
    
    const postHTML = posts.map(p => {
        const isXavi = (p.author === 'xavi' || p.author === 'xavirox') && !p.isAnonymous;
        const name = p.isAnonymous ? 'Ghost_Entity' : p.author;
        let media = p.mediaUrl ? (p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`) : '';

        return `
        <div class="card">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                <div style="width:45px; height:45px; background:${p.isAnonymous ? '#111' : 'linear-gradient(45deg, var(--v), var(--p))'}; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                    ${name[0].toUpperCase()}
                </div>
                <div>
                    <div style="font-weight:900;">@${name} ${isXavi ? '<i class="fas fa-check-circle" style="color:var(--b);"></i>' : ''}</div>
                    <div style="font-size:10px; opacity:0.4;">${new Date(p.date).toLocaleString()}</div>
                </div>
            </div>
            <div style="font-size:17px; line-height:1.6;">${p.content}</div>
            ${media}
            <div style="margin-top:20px; display:flex; gap:30px; opacity:0.5;">
                <i class="far fa-heart"></i> <i class="far fa-comment-dots"></i> <i class="fas fa-share"></i>
            </div>
        </div>`;
    }).join('');
    res.send(MASTER_UI(postHTML, user));
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, isAnonymous: req.body.isAnonymous === 'on', mediaUrl, mediaType: req.file ? req.file.mimetype : null }).save();
    res.redirect('/dashboard');
});

// AUTH
app.post('/signup', async (req, res) => {
    const user = req.body.username.toLowerCase().trim();
    if(['xavi', 'admin'].includes(user)) return res.send("<script>alert('Reserved!'); window.location='/signup';</script>");
    const hashed = await bcrypt.hash(req.body.password, 10);
    await new User({ username: user, email: req.body.email.toLowerCase(), password: hashed }).save();
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) { req.session.user = user; res.redirect('/dashboard'); }
    else res.send("<script>alert('Wrong Key!'); window.location='/login';</script>");
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <div class="card" style="width:340px; text-align:center; padding:50px; border:1px solid var(--v);">
            <h2 style="color:var(--v);">GET IN</h2>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" required style="width:100%; padding:15px; margin:15px 0; border-radius:15px; background:rgba(255,255,255,0.05); border:none; color:white;">
                <input name="password" type="password" placeholder="Key" required style="width:100%; padding:15px; margin:15px 0; border-radius:15px; background:rgba(255,255,255,0.05); border:none; color:white;">
                <button style="width:100%; padding:15px; border-radius:50px; background:white; font-weight:bold;">AUTHORIZE</button>
            </form>
        </div>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <div class="card" style="width:340px; text-align:center; padding:50px; border:1px solid var(--p);">
            <h2 style="color:var(--p);">SYNC ENTITY</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Choose ID" required style="width:100%; padding:14px; margin:10px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white;">
                <input name="email" type="email" placeholder="Email" required style="width:100%; padding:14px; margin:10px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white;">
                <input name="password" type="password" placeholder="Key" required style="width:100%; padding:14px; margin:10px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white;">
                <button style="width:100%; padding:14px; border-radius:50px; background:var(--p); color:white;">SYNC</button>
            </form>
        </div>
    </body>`);
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } });
    res.send("<script>alert('Signal Sent!'); window.location='/dashboard';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🚀 XAVIROX SUPREME LIVE'));