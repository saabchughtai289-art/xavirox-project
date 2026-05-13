// ==========================================
// 🌌 XAVIROX CORE ENGINE - VER 15.0 (SUPREME)
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const app = express();

// --- 1. DATABASE & SCHEMAS ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI).then(() => console.log('🌌 [SYNCED]: NEURAL LINK ACTIVE'));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }],
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: String, mediaType: String,
    isAnonymous: { type: Boolean, default: false },
    sector: { type: String, default: 'General' },
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    createdBy: String
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Sector = mongoose.model('Sector', SectorSchema);

// --- 2. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({
    secret: 'xavirox_cat_vibe_2026',
    resave: false, saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const upload = multer({ storage: multer.memoryStorage() });

const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.send(`<script>alert('Neural ID Required!'); window.location='/login';</script>`);
};

// --- 3. THE MASTER UI TEMPLATE ---
const MASTER_UI = (content, user, sectors) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | Event Horizon</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap" rel="stylesheet">
    <style>
        :root { --p: #ff007f; --b: #007AFF; --v: #7000ff; --glass: rgba(255, 255, 255, 0.05); --border: rgba(255, 255, 255, 0.1); }
        * { box-sizing: border-box; margin: 0; padding: 0; transition: 0.3s; }
        body { background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
        
        /* Cosmic Background */
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: #000; border-radius: 50%; box-shadow: 0 0 100px var(--v), 0 0 200px var(--p); z-index: -5; opacity: 0.3; filter: blur(80px); }
        
        /* Side Dock */
        .side-dock { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); width: 70px; background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 50px; display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 40px; z-index: 1000; }
        .side-dock i { font-size: 22px; color: #666; cursor: pointer; }
        .side-dock i:hover { color: var(--p); transform: scale(1.2); }

        .nav { position: fixed; top: 0; width: 100%; height: 80px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: space-between; padding: 0 50px 0 120px; z-index: 900; border-bottom: 1px solid var(--border); }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: 5px; color: var(--p); cursor: pointer; }

        .main-wrapper { display: flex; max-width: 1200px; margin: 100px auto 100px 120px; gap: 30px; padding: 20px; }
        .feed-container { flex: 2; }
        .sidebar { flex: 1; position: sticky; top: 100px; height: fit-content; }

        .card { background: var(--glass); border-radius: 25px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); backdrop-filter: blur(10px); }
        textarea { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 15px; color: #fff; padding: 15px; resize: none; outline: none; }
        .primary-btn { background: var(--p); color: #fff; border: none; padding: 12px 25px; border-radius: 50px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .post-media { width: 100%; border-radius: 15px; margin-top: 15px; }

        /* Community Tags */
        .tag { display: inline-block; padding: 5px 12px; background: var(--v); border-radius: 10px; font-size: 11px; margin-bottom: 10px; }
        
        @media (max-width: 900px) { .main-wrapper { margin-left: 10px; flex-direction: column; } .side-dock { bottom: 10px; top: auto; left: 50%; transform: translateX(-50%); flex-direction: row; width: 90%; height: 60px; justify-content: space-around; padding: 0; } }
    </style>
</head>
<body>
    <div class="black-hole"></div>
    <div class="side-dock">
        <i class="fas fa-home" onclick="location.href='/'"></i>
        <i class="fas fa-users" onclick="alert('Join Sectors below!')"></i>
        <div style="width:40px; height:40px; background:var(--p); border-radius:50%; display:flex; align-items:center; justify-content:center;" onclick="window.scrollTo(0,0)"><i class="fas fa-plus" style="color:white;"></i></div>
        <i class="fas fa-comment-dots"></i>
        ${user ? `<i class="fas fa-sign-out-alt" onclick="location.href='/logout'"></i>` : `<i class="fas fa-key" onclick="location.href='/login'"></i>`}
    </div>

    <nav class="nav">
        <div class="logo" onclick="location.href='/'">XAVIROX</div>
        <div>${user ? '@' + user.username : 'Guest'}</div>
    </nav>

    <div class="main-wrapper">
        <div class="feed-container">
            <div class="card">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" id="postInput" placeholder="Wait... you thinking?" ${user ? '' : 'disabled'}></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                        <input type="file" name="media" id="mFile" hidden>
                        <i class="fas fa-image" onclick="document.getElementById('mFile').click()" style="cursor:pointer; font-size:20px; color:var(--b)"></i>
                        <select name="sector" style="background:#111; color:white; border:1px solid var(--border); border-radius:5px; padding:5px;">
                            <option value="General">General Sector</option>
                            ${sectors.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                        </select>
                        <button class="primary-btn">TRANSMIT</button>
                    </div>
                </form>
            </div>
            ${content}
        </div>

        <div class="sidebar">
            <div class="card">
                <h3>🛰️ SECTORS</h3>
                <div style="margin: 15px 0;">
                    ${sectors.map(s => `<div style="padding:10px; background:rgba(255,255,255,0.05); border-radius:10px; margin-bottom:5px;"># ${s.name}</div>`).join('')}
                </div>
                <form action="/addsector" method="POST">
                    <input name="sName" placeholder="New Sector Name" style="width:100%; padding:10px; border-radius:10px; background:#000; border:1px solid var(--border); color:white;">
                    <button class="primary-btn" style="width:100%; background:var(--b);">CREATE COMMUNITY</button>
                </form>
            </div>
            
            <div class="card">
                <h3>✉️ FEEDBACK</h3>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Tell Xavi..."></textarea>
                    <button class="primary-btn" style="width:100%;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
`;

// --- 4. ROUTES ---
app.get('/', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const sectors = await Sector.find();
    const user = req.session.user;
    
    const html = posts.map(p => `
        <div class="card">
            <span class="tag">${p.sector}</span>
            <div style="font-weight:bold; color:var(--p); margin-bottom:10px;">@${p.isAnonymous ? 'Ghost' : p.author}</div>
            <p>${p.content}</p>
            ${p.mediaUrl ? (p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`) : ''}
        </div>
    `).join('');
    
    res.send(MASTER_UI(html, user, sectors));
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl, mediaType: req.file ? req.file.mimetype : null }).save();
    res.redirect('/');
});

app.post('/addsector', isAuth, async (req, res) => {
    try { await new Sector({ name: req.body.sName.replace(/\s+/g, '_'), createdBy: req.session.user.username }).save(); } catch(e){}
    res.redirect('/');
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } });
    res.send("<script>alert('Transmitted!'); window.location='/';</script>");
});

// --- 5. INTERESTING LOGIN PAGE (WITH PRIVACY CAT) ---
app.get('/login', (req, res) => {
    res.send(`
    <style>
        body { background:#000; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; overflow:hidden; }
        .login-box { background:#111; padding:40px; border-radius:30px; width:350px; text-align:center; position:relative; border:1px solid #333; }
        
        /* The Cat */
        .cat-container { width:100px; height:100px; margin:0 auto 20px; position:relative; }
        .cat { font-size:60px; transition: 0.5s ease-in-out; display:inline-block; }
        .cat.hide { transform: rotateY(180deg); filter: grayscale(1); }
        
        input { width:100%; padding:15px; margin:10px 0; border-radius:10px; border:1px solid #333; background:#000; color:white; outline:none; }
        button { width:100%; padding:15px; border-radius:50px; border:none; background:#ff007f; color:white; font-weight:bold; cursor:pointer; }
    </style>
    <div class="login-box">
        <div class="cat-container">
            <div id="cat" class="cat">🐱</div>
        </div>
        <h2>AUTHORIZE</h2>
        <form action="/login" method="POST">
            <input name="username" placeholder="Username" onfocus="look()" required>
            <input name="password" type="password" placeholder="Password" onfocus="hide()" required>
            <button>ENTER THE VOID</button>
        </form>
    </div>
    <script>
        const cat = document.getElementById('cat');
        function look() { cat.classList.remove('hide'); cat.innerText = '😺'; }
        function hide() { cat.classList.add('hide'); cat.innerText = '🙈'; }
    </script>
    `);
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/');
    } else res.send("<script>alert('Failed!'); window.location='/login';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

app.listen(3000, () => console.log('🚀 XAVIROX SUPREME LIVE'));