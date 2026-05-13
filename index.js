const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// --- 1. CONFIGURATION & DATABASE SYNC ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('🌌 COSMIC CORE: ONLINE'))
    .catch(err => console.error('💥 NEURAL COLLAPSE:', err));

// --- 2. SCHEMAS ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    portfolioUrl: { type: String, default: 'https://xavirox.com' },
    adminMessages: [{ 
        from: String, 
        text: String, 
        at: { type: Date, default: Date.now } 
    }]
});

const PostSchema = new mongoose.Schema({
    author: String,
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    votedBy: [String],
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// --- 3. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'xavirox_nebula_ultra_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- 4. MASTER UI COMPONENTS ---
const MASTER_UI = (content, user, isOwner) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    <title>XAVIROX | Universe Control</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --b: #007AFF; --glass: rgba(255,255,255,0.08); --border: rgba(255,255,255,0.15); }
        * { box-sizing: border-box; scroll-behavior: smooth; }
        body { margin: 0; background: #000; color: white; font-family: -apple-system, sans-serif; overflow-x: hidden; }
        .universe-bg { position: fixed; top: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 0%, #1a0136 0%, #000 80%); z-index: -2; }
        .stars { position: fixed; top: 0; width: 100%; height: 100%; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.3; z-index: -1; animation: drift 200s linear infinite; }
        @keyframes drift { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }
        .nav { position: fixed; top: 0; width: 100%; height: 70px; background: rgba(0,0,0,0.8); backdrop-filter: blur(25px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; z-index: 1000; }
        .logo { font-size: 26px; font-weight: 900; background: linear-gradient(to right, var(--p), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 3px; }
        .main-wrapper { display: flex; max-width: 1200px; margin: 90px auto; padding: 0 20px 120px; gap: 30px; }
        .feed-container { flex: 2; min-width: 0; }
        .sidebar-container { flex: 1; min-width: 320px; }
        .card { background: var(--glass); border-radius: 30px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); backdrop-filter: blur(30px); transition: 0.4s; }
        .avatar { width: 55px; height: 55px; background: linear-gradient(45deg, var(--p), var(--b)); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; color: #000; }
        .blue-tick { color: var(--b); font-size: 14px; margin-left: 8px; }
        textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 20px; color: white; padding: 18px; font-size: 16px; outline: none; resize: none; margin-bottom: 15px; }
        .primary-btn { background: white; color: black; border: none; padding: 14px 30px; border-radius: 50px; font-weight: 900; cursor: pointer; transition: 0.3s; text-transform: uppercase; }
        .primary-btn:hover { background: var(--p); color: white; }
        .action-row { display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 10px; }
        .action-btn { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 19px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .tab-bar { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 450px; background: rgba(0,0,0,0.8); backdrop-filter: blur(35px); border-radius: 40px; border: 1px solid var(--border); display: flex; justify-content: space-around; padding: 20px; z-index: 1000; }
        .tab-bar i { font-size: 24px; color: rgba(255,255,255,0.4); cursor: pointer; transition: 0.3s; }
        .tab-bar i:hover { color: var(--p); }
        @media (max-width: 950px) { .main-wrapper { flex-direction: column; } .sidebar-container { order: -1; } }
    </style>
</head>
<body>
    <div class="universe-bg"></div><div class="stars"></div>
    <nav class="nav"><div class="logo">XAVIROX</div></nav>
    <div class="main-wrapper">
        <div class="feed-container">
            <div class="card">
                <form action="/addpost" method="POST">
                    <textarea name="content" placeholder="Drop your neural vibe..." required></textarea>
                    <button type="submit" class="primary-btn" style="float:right;">TRANSMIT</button>
                    <div style="clear:both;"></div>
                </form>
            </div>
            <div>${content}</div>
        </div>
        <div class="sidebar-container">
            <div class="card">
                <h3 style="color:var(--p);"><i class="fas fa-shield-alt"></i> SUPPORT</h3>
                <p style="font-size:13px; opacity:0.6;">Contact: xavirox.co@gmail.com</p>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Private message to Xavi..." style="height:80px;"></textarea>
                    <button class="primary-btn" style="width:100%;">SEND SIGNAL</button>
                </form>
                ${isOwner ? `
                    <div style="margin-top:30px; border-top:2px solid var(--p); padding-top:20px;">
                        <h4 style="color:var(--b);">MASTER LOGS</h4>
                        <div style="max-height:300px; overflow-y:auto;">
                            ${user.adminMessages.length > 0 ? user.adminMessages.slice().reverse().map(m => `
                                <div style="font-size:12px; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; margin-bottom:8px; border-left:3px solid var(--p);">
                                    <b>@${m.from}:</b> ${m.text}
                                </div>
                            `).join('') : '<p style="font-size:12px; opacity:0.4;">No signals received.</p>'}
                        </div>
                    </div>` : ''}
            </div>
        </div>
    </div>
    <div class="tab-bar">
        <i class="fas fa-home" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-plus-circle" style="color:var(--p); font-size:30px;" onclick="window.scrollTo(0,0)"></i>
        <i class="fas fa-user-astronaut" onclick="location.href='${user.portfolioUrl}'"></i>
        <i class="fas fa-sign-out-alt" onclick="location.href='/logout'"></i>
    </div>
</body>
</html>`;

// --- 5. LOGIC ROUTES ---
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        const user = await User.findById(req.session.user._id);
        const postHTML = posts.map(p => `
            <div class="card">
                <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                    <div class="avatar">${p.author[0].toUpperCase()}</div>
                    <div style="font-weight:900;">@${p.author} ${p.author.toLowerCase()==='xavi'?'<i class="fas fa-certificate blue-tick"></i>':''}</div>
                </div>
                <div style="font-size:17px; opacity:0.9;">${p.content}</div>
                <div class="action-row">
                    <button class="action-btn"><i class="fas fa-heart"></i> ${p.votes || 0}</button>
                    <button class="action-btn" onclick="navigator.clipboard.writeText(window.location.origin); alert('Portal Link Copied!')"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>`).join('');
        res.send(MASTER_UI(postHTML, user, user.username === 'xavi'));
    } catch (err) { res.redirect('/logout'); }
});

app.post('/addpost', isAuth, async (req, res) => {
    await new Post({ author: req.session.user.username, content: req.body.content }).save();
    res.redirect('/dashboard');
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } });
    res.send("<script>alert('Signal Transmitted!'); window.location='/dashboard';</script>");
});

// AUTH UI
app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="background:rgba(255,255,255,0.05); padding:50px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); text-align:center; backdrop-filter:blur(20px); width:380px;">
            <h1 style="letter-spacing:5px; background:linear-gradient(to right, #ff007f, #007AFF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:35px; font-weight:900;">XAVIROX</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; background:rgba(255,255,255,0.08); color:white; border:none; outline:none;" required>
                <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; background:rgba(255,255,255,0.08); color:white; border:none; outline:none;" required>
                <button style="width:100%; padding:15px; border-radius:50px; background:white; font-weight:900; cursor:pointer; margin-top:10px; border:none;">INITIALIZE</button>
            </form>
            <p style="font-size:12px; margin-top:20px; opacity:0.6;">New Entity? <a href="/signup" style="color:#ff007f; text-decoration:none; font-weight:bold;">Sync Nebula</a></p>
        </div>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="background:rgba(255,255,255,0.05); padding:50px; border-radius:40px; border:1px solid #007AFF; text-align:center; backdrop-filter:blur(20px); width:380px;">
            <h2 style="color:#007AFF; letter-spacing:3px; font-weight:900;">CREATE ENTITY</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Choose ID" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; background:rgba(255,255,255,0.08); color:white; border:none; outline:none;" required>
                <input name="password" type="password" placeholder="Set Key" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; background:rgba(255,255,255,0.08); color:white; border:none; outline:none;" required>
                <button style="width:100%; padding:15px; border-radius:50px; background:#007AFF; color:white; font-weight:900; cursor:pointer; border:none;">SYNC DATA</button>
            </form>
            <a href="/login" style="color:white; font-size:12px; text-decoration:none; display:block; margin-top:20px; opacity:0.6;">Already synced? Login</a>
        </div>
    </body>`);
});

app.post('/signup', async (req, res) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        await new User({ username: req.body.username.toLowerCase(), password: hashed }).save();
        res.redirect('/login');
    } catch(e) { res.send("<script>alert('ID Taken!'); window.location='/signup';</script>"); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else { res.send("<script>alert('Denied!'); window.location='/login';</script>"); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;