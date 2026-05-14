/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - VERSION 40.0 [ULTRA-EXPANSION]
    STATUS: TITAN STABLE | FULL FEATURES RESTORED | VERCEL OPTIMIZED
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

// --- [DATABASE CACHING] ---
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(dbURI, { bufferCommands: false });
        isConnected = true;
    } catch (err) { console.error('❌ DB ERROR:', err); }
};

// --- [SCHEMAS] ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    pfp: { type: String, default: "" },
    bio: { type: String, default: "Inhabitant of the Xavirox Cosmos." },
    aura: { type: Number, default: 100 },
    rank: { type: String, default: "Cosmic Citizen" },
    skills: { type: [String], default: ["Gen-Z", "Xaviroxian", "Web Dev"] }
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    sector: { type: String, default: 'Global' },
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({ 
    name: { type: String, required: true, unique: true, lowercase: true },
    createdBy: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Sector = mongoose.models.Sector || mongoose.model('Sector', SectorSchema);

// --- [MIDDLEWARE] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Optimized Session (No more 500 crashes)
app.use(session({ 
    secret: 'xavirox_ultra_core_2026', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production' } 
}));

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

// --- [MASTER UI ENGINE - COSMIC BLACKHOLE] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global', isPortfolio = false) => {
    const isGuest = !user;
    const islandText = isGuest ? "LURKER MODE ENABLED 👁️" : `SYNCED: @${user.username.toUpperCase()}`;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;800&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000; --glass: rgba(255, 255, 255, 0.03); --border: rgba(255, 255, 255, 0.08); }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
        body { background: var(--bg); color: #fff; overflow-x: hidden; min-height: 100vh; }
        .cosmic-void { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -10; pointer-events: none; }
        .black-hole-core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 220px; height: 220px; background: #000; border-radius: 50%; box-shadow: 0 0 80px 20px var(--v), 0 0 150px 40px var(--p); }
        .accretion-disk { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotateX(70deg); width: 550px; height: 550px; border: 3px solid var(--cyan); border-radius: 50%; animation: spin 8s linear infinite; box-shadow: 0 0 40px var(--cyan); }
        @keyframes spin { from { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(0deg); } to { transform: translate(-50%, -50%) rotateX(70deg) rotateZ(360deg); } }
        .island-nav { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 380px; height: 50px; background: rgba(0,0,0,0.85); backdrop-filter: blur(30px); border-radius: 100px; border: 1px solid var(--border); border-top: 2px solid var(--p); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .dock { position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 70px; background: var(--glass); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 100px; display: flex; flex-direction: column; padding: 40px 0; gap: 35px; align-items: center; z-index: 1000; }
        .dock i { font-size: 22px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .dock i:hover { color: var(--cyan); transform: scale(1.3); text-shadow: 0 0 15px var(--cyan); }
        .main-container { max-width: 1100px; margin: 120px auto 50px 140px; display: flex; gap: 40px; }
        .feed-engine { flex: 2; }
        .side-panel { flex: 1; position: sticky; top: 120px; height: fit-content; }
        .card { background: var(--glass); backdrop-filter: blur(60px); border: 1px solid var(--border); border-radius: 40px; padding: 30px; margin-bottom: 30px; }
        .cosmic-input { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 20px; color: #fff; padding: 18px; outline: none; }
        .btn-transmit { background: #fff; color: #000; border: none; padding: 12px 35px; border-radius: 50px; font-weight: 800; cursor: pointer; }
        .btn-transmit:hover { background: var(--cyan); box-shadow: 0 0 30px var(--cyan); }
        .pfp-orbit { width: 120px; height: 120px; border-radius: 45px; border: 4px solid var(--p); object-fit: cover; }
        a { text-decoration: none; color: inherit; }
    </style>
</head>
<body>
    <div class="cosmic-void"><div class="accretion-disk"></div><div class="black-hole-core"></div></div>
    <div class="island-nav"><div class="island-text" style="font-family:'Space Grotesk'; font-weight:700; letter-spacing:2px; font-size:12px;">${islandText}</div></div>
    <div class="dock">
        <i class="fas fa-rocket" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fingerprint" onclick="location.href='/portfolio'"></i>
        <i class="fas fa-atom" onclick="document.getElementById('sector-modal').style.display='flex'"></i>
        <i class="fas fa-power-off" style="margin-top:auto; color:var(--p);" onclick="location.href='/logout'"></i>
    </div>

    <div class="main-container">
        <div class="feed-engine">
            ${isGuest ? `<div class="card" style="text-align:center;"><button class="btn-transmit" onclick="location.href='/login'">SYNC IDENTITY</button></div>` : 
            (isPortfolio ? content : `
                <div class="card">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" class="cosmic-input" style="height:100px;" placeholder="Transmit your thoughts, Boss..." required></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; margin-top:20px;">
                            <label style="cursor:pointer; opacity:0.6;"><i class="fas fa-image fa-lg"></i><input type="file" name="media" hidden></label>
                            <button class="btn-transmit">TRANSMIT</button>
                        </div>
                    </form>
                </div>
                ${content}
            `)}
        </div>
        <div class="side-panel">
            <div class="card">
                <h4 style="font-size:11px; opacity:0.5; margin-bottom:20px; letter-spacing:2px;">OMNI-SECTORS</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:15px;">🌏 GLOBAL VOID</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; margin-bottom:10px; font-size:14px;"># ${s.name.toUpperCase()}</a>`).join('')}
            </div>
        </div>
    </div>

    <div id="sector-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; display:none; align-items:center; justify-content:center;">
        <div class="card" style="width:400px; background:#000;">
            <form action="/create-sector" method="POST">
                <input name="name" class="cosmic-input" placeholder="Sector Name" required style="margin-bottom:20px;">
                <button class="btn-transmit">INITIALIZE</button>
                <button type="button" class="btn-transmit" style="background:#222; color:#fff;" onclick="document.getElementById('sector-modal').style.display='none'">CANCEL</button>
            </form>
        </div>
    </div>
</body></html>`;
};

// --- [CORE LOGIC] ---
app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    const posts = await Post.find(activeSector !== 'Global' ? { sector: activeSector } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    
    const htmlContent = posts.map(p => `
        <div class="card">
            <span style="color:var(--cyan); font-weight:900;">@${p.author} <span style="font-size:10px; background:rgba(255,255,255,0.1); padding:4px 10px; border-radius:50px; margin-left:10px;">#${p.sector}</span></span>
            <p style="margin-top:15px; font-size:16px; line-height:1.6;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:25px; margin-top:20px; border:1px solid var(--border);">` : ''}
        </div>
    `).join('') || `<div class="card" style="text-align:center;">The void is silent.</div>`;

    res.send(MASTER_UI(htmlContent, req.session.user, sectors, activeSector));
});

app.get('/portfolio', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const u = await User.findOne({ username: req.session.user.username });
    const html = `
        <div class="card" style="text-align:center;">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}" class="pfp-orbit">
            <h1 style="margin-top:20px;">@${u.username}</h1>
            <div style="background:linear-gradient(45deg, var(--v), var(--p)); display:inline-block; padding:8px 25px; border-radius:50px; font-weight:900; margin-top:15px;">AURA: ${u.aura}</div>
            <p style="margin-top:20px; opacity:0.7;">${u.bio}</p>
        </div>`;
    res.send(MASTER_UI(html, u, [], 'Identity', true));
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    await User.findOneAndUpdate({ username: req.session.user.username }, { $inc: { aura: 10 } });
    res.redirect('back');
});

app.post('/create-sector', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const name = req.body.name.toLowerCase();
    const exists = await Sector.findOne({ name });
    if (!exists) await new Sector({ name, createdBy: req.session.user.username }).save();
    res.redirect('/dashboard?sector=' + name);
});

app.get('/login', (req, res) => {
    res.send(`<!DOCTYPE html><body style="background:#000; color:#fff; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <div style="width:320px; text-align:center;">
            <h1 style="letter-spacing:5px;">XAVIROX</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="IDENTITY ID" required style="width:100%; padding:15px; margin:20px 0; border-radius:10px; background:#111; border:1px solid #333; color:#fff;">
                <input name="password" type="password" placeholder="SECURITY KEY" required style="width:100%; padding:15px; margin-bottom:20px; border-radius:10px; background:#111; border:1px solid #333; color:#fff;">
                <button style="width:100%; padding:15px; border-radius:50px; background:#fff; font-weight:800; cursor:pointer;">SYNC</button>
            </form>
        </div></body>`);
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
    } else res.send("Key Mismatch.");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;