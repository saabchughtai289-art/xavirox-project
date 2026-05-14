/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - V58 [THE GLOW-UP ENGINE INTEGRATION]
    STATUS: ALL SYSTEMS INTEGRATED + AURA DYNAMIC GLOW + STABLE ARCHIVE
    - MERGED: GenZ Search + Bento Portfolio + Cosmic Feed + Save/Archive Feature
    - FEATURE: Like (W), Dislike (L), and Save (Archive) tracking with active state colors
    - NEW UNIQUE ENGINE: Aura-Driven CSS UI Sync (Glow changes dynamically based on score)
    - SECURITY: Guest Blocked from Community Creation & Interaction
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

// --- [DATABASE] ---
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(dbURI, { bufferCommands: false });
        isConnected = true;
    } catch (err) { console.error('❌ DB ERROR:', err); }
};

// --- [MODELS] ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    aura: { type: Number, default: 100 },
    savedPosts: [String] // Array of Post IDs
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: String, 
    authorAura: { type: Number, default: 100 },
    content: String, 
    mediaUrl: String, 
    sector: { type: String, default: 'Global' }, 
    date: { type: Date, default: Date.now },
    likes: { type: [String], default: [] },    // Array of Usernames
    dislikes: { type: [String], default: [] }  // Array of Usernames
}));

const Sector = mongoose.models.Sector || mongoose.model('Sector', new mongoose.Schema({ 
    name: { type: String, required: true, unique: true, lowercase: true }
}));

// --- [MIDDLEWARE] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({ 
    secret: 'xavirox_smooth_sync_2026', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } 
}));
app.use(async (req, res, next) => { await connectDB(); next(); });

const upload = multer({ storage: multer.memoryStorage() });

// --- [MASTER UI ENGINE] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global') => {
    const isGuest = !user;
    
    // Unique Engine: Dynamic Aura Color Logic
    const auraColor = user ? (user.aura > 500 ? 'var(--cyan)' : user.aura < 50 ? '#ff0000' : 'var(--p)') : 'var(--p)';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { 
            --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000; 
            --glass: rgba(255, 255, 255, 0.07); --border: rgba(255, 255, 255, 0.12); 
            --pink-glow: 0 0 25px rgba(255, 0, 127, 0.4); 
            --dynamic-glow: 0 0 25px ${auraColor}44;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }

        /* STAR ENGINE */
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: #000; }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.3; animation: twinkle var(--d) infinite; }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; transform: scale(1.2); } }

        /* NAV DOCK + GENZ SEARCH */
        .top-left-nav { position: fixed; top: 25px; left: 25px; z-index: 10001; display: flex; align-items: center; gap: 15px; }
        .genz-search { background: rgba(255, 255, 255, 0.1); border: 1px solid var(--border); border-radius: 20px; padding: 12px 20px; color: #fff; width: 180px; outline: none; backdrop-filter: blur(15px); font-size: 12px; }
        .genz-search:focus { width: 250px; border-color: var(--cyan); box-shadow: 0 0 20px rgba(0, 242, 255, 0.2); }

        .nav-row { display: flex; gap: 12px; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 24px; border: 1px solid var(--border); backdrop-filter: blur(20px); }
        .nav-item { position: relative; display: flex; flex-direction: column; align-items: center; }
        .nav-btn-circle { width: 50px; height: 50px; background: var(--glass); border: 1px solid var(--border); border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; text-decoration: none; font-size: 18px; }
        .nav-btn-circle:hover { transform: translateY(-5px); border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); }
        .icon-label { position: absolute; top: 60px; background: var(--cyan); color: #000; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 8px; opacity: 0; transform: translateY(-10px); pointer-events: none; text-transform: uppercase; letter-spacing: 1px; }
        .nav-item:hover .icon-label { opacity: 1; transform: translateY(0); }

        .nav-logout { border-color: rgba(255, 0, 127, 0.4); color: var(--p); }
        .nav-logout:hover { border-color: var(--p); background: var(--p); color: #fff; box-shadow: 0 0 20px var(--p); }

        /* DYNAMIC ISLAND */
        .dynamic-island { 
            position: fixed; top: 25px; left: 50%; transform: translateX(-50%); 
            width: 220px; height: 45px; background: #000; 
            border: 1px solid var(--border); border-radius: 50px; 
            z-index: 10000; display: flex; align-items: center; justify-content: center; 
            font-size: 11px; font-weight: 900; letter-spacing: 2px;
            cursor: pointer; overflow: hidden;
        }
        .dynamic-island:hover { 
            width: 380px; height: 70px; 
            border-color: ${auraColor}; 
            box-shadow: var(--dynamic-glow);
        }
        .island-detail { display: none; font-size: 9px; opacity: 0.6; margin-top: 5px; letter-spacing: 1px; }
        .dynamic-island:hover .island-detail { display: block; }

        .main-container { max-width: 1100px; margin: 130px auto 50px auto; display: flex; gap: 35px; padding: 0 20px; }
        .feed { flex: 2; }
        .sidebar { flex: 1; }

        /* INTERACTION BUTTONS */
        .card { background: var(--glass); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 32px; padding: 30px; margin-bottom: 25px; position: relative; }
        .card:hover { border-color: ${auraColor}; box-shadow: var(--dynamic-glow); transform: scale(1.01); }

        .interaction-bar { display: flex; gap: 20px; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border); }
        .action-btn { background: transparent; border: none; color: #fff; font-size: 13px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; opacity: 0.6; }
        .action-btn:hover { opacity: 1; color: var(--cyan); }
        .action-btn.active-w { color: var(--cyan); opacity: 1; }
        .action-btn.active-l { color: var(--p); opacity: 1; }
        .action-btn.active-save { color: #ffea00; opacity: 1; }

        .aura-badge { font-size: 9px; background: ${auraColor}; color: #000; padding: 2px 8px; border-radius: 50px; font-weight: 900; vertical-align: middle; margin-left: 10px; }

        .create-btn { display: block; width: 100%; background: linear-gradient(45deg, var(--p), var(--v)); color: #fff; border: none; padding: 15px; border-radius: 20px; font-weight: 900; cursor: pointer; margin-top: 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; text-align: center; }
        
        .bento-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }
        .bento-item { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; padding: 20px; text-align: center; }

        footer { text-align: center; padding: 60px; font-size: 11px; opacity: 0.4; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="stars-container" id="stars"></div>
    
    <div class="top-left-nav">
        <input type="text" class="genz-search" placeholder="SEARCH THE VOID...">
        <div class="nav-row">
            <div class="nav-item">
                <a href="/dashboard" class="nav-btn-circle"><i class="fas fa-rocket"></i></a>
                <span class="icon-label">Orbit</span>
            </div>
            <div class="nav-item">
                <a href="/portfolio" class="nav-btn-circle"><i class="fas fa-fingerprint"></i></a>
                <span class="icon-label">Identity</span>
            </div>
            ${!isGuest ? `
            <div class="nav-item">
                <a href="/logout" class="nav-btn-circle nav-logout"><i class="fas fa-power-off"></i></a>
                <span class="icon-label">Eject</span>
            </div>` : ''}
        </div>
    </div>

    <div class="dynamic-island">
        <div style="text-align:center;">
            <div class="island-main">
                ${isGuest ? "LURKING IN SHADOWS 💀" : `AURA: ${user.aura}`}
            </div>
            <div class="island-detail">
                ${isGuest ? "IDENTITY REQUIRED FOR ACCESS" : "SECURE CONNECTION STABLE"}
            </div>
        </div>
    </div>

    <div class="main-container">
        <div class="feed">${content}</div>
        <div class="sidebar">
            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px; margin-bottom:20px;">COMMUNITIES</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:15px; text-decoration:none; font-weight:900;">🌏 GLOBAL</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#ccc; font-size:13px; text-decoration:none; margin-top:12px;"># ${s.name.toUpperCase()}</a>`).join('')}
                
                ${!isGuest ? `
                <button class="create-btn" onclick="let n=prompt('New Sector Name?'); if(n) location.href='/create-sector?name='+n">
                    + Build Community
                </button>` : `
                <div style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.03); border-radius:15px; text-align:center; border:1px dashed rgba(255,255,255,0.1);">
                    <p style="font-size:10px; opacity:0.5;">JOIN GANG TO CREATE SECTORS</p>
                </div>`}
            </div>

            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; letter-spacing:4px;">FEEDBACK</h4>
                <textarea id="feedbackText" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid #222; border-radius:15px; color:#fff; padding:15px; margin-top:12px; outline:none; resize:none; font-size:12px;" rows="3" placeholder="Drop thoughts..."></textarea>
                <button id="feedbackBtn" class="create-btn" style="background:rgba(255,255,255,0.05); border:1px solid var(--border);">SEND SIGNAL</button>
            </div>
        </div>
    </div>

    <footer>XAVIROX COSMIC OS V58 | CORE: xavirox.co@gmail.com</footer>

    <script>
        const container = document.getElementById('stars');
        for(let i=0; i<120; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2;
            star.style.width = size + 'px'; star.style.height = size + 'px';
            star.style.top = Math.random() * 100 + '%'; star.style.left = Math.random() * 100 + '%';
            star.style.setProperty('--d', (Math.random() * 3 + 2) + 's');
            container.appendChild(star);
        }

        async function interact(postId, type) {
            const res = await fetch('/interact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, type })
            });
            if(res.ok) location.reload();
            else alert('LOG IN TO INTERACT!');
        }

        document.getElementById('feedbackBtn')?.addEventListener('click', function() {
            const txt = document.getElementById('feedbackText');
            if(!txt.value.trim()) return;
            this.innerHTML = "SIGNAL DELIVERED 🛸";
            this.style.background = "var(--cyan)";
            this.style.color = "#000";
            txt.value = "";
            setTimeout(() => {
                this.innerHTML = "SEND SIGNAL";
                this.style.background = "rgba(255,255,255,0.05)";
                this.style.color = "#fff";
            }, 3000);
        });
    </script>
</body></html>`;
};

// --- [CORE ROUTES] ---
app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    const posts = await Post.find(activeSector !== 'Global' ? { sector: activeSector } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    const user = req.session.user;
    
    const postForm = `<div class="card">
        ${!user ? `<button class="create-btn" onclick="location.href='/login'">SYNC IDENTITY TO POST</button>` : `
            <form action="/addpost" method="POST" enctype="multipart/form-data">
                <textarea name="content" style="width:100%; background:transparent; border:none; color:#fff; outline:none; font-size:18px; min-height:80px;" placeholder="What's the signal?" required></textarea>
                <input type="hidden" name="sector" value="${activeSector}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                    <label style="cursor:pointer; opacity:0.7;"><i class="fas fa-camera fa-xl"></i><input type="file" name="media" hidden></label>
                    <button style="background:#fff; color:#000; border:none; padding:12px 30px; border-radius:50px; font-weight:900; cursor:pointer;">TRANSMIT</button>
                </div>
            </form>`}
    </div>`;

    const html = posts.map(p => {
        const hasW = user && p.likes.includes(user.username);
        const hasL = user && p.dislikes.includes(user.username);
        const isSaved = user && user.savedPosts && user.savedPosts.includes(p._id.toString());
        const postAuraColor = p.authorAura > 500 ? 'var(--cyan)' : p.authorAura < 50 ? '#ff0000' : 'var(--p)';

        return `<div class="card">
            <b style="color:${postAuraColor}; font-size:14px;">@${p.author} <span class="aura-badge">${p.authorAura || 100}</span></b>
            <p style="margin-top:12px; font-size:16px;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:15px; border:1px solid var(--border);">` : ''}
            
            <div class="interaction-bar">
                <button onclick="interact('${p._id}', 'like')" class="action-btn ${hasW ? 'active-w' : ''}">
                    <i class="fas fa-crown"></i> ${p.likes.length} W
                </button>
                <button onclick="interact('${p._id}', 'dislike')" class="action-btn ${hasL ? 'active-l' : ''}">
                    <i class="fas fa-skull"></i> ${p.dislikes.length} L
                </button>
                <button onclick="interact('${p._id}', 'save')" class="action-btn ${isSaved ? 'active-save' : ''}">
                    <i class="fas fa-bookmark"></i> ${isSaved ? 'ARCHIVED' : 'SAVE'}
                </button>
            </div>
        </div>`
    }).join('');
    
    res.send(MASTER_UI(postForm + (html || '<div style="text-align:center; opacity:0.2; padding:80px;">NO SIGNALS</div>'), user, sectors, activeSector));
});

// --- [INTERACTION LOGIC] ---
app.post('/interact', async (req, res) => {
    if (!req.session.user) return res.status(401).send();
    const { postId, type } = req.body;
    const username = req.session.user.username;

    const post = await Post.findById(postId);
    const dbUser = await User.findOne({ username });
    const author = await User.findOne({ username: post.author });

    if (type === 'like') {
        if (post.likes.includes(username)) {
            post.likes = post.likes.filter(u => u !== username);
            if(author) author.aura -= 10;
        } else { 
            post.likes.push(username); 
            post.dislikes = post.dislikes.filter(u => u !== username); 
            if(author) author.aura += 10;
        }
    } else if (type === 'dislike') {
        if (post.dislikes.includes(username)) {
            post.dislikes = post.dislikes.filter(u => u !== username);
            if(author) author.aura += 5;
        } else { 
            post.dislikes.push(username); 
            post.likes = post.likes.filter(u => u !== username); 
            if(author) author.aura -= 5;
        }
    } else if (type === 'save') {
        if (dbUser.savedPosts.includes(postId)) dbUser.savedPosts = dbUser.savedPosts.filter(id => id !== postId);
        else dbUser.savedPosts.push(postId);
        await dbUser.save();
        req.session.user.savedPosts = dbUser.savedPosts;
    }
    
    if(author) await author.save();
    post.authorAura = author ? author.aura : 100;
    await post.save();
    res.sendStatus(200);
});

app.get('/portfolio', async (req, res) => {
    const user = req.session.user;
    const sectors = await Sector.find();
    const portfolioContent = `
        <div class="card" style="border: 2px solid ${user ? 'var(--cyan)' : 'var(--p)'};">
            <div style="text-align: center;">
                <div style="width: 100px; height: 100px; background: linear-gradient(45deg, var(--p), var(--v)); border-radius: 30px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-${user ? 'user-ninja' : 'ghost'} fa-3x"></i>
                </div>
                <h1 style="margin-top:25px; font-size:32px;">${user ? user.username : 'GUEST'}<span style="color:var(--cyan);">.os</span></h1>
                <div class="bento-grid">
                    <div class="bento-item" style="grid-column: span 2;">
                        <h3 style="font-size:10px; opacity:0.5;">AURA LEVEL</h3>
                        <p style="font-size:24px; color:var(--cyan); font-weight:900;">${user ? user.aura : '0'}</p>
                    </div>
                    <div class="bento-item"><i class="fas fa-shield-alt"></i><p style="font-size:11px;">SECURED</p></div>
                    <div class="bento-item"><i class="fas fa-terminal"></i><p style="font-size:11px;">ACTIVE</p></div>
                </div>
                ${!user ? `<a href="/login" class="create-btn">SYNC NOW</a>` : ''}
            </div>
        </div>`;
    res.send(MASTER_UI(portfolioContent, user, sectors, 'Portfolio'));
});

// --- [SYSTEM LOGIC] ---
app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const user = await User.findOne({ username: req.session.user.username });
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: user.username, authorAura: user.aura, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    user.aura += 15;
    await user.save();
    req.session.user.aura = user.aura; // Sync active session
    res.redirect('back');
});

app.get('/create-sector', async (req, res) => {
    if (!req.session.user) return res.send("<script>alert('GANG ONLY!'); window.location.href='/login';</script>");
    const name = req.query.name ? req.query.name.toLowerCase().trim() : null;
    if (name) { try { await new Sector({ name }).save(); } catch(e) {} }
    res.redirect('/dashboard?sector=' + (name || 'Global'));
});

// --- [AUTH SYSTEM] ---
app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; overflow:hidden;">
        <div style="background:rgba(255,255,255,0.05); padding:50px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); text-align:center; backdrop-filter:blur(20px);">
            <h2 style="letter-spacing:5px; margin-bottom:10px;">XAVIROX</h2>
            <p style="font-size:10px; opacity:0.5; margin-bottom:30px;">SECURE ACCESS PROTOCOL</p>
            <form action="/login" method="POST">
                <input name="username" placeholder="IDENTITY (Username)" required style="display:block; margin:15px auto; padding:15px; width:280px; background:#111; border:1px solid #333; color:#fff; border-radius:15px; outline:none;">
                <input name="password" type="password" placeholder="ACCESS KEY (Password)" required style="display:block; margin:15px auto; padding:15px; width:280px; background:#111; border:1px solid #333; color:#fff; border-radius:15px; outline:none;">
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button name="action" value="login" style="flex:1; padding:15px; border-radius:15px; background:#fff; color:#000; font-weight:900; border:none; cursor:pointer;">SYNC</button>
                    <button name="action" value="register" style="flex:1; padding:15px; border-radius:15px; background:transparent; color:#fff; font-weight:900; border:1px solid #444; cursor:pointer;">NEW IDENTITY</button>
                </div>
            </form>
            <a href="/dashboard" style="display:block; margin-top:25px; color:rgba(255,255,255,0.3); text-decoration:none; font-size:12px;">LURK AS GUEST</a>
        </div>
    </body>`);
});

app.post('/login', async (req, res) => {
    const { username, password, action } = req.body;
    const userLower = username.toLowerCase();
    if (action === 'register') {
        const exists = await User.findOne({ username: userLower });
        if (exists) return res.send("<script>alert('Identity already taken!'); window.history.back();</script>");
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await new User({ username: userLower, password: hashed, aura: 100, savedPosts: [] }).save();
        req.session.user = newUser;
        return res.redirect('/dashboard');
    }
    const user = await User.findOne({ username: userLower });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.send("<script>alert('Invalid Identity or Key!'); window.history.back();</script>");
    }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;