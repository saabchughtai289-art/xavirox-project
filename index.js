/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - V47 [HORIZONTAL ELITE MERGE]
    FEATURES: Horizontal Top-Left Nav, High-Visibility Search, iOS 26 Elastic Island, 
              Sidebar Community Creator, Integrated Support (xavirox.co@gmail.com).
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
        "your brainrot goes here", "speak your truth king", "this box can’t handle your aura", 
        "certified yap zone"
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
        
        /* ULTRA-SMOOTH ANIMATIONS */
        * { margin: 0; padding: 0; box-sizing: border-box; transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        
        body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }

        /* STAR ENGINE */
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: #000; overflow: hidden; }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.4; animation: twinkle var(--d) infinite ease-in-out; }
        @keyframes twinkle { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.3); opacity: 0.8; box-shadow: 0 0 10px #fff; } }

        /* HORIZONTAL TOP-LEFT NAV */
        .top-left-nav { position: fixed; top: 25px; left: 25px; z-index: 10001; display: flex; align-items: center; gap: 15px; }
        
        /* HIGH VISIBILITY SEARCH BAR */
        .genz-search { background: rgba(255, 255, 255, 0.1); border: 2px solid var(--border); border-radius: 18px; padding: 12px 20px; color: #fff; width: 220px; font-size: 13px; outline: none; backdrop-filter: blur(15px); box-shadow: inset 0 0 10px rgba(0,0,0,0.5); }
        .genz-search:focus { width: 300px; border-color: var(--cyan); box-shadow: 0 0 25px rgba(0, 242, 255, 0.3); background: rgba(255, 255, 255, 0.15); }
        
        .nav-row { display: flex; gap: 10px; }
        .nav-btn-circle { width: 48px; height: 48px; background: var(--glass); border: 1px solid var(--border); border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; text-decoration: none; backdrop-filter: blur(10px); }
        .nav-btn-circle:hover { transform: translateY(-3px) scale(1.1); border-color: var(--cyan); color: var(--cyan); box-shadow: 0 10px 20px rgba(0, 242, 255, 0.2); }

        /* iOS 26 DYNAMIC ISLAND */
        .dynamic-island { position: fixed; top: 25px; left: 50%; transform: translateX(-50%); width: 200px; height: 40px; background: #000; border: 1px solid var(--border); border-radius: 50px; z-index: 10000; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; border-top: 1px solid rgba(255,255,255,0.25); }
        .dynamic-island:hover { width: 360px; height: 70px; border-color: var(--p); box-shadow: 0 15px 45px rgba(255, 0, 127, 0.4); }

        /* GLO-AURA CARDS */
        .card { background: var(--glass); backdrop-filter: blur(35px); border: 1px solid var(--border); border-radius: 30px; padding: 28px; margin-bottom: 25px; position: relative; overflow: hidden; }
        .card:hover { border-color: transparent; box-shadow: 0 0 40px -10px var(--p), 0 0 40px -10px var(--v); transform: translateY(-6px); background: rgba(255, 255, 255, 0.08); }

        /* RIGHT DOCK */
        .dock { position: fixed; right: 25px; top: 50%; transform: translateY(-50%); width: 65px; background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 50px; display: flex; flex-direction: column; padding: 25px 0; align-items: center; z-index: 1000; }
        .dock i:hover { color: var(--p); transform: scale(1.4); filter: drop-shadow(0 0 10px var(--p)); }

        .main-container { max-width: 1100px; margin: 120px auto 50px auto; display: flex; gap: 35px; padding: 0 20px; }
        .feed { flex: 2.2; }
        .sidebar { flex: 1; }

        .btn-transmit { background: #fff; color: #000; border: none; padding: 14px 30px; border-radius: 50px; font-weight: 900; cursor: pointer; letter-spacing: 1px; }
        .btn-transmit:hover { background: var(--cyan); box-shadow: 0 0 25px var(--cyan); transform: scale(1.05); }

        /* SIDEBAR BLOCKS */
        .sidebar-block { background: var(--glass); border: 1px solid var(--border); border-radius: 28px; padding: 25px; margin-bottom: 25px; backdrop-filter: blur(20px); }
        .feedback-input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid #333; border-radius: 15px; color: #fff; padding: 15px; font-size: 13px; margin-top: 12px; outline: none; resize: none; }
        
        .create-btn { display: block; width: 100%; background: linear-gradient(45deg, var(--p), var(--v)); color: #fff; border: none; padding: 14px; border-radius: 18px; font-size: 12px; font-weight: 900; text-decoration: none; text-align: center; margin-top: 15px; cursor: pointer; text-transform: uppercase; }
        .create-btn:hover { filter: brightness(1.2); box-shadow: 0 0 20px var(--p); transform: scale(1.02); }

        footer { text-align: center; padding: 80px 20px; font-size: 12px; opacity: 0.4; letter-spacing: 2px; line-height: 2; }
    </style>
</head>
<body>
    <div class="stars-container" id="stars"></div>
    
    <div class="top-left-nav">
        <input type="text" class="genz-search" placeholder="Search the void...">
        <div class="nav-row">
            <a href="/dashboard" class="nav-btn-circle" title="Home Feed"><i class="fas fa-rocket"></i></a>
            <a href="/portfolio" class="nav-btn-circle" title="Portfolio"><i class="fas fa-fingerprint"></i></a>
        </div>
    </div>

    <div class="dynamic-island" id="island">
        ${isGuest ? "LURKING IN 4K 💀" : `SECTOR: ${activeSector.toUpperCase()}`}
    </div>

    <div class="dock">
        <i class="fas fa-power-off" style="color:var(--p); cursor:pointer;" onclick="location.href='/logout'"></i>
    </div>

    <div class="main-container">
        <div class="feed">
            <div class="card">
                ${isGuest ? `
                    <div style="text-align:center;">
                        <h2 style="margin-bottom:20px; font-size:14px; opacity:0.6;">AUTHENTICATION REQUIRED</h2>
                        <button class="create-btn" onclick="location.href='/login'">INITIALIZE SYNC (LOGIN)</button>
                    </div>
                ` : `
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" style="width:100%; background:transparent; border:none; color:#fff; outline:none; font-size:20px; min-height:100px;" placeholder="${randomPrompt}" required></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                            <label for="media" style="cursor:pointer; opacity:0.7;"><i class="fas fa-image fa-2x"></i><input type="file" name="media" id="media" hidden></label>
                            <button class="btn-transmit">TRANSMIT</button>
                        </div>
                    </form>
                `}
            </div>
            ${content}
        </div>

        <div class="sidebar">
            <div class="sidebar-block">
                <h4 style="font-size:11px; opacity:0.6; letter-spacing:4px; margin-bottom:22px; text-transform:uppercase;">Communities</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:15px; text-decoration:none; font-weight:900; font-size:15px;">🌏 GLOBAL FEED</a>
                <div style="max-height:300px; overflow-y:auto; padding-right:5px;">
                    ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#ddd; font-size:14px; text-decoration:none; margin-top:12px; opacity:0.8;"># ${s.name.toUpperCase()}</a>`).join('')}
                </div>
                <button class="create-btn" onclick="let n=prompt('New Community Name?'); if(n) location.href='/create-sector?name='+n">
                    + NEW COMMUNITY
                </button>
            </div>

            <div class="sidebar-block">
                <h4 style="font-size:11px; opacity:0.6; letter-spacing:4px; text-transform:uppercase;">Feedback Loop</h4>
                <textarea class="feedback-input" id="feedText" rows="3" placeholder="Drop lore or report bugs..."></textarea>
                <button class="create-btn" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid var(--border);" onclick="alert('Signal sent to xavirox.co@gmail.com')">
                    Submit Signal
                </button>
            </div>
        </div>
    </div>

    <footer>
        XAVIROX COSMIC OS V47 | 2026<br>
        <span style="opacity:0.6; font-size:10px;">CORE CONTACT: xavirox.co@gmail.com</span><br>
        <span style="opacity:0.4; font-size:9px;">ESTABLISHED FOR THE ELITE | NO BUGS ALLOWED</span>
    </footer>

    <script>
        const container = document.getElementById('stars');
        for(let i=0; i<180; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2.8;
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
    const html = posts.map(p => `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="color:var(--cyan); font-size:16px;">@${p.author}</b>
                <span style="font-size:11px; opacity:0.4; background:rgba(255,255,255,0.08); padding:5px 12px; border-radius:12px;">#${p.sector}</span>
            </div>
            <p style="margin-top:20px; font-size:17px; line-height:1.7; color:#f5f5f5;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:25px; margin-top:25px; border:1px solid var(--border); box-shadow: 0 15px 40px rgba(0,0,0,0.6);">` : ''}
        </div>
    `).join('');
    res.send(MASTER_UI(html || '<div class="card" style="text-align:center; opacity:0.4; padding:60px;">The cosmic void is silent...</div>', req.session.user, sectors, activeSector));
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
    if (name) { try { await new Sector({ name }).save(); } catch(e) {} }
    res.redirect('/dashboard?sector=' + (name || 'Global'));
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><form action="/login" method="POST" style="background:rgba(255,255,255,0.04); padding:60px; border-radius:45px; border:1px solid rgba(255,255,255,0.15); text-align:center; backdrop-filter:blur(30px); box-shadow:0 20px 50px rgba(0,0,0,0.8);"> <h1 style="letter-spacing:8px; margin-bottom:40px; font-weight:900;">XAVIROX</h1> <input name="username" placeholder="IDENTITY" required style="display:block; margin:20px auto; padding:18px; width:300px; background:#111; border:2px solid #333; color:#fff; border-radius:20px; outline:none; font-size:15px;"> <input name="password" type="password" placeholder="ACCESS KEY" required style="display:block; margin:20px auto; padding:18px; width:300px; background:#111; border:2px solid #333; color:#fff; border-radius:20px; outline:none; font-size:15px;"> <button style="padding:18px 70px; border-radius:50px; background:#fff; color:#000; font-weight:900; border:none; cursor:pointer; margin-top:30px; letter-spacing:2px;">SYNC</button> </form></body>`);
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