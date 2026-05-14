/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - V51 [HYBRID MERGE & LOGIC FIX]
    MERGED FEATURES: 
    - GENZ BENTO PORTFOLIO (V49) + DYNAMIC LOGIC (V50)
    - Fix: Feedback Bar Dynamic Response
    - Fix: Logout Integrated in Nav Row
    - Fix: Portfolio Context Awareness (User vs Guest)
    - DESIGN: Neon Glow, Cyber-Aura, iOS 26 Elastic Island, Star Engine.
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
    aura: { type: Number, default: 100 }
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: String, content: String, mediaUrl: String, sector: { type: String, default: 'Global' }, date: { type: Date, default: Date.now }
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
    const unhingedPrompts = [
        "type something unhinged...", "drop your hot take here", "cooked or cooking?", 
        "your brainrot goes here", "speak your truth king", "certified yap zone"
    ];
    const randomPrompt = unhingedPrompts[Math.floor(Math.random() * unhingedPrompts.length)];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000; --glass: rgba(255, 255, 255, 0.07); --border: rgba(255, 255, 255, 0.12); }
        * { margin: 0; padding: 0; box-sizing: border-box; transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }

        /* STAR ENGINE */
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: #000; overflow: hidden; }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.4; animation: twinkle var(--d) infinite ease-in-out; }
        @keyframes twinkle { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.3); opacity: 0.8; } }

        /* NAV & SEARCH */
        .top-left-nav { position: fixed; top: 25px; left: 25px; z-index: 10001; display: flex; align-items: center; gap: 15px; }
        .genz-search { background: rgba(255, 255, 255, 0.1); border: 2px solid var(--border); border-radius: 18px; padding: 12px 20px; color: #fff; width: 220px; outline: none; backdrop-filter: blur(15px); }
        .genz-search:focus { width: 300px; border-color: var(--cyan); box-shadow: 0 0 25px rgba(0, 242, 255, 0.3); }
        
        .nav-row { display: flex; gap: 10px; }
        .nav-btn-circle { width: 48px; height: 48px; background: var(--glass); border: 1px solid var(--border); border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; text-decoration: none; backdrop-filter: blur(10px); }
        .nav-btn-circle:hover { transform: translateY(-3px); border-color: var(--cyan); color: var(--cyan); }
        .nav-logout { border-color: rgba(255, 0, 127, 0.3); color: var(--p); }
        .nav-logout:hover { background: rgba(255, 0, 127, 0.1); border-color: var(--p); box-shadow: 0 0 20px var(--p); }

        .dynamic-island { position: fixed; top: 25px; left: 50%; transform: translateX(-50%); width: 200px; height: 40px; background: #000; border: 1px solid var(--border); border-radius: 50px; z-index: 10000; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; }
        .dynamic-island:hover { width: 360px; height: 60px; border-color: var(--p); box-shadow: 0 10px 30px rgba(255, 0, 127, 0.3); }

        .main-container { max-width: 1100px; margin: 120px auto 50px auto; display: flex; gap: 35px; padding: 0 20px; }
        .feed { flex: 2.2; }
        .sidebar { flex: 1; }

        .card { background: var(--glass); backdrop-filter: blur(35px); border: 1px solid var(--border); border-radius: 30px; padding: 28px; margin-bottom: 25px; position: relative; }
        .card:hover { border-color: var(--p); transform: translateY(-5px); box-shadow: 0 10px 40px rgba(255, 0, 127, 0.15); }

        .create-btn { display: block; width: 100%; background: linear-gradient(45deg, var(--p), var(--v)); color: #fff; border: none; padding: 14px; border-radius: 18px; font-weight: 900; cursor: pointer; margin-top: 15px; text-decoration: none; text-align: center; font-size: 12px; text-transform: uppercase; }
        .create-btn:hover { box-shadow: 0 0 20px var(--p); transform: scale(1.02); }

        /* BENTO STYLES */
        .bento-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; }
        .bento-item { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .bento-item i { margin-bottom: 10px; color: var(--cyan); }
        .aura-tag { background: linear-gradient(90deg, var(--p), var(--v)); padding: 4px 12px; border-radius: 50px; font-size: 10px; font-weight: 900; margin-top: 10px; }

        footer { text-align: center; padding: 80px 20px; font-size: 11px; opacity: 0.4; letter-spacing: 2px; }
    </style>
</head>
<body>
    <div class="stars-container" id="stars"></div>
    
    <div class="top-left-nav">
        <input type="text" class="genz-search" placeholder="Search the void...">
        <div class="nav-row">
            <a href="/dashboard" class="nav-btn-circle" title="Home Feed"><i class="fas fa-rocket"></i></a>
            <a href="/portfolio" class="nav-btn-circle" title="Portfolio"><i class="fas fa-fingerprint"></i></a>
            ${!isGuest ? `<a href="/logout" class="nav-btn-circle nav-logout" title="Logout"><i class="fas fa-power-off"></i></a>` : ''}
        </div>
    </div>

    <div class="dynamic-island" id="island">
        ${isGuest ? "LURKING IN 4K 💀" : `SECTOR: ${activeSector.toUpperCase()}`}
    </div>

    <div class="main-container">
        <div class="feed">${content}</div>
        <div class="sidebar">
            <div class="card" style="padding: 25px;">
                <h4 style="font-size:11px; opacity:0.6; letter-spacing:4px; margin-bottom:20px;">COMMUNITIES</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:15px; text-decoration:none; font-weight:900;">🌏 GLOBAL FEED</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#ddd; font-size:14px; text-decoration:none; margin-top:10px;"># ${s.name.toUpperCase()}</a>`).join('')}
                <button class="create-btn" onclick="let n=prompt('Name?'); if(n) location.href='/create-sector?name='+n">+ NEW SECTOR</button>
            </div>

            <div class="card" style="padding: 25px;">
                <h4 style="font-size:11px; opacity:0.6; letter-spacing:4px;">FEEDBACK LOOP</h4>
                <textarea id="feedbackText" style="width:100%; background:rgba(0,0,0,0.4); border:1px solid #333; border-radius:15px; color:#fff; padding:15px; margin-top:12px; outline:none; resize:none;" rows="3" placeholder="Drop lore..."></textarea>
                <button id="feedbackBtn" class="create-btn" style="background:rgba(255,255,255,0.1); border:1px solid var(--border);">SEND SIGNAL</button>
            </div>
        </div>
    </div>

    <footer>
        XAVIROX COSMIC OS V51 | 2026<br>
        <span style="opacity:0.6; font-size:10px;">CORE CONTACT: xavirox.co@gmail.com</span>
    </footer>

    <script>
        // DYNAMIC FEEDBACK FIX
        document.getElementById('feedbackBtn').addEventListener('click', function() {
            const txt = document.getElementById('feedbackText');
            if(txt.value.trim() === "") return alert("Empty signal?");
            this.innerHTML = "<i class='fas fa-check'></i> SIGNAL SENT";
            this.style.background = "var(--cyan)";
            this.style.color = "#000";
            txt.value = "";
            setTimeout(() => {
                this.innerHTML = "SEND SIGNAL";
                this.style.background = "rgba(255,255,255,0.1)";
                this.style.color = "#fff";
            }, 3000);
        });

        // STAR ENGINE
        const container = document.getElementById('stars');
        for(let i=0; i<150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2.5;
            star.style.width = size + 'px'; star.style.height = size + 'px';
            star.style.top = Math.random() * 100 + '%'; star.style.left = Math.random() * 100 + '%';
            star.style.setProperty('--d', (Math.random() * 4 + 2) + 's');
            container.appendChild(star);
        }
    </script>
</body></html>`;
};

// --- [CORE ROUTES] ---
app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    const posts = await Post.find(activeSector !== 'Global' ? { sector: activeSector } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    
    const postForm = `<div class="card">
        ${!req.session.user ? `<button class="create-btn" onclick="location.href='/login'">INITIALIZE SYNC (LOGIN)</button>` : `
            <form action="/addpost" method="POST" enctype="multipart/form-data">
                <textarea name="content" style="width:100%; background:transparent; border:none; color:#fff; outline:none; font-size:20px; min-height:80px;" placeholder="What's cooking?" required></textarea>
                <input type="hidden" name="sector" value="${activeSector}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                    <label style="cursor:pointer; opacity:0.7;"><i class="fas fa-image fa-2x"></i><input type="file" name="media" hidden></label>
                    <button style="background:#fff; color:#000; border:none; padding:12px 30px; border-radius:50px; font-weight:900; cursor:pointer;">TRANSMIT</button>
                </div>
            </form>`}
    </div>`;

    const html = posts.map(p => `<div class="card">
        <b style="color:var(--cyan);">@${p.author}</b>
        <p style="margin-top:15px; font-size:17px;">${p.content}</p>
        ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:20px; border:1px solid var(--border);">` : ''}
    </div>`).join('');
    
    res.send(MASTER_UI(postForm + (html || '<div style="text-align:center; opacity:0.3; padding:50px;">VOID IS SILENT...</div>'), req.session.user, sectors, activeSector));
});

// --- [PERSONALIZED BENTO PORTFOLIO] ---
app.get('/portfolio', async (req, res) => {
    const sectors = await Sector.find();
    const user = req.session.user;
    
    const portfolioContent = `
        <div class="card" style="border: 2px solid ${user ? 'var(--cyan)' : 'var(--p)'}; background: radial-gradient(circle at top right, rgba(0,242,255,0.1), transparent);">
            <div style="text-align: center; padding: 20px;">
                <div style="position: relative; display: inline-block;">
                    <div style="width: 120px; height: 120px; background: linear-gradient(45deg, var(--p), var(--v)); border-radius: 35px; border: 4px solid #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px var(--p);">
                        <i class="fas fa-${user ? 'user-ninja' : 'ghost'} fa-4x"></i>
                    </div>
                    <div style="position: absolute; bottom: -10px; right: -10px; background: var(--cyan); color:#000; padding: 5px 15px; border-radius: 10px; font-size: 12px; font-weight: 900; transform: rotate(5deg);">
                        ${user ? 'LVL 99' : 'LVL 0'}
                    </div>
                </div>
                
                <h1 style="margin-top: 30px; font-size: 42px; font-weight: 900; text-transform: uppercase; letter-spacing: -2px;">
                    ${user ? user.username : 'GUEST'}<span style="color: var(--cyan);">.node</span>
                </h1>
                <p style="opacity: 0.6; font-size: 14px; letter-spacing: 2px;">${user ? 'AUTHORIZED COSMIC ARCHITECT' : 'UNAUTHORIZED LURKER'}</p>
                
                <div class="bento-grid">
                    <div class="bento-item" style="grid-column: span 2; background: rgba(0,242,255,0.05);">
                        <i class="fas fa-bolt fa-2x"></i>
                        <h3 style="font-size: 13px; opacity:0.7;">TOTAL AURA</h3>
                        <p style="font-size: 28px; font-weight: 900; color: var(--cyan);">${user ? user.aura : '0'}</p>
                        <div class="aura-tag">${user ? 'STABLE' : 'UNSTABLE'} ENERGY</div>
                    </div>
                    <div class="bento-item">
                        <i class="fas fa-terminal"></i>
                        <h3 style="font-size: 11px;">STATUS</h3>
                        <p style="font-weight: 900;">${user ? 'ACTIVE' : 'OFFLINE'}</p>
                    </div>
                    <div class="bento-item" style="border-color: var(--p);">
                        <i class="fas fa-shield-alt" style="color: var(--p);"></i>
                        <h3 style="font-size: 11px;">SECURITY</h3>
                        <p style="font-weight: 900;">ENCRYPTED</p>
                    </div>
                </div>

                ${!user ? `<button class="create-btn" onclick="location.href='/login'" style="margin-top:20px;">AUTHENTICATE TO UNLOCK LORE</button>` : `
                <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center;">
                    <button class="create-btn" style="width: 100%; background:rgba(255,255,255,0.1); border:1px solid var(--border);">EDIT PORTFOLIO</button>
                </div>`}
            </div>
        </div>
    `;
    res.send(MASTER_UI(portfolioContent, user, sectors, 'Portfolio'));
});

// --- [CORE SYSTEM LOGIC] ---
app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    await User.findOneAndUpdate({ username: req.session.user.username }, { $inc: { aura: 15 } });
    res.redirect('back');
});

app.get('/create-sector', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const name = req.query.name ? req.query.name.toLowerCase().trim() : null;
    if (name) { try { await new Sector({ name }).save(); } catch(e) {} }
    res.redirect('/dashboard?sector=' + (name || 'Global'));
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><form action="/login" method="POST" style="background:rgba(255,255,255,0.04); padding:60px; border-radius:45px; border:1px solid rgba(255,255,255,0.15); text-align:center; backdrop-filter:blur(30px);"> <h1 style="letter-spacing:8px; margin-bottom:40px; font-weight:900;">XAVIROX</h1> <input name="username" placeholder="IDENTITY" required style="display:block; margin:20px auto; padding:18px; width:300px; background:#111; border:2px solid #333; color:#fff; border-radius:20px; outline:none;"> <input name="password" type="password" placeholder="ACCESS KEY" required style="display:block; margin:20px auto; padding:18px; width:300px; background:#111; border:2px solid #333; color:#fff; border-radius:20px; outline:none;"> <button style="padding:18px 70px; border-radius:50px; background:#fff; color:#000; font-weight:900; border:none; cursor:pointer; margin-top:30px;">SYNC</button> </form></body>`);
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
    } else res.send("Unauthorized access.");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;