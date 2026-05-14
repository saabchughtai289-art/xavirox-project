/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - V44 [FINAL ELITE MERGE]
    FEATURES: Ultra-Smooth Aura Glow, iOS 26 Elastic Island, Top-Left Gen-Z Search, 
              Sidebar Community Creator, Feedback System, Glass-Transparency.
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
        "type something unhinged...", "drop your hot take here", "bro is thinking...", 
        "cooked or cooking?", "your brainrot goes here", "speak your truth king",
        "post and pray", "write like the main character", "insert midnight thoughts",
        "this box can’t handle your aura", "go full sigma", "the timeline needs content",
        "enter your villain arc thoughts", "the internet is listening 👀", "certified yap zone"
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
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000; --glass: rgba(255, 255, 255, 0.04); --border: rgba(255, 255, 255, 0.08); }
        * { margin: 0; padding: 0; box-sizing: border-box; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }

        /* STAR ENGINE */
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: #000; overflow: hidden; }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.4; animation: twinkle var(--d) infinite ease-in-out; }
        @keyframes twinkle { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.3); opacity: 0.8; box-shadow: 0 0 10px #fff; } }

        /* TOP-LEFT GEN-Z SEARCH */
        .top-left-nav { position: fixed; top: 20px; left: 20px; z-index: 10001; }
        .genz-search { background: var(--glass); border: 1px solid var(--border); border-radius: 15px; padding: 10px 15px; color: #fff; width: 180px; font-size: 12px; outline: none; backdrop-filter: blur(10px); }
        .genz-search:focus { width: 250px; border-color: var(--cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.2); }

        /* iOS 26 DYNAMIC ISLAND */
        .dynamic-island { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 180px; height: 35px; background: #000; border: 1px solid var(--border); border-radius: 50px; z-index: 10000; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; letter-spacing: 1px; cursor: pointer; border-top: 1px solid rgba(255,255,255,0.2); overflow: hidden; }
        .dynamic-island:hover { width: 340px; height: 65px; border-color: var(--p); box-shadow: 0 10px 40px rgba(255, 0, 127, 0.4); background: rgba(10, 10, 10, 0.95); }

        /* GLO-AURA CARDS (SMOOTH ANIMATION) */
        .card { background: var(--glass); backdrop-filter: blur(30px); border: 1px solid var(--border); border-radius: 28px; padding: 25px; margin-bottom: 25px; position: relative; }
        .card:hover { border-color: transparent; box-shadow: 0 0 30px -5px var(--p), 0 0 30px -5px var(--v); transform: translateY(-5px); background: rgba(255, 255, 255, 0.06); }

        .dock { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); width: 60px; background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 50px; display: flex; flex-direction: column; padding: 30px 0; gap: 25px; align-items: center; z-index: 1000; }
        .dock i:hover { color: var(--cyan); filter: drop-shadow(0 0 8px var(--cyan)); transform: scale(1.3); }

        .main-container { max-width: 1100px; margin: 100px auto 50px 220px; display: flex; gap: 30px; }
        .feed { flex: 2; }
        .sidebar { flex: 1; }

        .btn-transmit { background: #fff; color: #000; border: none; padding: 12px 25px; border-radius: 50px; font-weight: 900; cursor: pointer; }
        .btn-transmit:hover { background: var(--cyan); box-shadow: 0 0 20px var(--cyan); transform: scale(1.05); }

        /* SIDEBAR BLOCKS */
        .sidebar-block { background: var(--glass); border: 1px solid var(--border); border-radius: 24px; padding: 20px; margin-bottom: 20px; backdrop-filter: blur(20px); }
        .sidebar-block:hover { border-color: var(--cyan); }
        .feedback-input { width: 100%; background: #000; border: 1px solid #222; border-radius: 12px; color: #fff; padding: 12px; font-size: 13px; margin-top: 10px; outline: none; resize: none; }
        
        .create-btn { display: block; width: 100%; background: linear-gradient(45deg, var(--p), var(--v)); color: #fff; border: none; padding: 12px; border-radius: 15px; font-size: 11px; font-weight: 900; text-decoration: none; text-align: center; margin-top: 15px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; }
        .create-btn:hover { filter: brightness(1.2); box-shadow: 0 0 15px var(--p); }

        footer { text-align: center; padding: 60px; font-size: 11px; opacity: 0.3; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="stars-container" id="stars"></div>
    
    <div class="top-left-nav">
        <input type="text" class="genz-search" placeholder="Search the void...">
    </div>

    <div class="dynamic-island" id="island">
        ${isGuest ? "LURKING IN 4K 💀" : `SECTOR: ${activeSector.toUpperCase()}`}
    </div>

    <div class="dock">
        <i class="fas fa-rocket" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fingerprint" onclick="location.href='/portfolio'"></i>
        <i class="fas fa-power-off" style="color:var(--p);" onclick="location.href='/logout'"></i>
    </div>

    <div class="main-container">
        <div class="feed">
            <div class="card">
                ${isGuest ? `
                    <input class="genz-search" style="width:100%; height:55px; font-size:16px; border-radius:20px;" placeholder="sign up gang 💀" readonly onclick="location.href='/login'">
                    <button class="btn-transmit" style="margin-top:20px; width:100%" onclick="location.href='/login'">INITIALIZE SYNC</button>
                ` : `
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" style="width:100%; background:transparent; border:none; color:#fff; outline:none; font-size:19px; min-height:80px;" placeholder="${randomPrompt}" required></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                            <label for="media" style="cursor:pointer; opacity:0.6;"><i class="fas fa-image fa-xl"></i><input type="file" name="media" id="media" hidden></label>
                            <button class="btn-transmit">TRANSMIT</button>
                        </div>
                    </form>
                `}
            </div>
            ${content}
        </div>

        <div class="sidebar">
            <div class="sidebar-block">
                <h4 style="font-size:10px; opacity:0.6; letter-spacing:3px; margin-bottom:20px; text-transform:uppercase;">Communities</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:12px; text-decoration:none; font-weight:900; font-size:14px;">🌏 GLOBAL FEED</a>
                <div style="max-height: 250px; overflow-y: auto; margin-bottom: 10px;">
                    ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#eee; font-size:13px; text-decoration:none; margin-top:10px; opacity:0.8;"># ${s.name.toUpperCase()}</a>`).join('')}
                </div>
                <button class="create-btn" onclick="let n=prompt('Enter Community Name:'); if(n) location.href='/create-sector?name='+n">
                    <i class="fas fa-plus-circle"></i> New Community
                </button>
            </div>

            <div class="sidebar-block">
                <h4 style="font-size:10px; opacity:0.6; letter-spacing:3px; text-transform:uppercase;">Feedback Loop</h4>
                <textarea class="feedback-input" rows="3" placeholder="Drop lore or report bugs..."></textarea>
                <button class="create-btn" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid var(--border);" onclick="alert('Signal sent to xavirox.co@gmail.com')">
                    Submit Signal
                </button>
            </div>
        </div>
    </div>

    <footer>
        XAVIROX COSMIC OS V44 | 2026<br>
        <span style="opacity:0.5">ESTABLISHED FOR THE ELITE</span>
    </footer>

    <script>
        // STARS GENERATOR
        const container = document.getElementById('stars');
        for(let i=0; i<160; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2.5;
            star.style.width = size + 'px'; star.style.height = size + 'px';
            star.style.top = Math.random() * 100 + '%'; star.style.left = Math.random() * 100 + '%';
            star.style.setProperty('--d', (Math.random() * 3 + 2) + 's');
            container.appendChild(star);
        }

        // ISLAND ROASTS
        const roasts = ["STILL LURKING? 💀", "SIGN UP LIL BRO", "BRO FEARS ACCOUNTS", "NPC ENERGY DETECTED", "GET A USERNAME", "LURKING GOES CRAZY"];
        if(${isGuest}) {
            setInterval(() => {
                const island = document.getElementById('island');
                island.style.transform = 'translateX(-50%) scale(0.8)';
                setTimeout(() => {
                    island.innerText = roasts[Math.floor(Math.random() * roasts.length)];
                    island.style.transform = 'translateX(-50%) scale(1)';
                }, 500);
            }, 15000);
        }
    </script>
</body></html>`;
};

// --- [CORE ROUTES] ---
app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    const posts = await Post.find(activeSector !== 'Global' ? { sector: activeSector } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    const html = posts.map(p => `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:var(--cyan); font-size:15px;">@${p.author}</b>
                <span style="font-size:10px; opacity:0.3; background:rgba(255,255,255,0.05); padding:4px 10px; border-radius:10px;">#${p.sector}</span>
            </div>
            <p style="margin-top:18px; font-size:16px; line-height:1.6; color:#efefef;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:22px; margin-top:20px; border:1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">` : ''}
        </div>
    `).join('');
    res.send(MASTER_UI(html || '<div class="card" style="text-align:center; opacity:0.4; padding:50px;">The void is empty... Start a transmission.</div>', req.session.user, sectors, activeSector));
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    await User.findOneAndUpdate({ username: req.session.user.username }, { $inc: { aura: 10 } });
    res.redirect('back');
});

app.get('/create-sector', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const name = req.query.name ? req.query.name.toLowerCase().trim() : null;
    if (name) {
        try { await new Sector({ name }).save(); } catch(e) {}
    }
    res.redirect('/dashboard?sector=' + (name || 'Global'));
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><form action="/login" method="POST" style="background:rgba(255,255,255,0.03); padding:50px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); text-align:center; backdrop-filter:blur(20px);"> <h1 style="letter-spacing:5px; margin-bottom:30px;">XAVIROX</h1> <input name="username" placeholder="IDENTITY" required style="display:block; margin:20px auto; padding:15px; width:280px; background:#111; border:1px solid #333; color:#fff; border-radius:15px; outline:none;"> <input name="password" type="password" placeholder="ACCESS KEY" required style="display:block; margin:20px auto; padding:15px; width:280px; background:#111; border:1px solid #333; color:#fff; border-radius:15px; outline:none;"> <button style="padding:15px 60px; border-radius:50px; background:#fff; color:#000; font-weight:900; border:none; cursor:pointer; margin-top:20px;">SYNC</button> </form></body>`);
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