// ==========================================
// XAVIROX COSMIC CORE ENGINE - VER 10.0 (ULTIMATE MERGE)
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const app = express();

// --- 1. CORE DATABASE CONNECTION (NEURAL LINK) ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => {
        console.log('🌌 [COSMIC LOG]: DATABASE SYNCED SUCCESSFULLY');
        console.log('🌌 [STATUS]: ALL SYSTEMS OPERATIONAL');
    })
    .catch(err => {
        console.error('💥 [CRITICAL ERROR]: NEURAL COLLAPSE - DB CONNECTION FAILED');
        console.error(err);
    });

// --- 2. DATA ARCHITECTURE (SCHEMAS) ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    adminMessages: [{
        from: String,
        text: String,
        at: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    mediaType: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
    votes: { type: Number, default: 0 },
    votedBy: [String],
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// --- 3. INFRASTRUCTURE MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' })); // Large payload for media
app.use(session({
    secret: 'xavirox_nebula_supreme_2026_final_merge_unlimited_power',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 24 Hours
        secure: false 
    }
}));

// Multer Engine for Image & Video Uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB Max for Videos
});

// Authentication Guard
const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.send(`
        <script>
            alert('Vibe Check Failed: Neural ID required!');
            window.location='/login';
        </script>
    `);
};

// --- 4. THE SUPREME UI (VERTICAL DOCK & COSMOS DESIGN) ---
const MASTER_UI = (content, user) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>XAVIROX | Event Horizon</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        :root { 
            --p: #ff007f; /* Neon Pink */
            --b: #007AFF; /* Cyber Blue */
            --v: #7000ff; /* Deep Violet */
            --glass: rgba(255, 255, 255, 0.04);
            --border: rgba(255, 255, 255, 0.12);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        body { background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; min-height: 100vh; }

        /* 🌌 BACKGROUND SYSTEM */
        .black-hole {
            position: fixed; top: 50%; left: 65%; transform: translate(-50%, -50%);
            width: 500px; height: 500px; background: #000; border-radius: 50%;
            box-shadow: 0 0 60px 20px #fff, 0 0 140px 60px var(--v), 0 0 240px 90px var(--p);
            z-index: -5; opacity: 0.35; filter: blur(60px); animation: blackHolePulse 12s infinite alternate ease-in-out;
        }

        @keyframes blackHolePulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
            100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
        }

        .stars-container { 
            position: fixed; top: 0; width: 100%; height: 100%; 
            background: url('https://www.transparenttextures.com/patterns/stardust.png'); 
            opacity: 0.4; z-index: -4; animation: celestialSpin 400s linear infinite; 
        }

        @keyframes celestialSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* 🚀 LEFT SIDE DOCK (SIDEBAR) */
        .side-dock { 
            position: fixed; left: 25px; top: 50%; transform: translateY(-50%); 
            width: 75px; background: rgba(255, 255, 255, 0.05); 
            backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px);
            border: 1px solid var(--border); border-radius: 100px; 
            display: flex; flex-direction: column; align-items: center; 
            padding: 40px 0; gap: 45px; z-index: 2000;
            box-shadow: 0 0 40px rgba(0,0,0,0.8);
        }

        .side-dock i { font-size: 24px; color: rgba(255,255,255,0.4); cursor: pointer; }
        .side-dock i:hover { color: var(--p); transform: scale(1.3) translateX(5px); filter: drop-shadow(0 0 10px var(--p)); }
        
        .add-btn { 
            width: 50px; height: 50px; background: var(--p); border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; 
            color: white; font-size: 22px; box-shadow: 0 0 20px var(--p);
            cursor: pointer;
        }
        .add-btn:hover { transform: rotate(90deg) scale(1.1); }

        /* 🚀 NAVIGATION */
        .nav { 
            position: fixed; top: 0; width: 100%; height: 85px; 
            background: rgba(0,0,0,0.7); backdrop-filter: blur(35px);
            border-bottom: 1px solid var(--border); display: flex; align-items: center; 
            justify-content: space-between; padding: 0 50px 0 130px; z-index: 1000; 
        }
        .logo { font-size: 28px; font-weight: 900; background: linear-gradient(to right, var(--p), #fff, var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 6px; text-transform: uppercase; cursor: pointer; }

        /* 📦 CONTENT LAYOUT */
        .main-wrapper { display: flex; max-width: 1250px; margin: 110px 0 150px 130px; padding-right: 40px; gap: 40px; }
        .feed-container { flex: 2; min-width: 0; }
        .sidebar-container { flex: 1; }

        .card { 
            background: var(--glass); border-radius: 35px; padding: 30px; margin-bottom: 35px; 
            border: 1px solid var(--border); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
        }
        .card:hover { border-color: var(--p); box-shadow: 0 0 50px rgba(255, 0, 127, 0.25); transform: translateY(-8px); }

        textarea { 
            width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); 
            border-radius: 25px; color: white; padding: 22px; outline: none; resize: none; font-size: 17px;
        }

        .primary-btn { 
            background: white; color: black; border: none; padding: 16px 35px; 
            border-radius: 60px; font-weight: 900; cursor: pointer; letter-spacing: 1px;
        }
        .primary-btn:hover { background: var(--p); color: white; box-shadow: 0 0 25px var(--p); transform: scale(1.05); }

        .sector-tag { 
            background: rgba(255,255,255,0.06); color: var(--b); padding: 15px; 
            border-radius: 20px; margin-bottom: 12px; border: 1px solid var(--border); 
            cursor: pointer; display: flex; align-items: center; gap: 15px; font-weight: bold;
        }
        .sector-tag:hover { background: var(--b); color: white; transform: translateX(15px); }

        .post-media { width: 100%; border-radius: 25px; margin-top: 25px; border: 1px solid var(--border); box-shadow: 0 15px 45px rgba(0,0,0,0.7); }

        /* ✉️ FOOTER GMAIL SECTION */
        .footer { 
            text-align: center; padding: 70px 20px; opacity: 0.6; font-size: 13px; 
            border-top: 1px solid var(--border); margin-left: 130px;
        }
        .footer a { color: var(--p); text-decoration: none; font-weight: bold; border-bottom: 1px solid transparent; }
        .footer a:hover { border-bottom: 1px solid var(--p); }

        /* MOBILE FIXES */
        @media (max-width: 900px) {
            .main-wrapper { margin: 100px 20px 150px; flex-direction: column; padding-right: 0; }
            .side-dock { 
                left: 50%; top: auto; bottom: 25px; transform: translateX(-50%); 
                flex-direction: row; width: 92%; height: 75px; padding: 0 25px; 
            }
            .nav { padding: 0 25px; height: 75px; justify-content: center; }
            .nav div:last-child { display: none; }
            .footer { margin-left: 0; }
        }
    </style>
</head>
<body>
    <div class="black-hole"></div>
    <div class="stars-container"></div>
    
    <div class="side-dock">
        <i class="fas fa-home" onclick="location.href='/dashboard'" title="Home"></i>
        <i class="fas fa-fire-alt" title="Trending"></i>
        <div class="add-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="New Signal">
            <i class="fas fa-plus"></i>
        </div>
        <i class="fas fa-user-astronaut" onclick="alert('Neural Profile coming in V11')" title="Profile"></i>
        ${user ? `<i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);" title="Disconnect"></i>` 
               : `<i class="fas fa-key" onclick="location.href='/login'" title="Login"></i>`}
    </div>

    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        <div style="display: flex; align-items: center; gap: 15px;">
            ${user ? `<div style="font-size: 13px; font-weight: bold; color: var(--b);"><i class="fas fa-circle" style="font-size:8px; margin-right:5px;"></i> @${user.username}</div>` : ''}
        </div>
    </nav>

    <div class="main-wrapper">
        <div class="feed-container">
            ${user ? `
            <div class="card" style="border-left: 6px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" id="genz-input" placeholder="Waking up the matrix..." required></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px;">
                        <label style="cursor:pointer; font-size:26px; color: var(--b);" title="Upload Media">
                            <i class="fas fa-cloud-upload-alt"></i> 
                            <input type="file" name="media" hidden accept="image/*,video/*">
                        </label>
                        <div style="display:flex; align-items:center; gap:12px; font-size:14px; font-weight: bold; opacity: 0.8;">
                            <input type="checkbox" name="isAnonymous" id="anon" style="width: 18px; height: 18px; accent-color: var(--p);"> 
                            <label for="anon">Ghost Mode 👻</label>
                        </div>
                        <button type="submit" class="primary-btn" style="background:var(--p); color:white;">TRANSMIT</button>
                    </div>
                </form>
            </div>` : ''}
            
            <div id="feed-flow">
                ${content || '<div class="card" style="text-align:center; opacity: 0.5;">🌌 The Void is silent. Be the first to speak.</div>'}
            </div>
        </div>

        <div class="sidebar-container">
            <div class="card">
                <h4 style="color:var(--b); margin-bottom: 20px; font-weight: 900; letter-spacing: 1px;"><i class="fas fa-satellite-dish"></i> ACTIVE SECTORS</h4>
                <div class="sector-tag">#Viral_Bangers</div>
                <div class="sector-tag">#No_Cap_Energy</div>
                <div class="sector-tag">#Xavi_Official</div>
                <button class="primary-btn" style="width:100%; background:transparent; color:white; border:1px solid var(--border); margin-top:10px; font-size: 11px;">+ NEW HUB</button>
            </div>
            
            <div class="card" style="border-top: 1px solid var(--p);">
                <h4 style="margin-bottom: 15px;"><i class="fas fa-user-secret"></i> FEEDBACK SIGNAL</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Tell Xavi your thoughts..." style="height:90px; font-size: 14px;"></textarea>
                    <button class="primary-btn" style="width:100%; margin-top:15px; background: white; color: black;">SEND TO XAVI</button>
                </form>
            </div>
        </div>
    </div>

    <footer class="footer">
        <p>XAVIROX CORE SYSTEMS &copy; 2026 | ALL RIGHTS RESERVED</p>
        <p style="margin-top: 15px;">Safety & Content Removal (DMCA): <a href="mailto:xavirox.co@gmail.com">xavirox.co@gmail.com</a></p>
        <p style="margin-top: 10px; opacity: 0.4;">Build: Horizon_v10_Stable</p>
    </footer>

    <script>
        const genzQuotes = [
            "What's the tea today, no cap?",
            "Drop your main character moment...",
            "Valid or nah? Speak your truth.",
            "Waking up the matrix with this signal...",
            "Spilling the tea in 3, 2, 1...",
            "Sending a vibe check to the void..."
        ];
        const input = document.getElementById('genz-input');
        if(input) {
            input.placeholder = genzQuotes[Math.floor(Math.random() * genzQuotes.length)];
        }
    </script>
</body>
</html>`;

// --- 5. SERVER ROUTES & LOGIC ---

// [DASHBOARD]
app.get('/dashboard', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        const user = req.session.user ? await User.findById(req.session.user._id) : null;
        
        const postHTML = posts.map(p => {
            const isXavi = (p.author === 'xavi' || p.author === 'xavirox') && !p.isAnonymous;
            const displayName = p.isAnonymous ? 'Ghost_Entity' : p.author;
            
            let mediaContent = '';
            if (p.mediaUrl) {
                if (p.mediaType && p.mediaType.includes('video')) {
                    mediaContent = `<video src="${p.mediaUrl}" controls class="post-media"></video>`;
                } else {
                    mediaContent = `<img src="${p.mediaUrl}" class="post-media" loading="lazy">`;
                }
            }

            return `
            <div class="card">
                <div style="display:flex; align-items:center; gap:18px; margin-bottom:20px;">
                    <div style="width:50px; height:50px; background:${p.isAnonymous ? '#111' : 'linear-gradient(135deg, var(--v), var(--p))'}; border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size: 18px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                        ${displayName[0].toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight:900; font-size: 16px;">@${displayName} ${isXavi ? '<i class="fas fa-certificate" style="color:var(--b); margin-left:5px;"></i>' : ''}</div>
                        <div style="font-size:11px; opacity:0.4;">${new Date(p.date).toLocaleString()}</div>
                    </div>
                </div>
                <div style="font-size:18px; line-height:1.7; font-weight: 300; color: #eee;">${p.content}</div>
                ${mediaContent}
                <div style="margin-top:25px; display:flex; gap:35px; opacity:0.3; font-size: 20px;">
                    <i class="far fa-heart" style="cursor:pointer;"></i> 
                    <i class="far fa-comment-dots" style="cursor:pointer;"></i> 
                    <i class="fas fa-share-nodes" style="cursor:pointer;"></i>
                </div>
            </div>`;
        }).join('');

        res.send(MASTER_UI(postHTML, user));
    } catch (err) {
        res.status(500).send("Cosmic Error: System offline.");
    }
});

// [ADD POST WITH MEDIA]
app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    try {
        let mediaUrl = null;
        let mediaType = null;
        
        if (req.file) {
            mediaUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            mediaType = req.file.mimetype;
        }

        const newPost = new Post({ 
            author: req.session.user.username, 
            content: req.body.content,
            isAnonymous: req.body.isAnonymous === 'on',
            mediaUrl, 
            mediaType
        });

        await newPost.save();
        res.redirect('/dashboard');
    } catch (err) {
        res.redirect('/dashboard');
    }
});

// [AUTHENTICATION]
app.post('/signup', async (req, res) => {
    const userRaw = req.body.username.toLowerCase().trim();
    if(['xavi', 'admin', 'system'].includes(userRaw)) {
        return res.send("<script>alert('ID Reserved!'); window.location='/signup';</script>");
    }
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ 
        username: userRaw, 
        email: req.body.email.toLowerCase(), 
        password: hashedPassword 
    });
    
    await newUser.save();
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; 
        res.redirect('/dashboard');
    } else { 
        res.send("<script>alert('Vibe Check Failed!'); window.location='/login';</script>"); 
    }
});

app.get('/login', (req, res) => {
    res.send(`
    <body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; margin:0;">
        <div class="card" style="width:360px; text-align:center; padding:50px; border:1px solid var(--v); background: rgba(0,0,0,0.5);">
            <h2 style="font-weight: 900; letter-spacing: 2px;">GET IN</h2>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" required style="width:100%; padding:16px; margin:15px 0; border-radius:15px; background:rgba(255,255,255,0.06); border:1px solid var(--border); color:white; outline:none;">
                <input name="password" type="password" placeholder="Passkey" required style="width:100%; padding:16px; margin:15px 0; border-radius:15px; background:rgba(255,255,255,0.06); border:1px solid var(--border); color:white; outline:none;">
                <button style="width:100%; padding:16px; border-radius:60px; background:white; color:black; font-weight:900; cursor:pointer; border:none; margin-top:15px;">AUTHORIZE</button>
            </form>
            <p style="margin-top:20px; font-size:12px; opacity:0.5;">No ID? <a href="/signup" style="color:var(--p);">Sync Entity</a></p>
        </div>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`
    <body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; margin:0;">
        <div class="card" style="width:360px; text-align:center; padding:50px; border:1px solid var(--p); background: rgba(0,0,0,0.5);">
            <h2 style="font-weight: 900;">SYNC ENTITY</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Choose ID" required style="width:100%; padding:15px; margin:12px 0; border-radius:15px; background:rgba(255,255,255,0.06); border:1px solid var(--border); color:white; outline:none;">
                <input name="email" type="email" placeholder="Neural Email" required style="width:100%; padding:15px; margin:12px 0; border-radius:15px; background:rgba(255,255,255,0.06); border:1px solid var(--border); color:white; outline:none;">
                <input name="password" type="password" placeholder="Set Passkey" required style="width:100%; padding:15px; margin:12px 0; border-radius:15px; background:rgba(255,255,255,0.06); border:1px solid var(--border); color:white; outline:none;">
                <button style="width:100%; padding:16px; border-radius:60px; background:var(--p); color:white; font-weight:900; cursor:pointer; border:none; margin-top:15px;">SYNC DATA</button>
            </form>
        </div>
    </body>`);
});

// [FEEDBACK]
app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { 
        $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
    });
    res.send("<script>alert('Signal Transmitted to Xavi!'); window.location='/dashboard';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

// --- 6. NEURAL STARTUP ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🚀 [COSMIC BOOT]: XAVIROX SUPREME LIVE ON PORT ' + PORT));