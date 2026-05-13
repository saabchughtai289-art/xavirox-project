const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer'); 
const app = express();

// --- 1. CONFIGURATION & DATABASE CONNECTION ---
// Connection string for MongoDB Atlas
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log('🌌 COSMIC CORE: ONLINE'))
    .catch(err => console.error('💥 NEURAL COLLAPSE:', err));

// --- 2. DATA SCHEMAS ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    portfolioUrl: { type: String, default: 'https://xavirox.com' },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }]
});

const PostSchema = new mongoose.Schema({
    author: String,
    content: { type: String, required: true },
    mediaUrl: String,      // Stores Base64 for images/videos
    mediaType: String,     // 'image/png', 'video/mp4' etc.
    votes: { type: Number, default: 0 },
    votedBy: [String],
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// --- 3. MIDDLEWARES & FILE HANDLING ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'xavirox_nebula_ultra_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Multer setup for handling media uploads (15MB Limit)
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } }); 

// Middleware to protect routes
const isAuthAction = (req, res, next) => {
    if (req.session.user) return next();
    res.send("<script>alert('Neural ID required for this action!'); window.location='/login';</script>");
};

// --- 4. THE MASTER UI (Universe Theme with Planets & Milky Way) ---
const MASTER_UI = (content, user, isOwner) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    <title>XAVIROX | Universe</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --b: #007AFF; --glass: rgba(255,255,255,0.08); --border: rgba(255,255,255,0.15); }
        * { box-sizing: border-box; scroll-behavior: smooth; }
        body { margin: 0; background: #000; color: white; font-family: -apple-system, sans-serif; overflow-x: hidden; }
        
        /* COSMIC BACKGROUND ASSETS */
        .universe-bg { position: fixed; top: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 50%, #1a0136 0%, #050010 100%); z-index: -3; }
        .milky-way { position: fixed; top: 0; width: 100%; height: 100%; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.4; z-index: -2; animation: drift 300s linear infinite; }
        .planet { position: fixed; width: 250px; height: 250px; background: radial-gradient(circle at 30% 30%, #4facfe 0%, #00f2fe 100%); border-radius: 50%; top: 15%; right: -60px; opacity: 0.15; z-index: -1; box-shadow: -30px -30px 60px rgba(0,0,0,0.8) inset; filter: blur(2px); }
        .asteroid { position: fixed; width: 60px; height: 40px; background: #444; clip-path: polygon(25% 0%, 75% 0%, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0% 30%); opacity: 0.2; top: 35%; left: 8%; z-index: -1; animation: rock 25s infinite linear; }
        
        @keyframes drift { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }
        @keyframes rock { from { transform: rotate(0deg) translate(0,0); } to { transform: rotate(360deg) translate(15px, 15px); } }

        .nav { position: fixed; top: 0; width: 100%; height: 70px; background: rgba(0,0,0,0.85); backdrop-filter: blur(25px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; z-index: 1000; }
        .logo { font-size: 26px; font-weight: 900; background: linear-gradient(to right, var(--p), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 3px; cursor: pointer; }
        
        .main-wrapper { display: flex; max-width: 1200px; margin: 90px auto; padding: 0 20px 120px; gap: 30px; }
        .feed-container { flex: 2; min-width: 0; }
        .sidebar-container { flex: 1; min-width: 320px; }
        
        .card { background: var(--glass); border-radius: 30px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); backdrop-filter: blur(30px); transition: 0.3s; }
        .avatar { width: 55px; height: 55px; background: linear-gradient(45deg, var(--p), var(--b)); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #000; font-size: 20px; }
        .blue-tick { color: var(--b); font-size: 14px; margin-left: 8px; }
        
        textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 20px; color: white; padding: 18px; font-size: 16px; outline: none; resize: none; }
        .primary-btn { background: white; color: black; border: none; padding: 12px 25px; border-radius: 50px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .primary-btn:hover { transform: scale(1.05); background: var(--p); color: white; }

        /* Media Elements */
        .upload-area { margin-top: 15px; display: flex; align-items: center; gap: 15px; }
        .file-label { background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 15px; cursor: pointer; font-size: 14px; border: 1px dashed var(--border); }
        .post-media { width: 100%; border-radius: 20px; margin-top: 15px; border: 1px solid var(--border); max-height: 500px; object-fit: cover; }

        .action-row { display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 15px; }
        .action-btn { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 19px; cursor: pointer; display: flex; align-items: center; gap: 8px; }

        .tab-bar { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 450px; background: rgba(0,0,0,0.85); backdrop-filter: blur(35px); border-radius: 40px; border: 1px solid var(--border); display: flex; justify-content: space-around; padding: 20px; z-index: 1000; }
        .tab-bar i { font-size: 24px; color: rgba(255,255,255,0.4); cursor: pointer; }
        
        @media (max-width: 950px) { .main-wrapper { flex-direction: column; } .sidebar-container { order: -1; } }
    </style>
</head>
<body>
    <div class="universe-bg"></div><div class="milky-way"></div><div class="planet"></div><div class="asteroid"></div>
    
    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        ${!user ? `<button onclick="location.href='/login'" class="primary-btn" style="background:var(--p); color:white;">SIGN IN</button>` : ''}
    </nav>

    <div class="main-wrapper">
        <div class="feed-container">
            ${user ? `
            <div class="card">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" placeholder="Sync your vibe with the nebula..." required></textarea>
                    <div class="upload-area">
                        <label class="file-label"><i class="fas fa-file-upload"></i> Media <input type="file" name="media" hidden accept="image/*,video/*"></label>
                        <button type="submit" class="primary-btn" style="background:var(--p); color:white; margin-left:auto;">TRANSMIT</button>
                    </div>
                </form>
            </div>` : `
            <div class="card" style="text-align:center; border:1px solid var(--b);">
                <h2 style="color:var(--b);">Spectator Mode</h2>
                <p>Login to broadcast images, videos, and signals.</p>
                <button class="primary-btn" onclick="location.href='/signup'">SYNC ENTITY</button>
            </div>`}
            <div id="feed-flow">${content}</div>
        </div>

        <div class="sidebar-container">
            <div class="card">
                <div style="color:var(--p); font-weight:900; margin-bottom:15px;"><i class="fas fa-meteor"></i> COMMAND CENTER</div>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Message Xavi..." style="height:80px;"></textarea>
                    <button class="primary-btn" style="width:100%; margin-top:10px;">SIGNAL</button>
                </form>
                ${isOwner ? `
                <div style="margin-top:25px; border-top:1px solid var(--p); padding-top:20px;">
                    <div style="color:var(--b); font-weight:900; margin-bottom:10px;">MASTER LOGS</div>
                    <div style="max-height:200px; overflow-y:auto; font-size:13px;">
                        ${user.adminMessages.slice().reverse().map(m => `<div style="margin-bottom:8px; border-left:2px solid var(--p); padding-left:8px;"><b>@${m.from}:</b> ${m.text}</div>`).join('')}
                    </div>
                </div>` : ''}
            </div>
        </div>
    </div>

    <div class="tab-bar">
        <i class="fas fa-home" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-video"></i>
        <i class="fas fa-plus-circle" style="color:var(--p); font-size:30px;" onclick="window.scrollTo(0,0)"></i>
        <i class="fas fa-user-astronaut"></i>
        ${user ? `<i class="fas fa-sign-out-alt" onclick="location.href='/logout'"></i>` : `<i class="fas fa-key" onclick="location.href='/login'"></i>`}
    </div>

    <script>
        async function vote(id, type) {
            const res = await fetch('/api/vote/'+id, { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({type}) 
            });
            const data = await res.json();
            if(data.success) document.getElementById('v-'+id).innerText = data.newVotes;
            else if(data.error === 'auth') window.location.href = '/login';
        }
    </script>
</body>
</html>`;

// --- 5. SERVER ROUTES ---

// Dashboard - Display all posts
app.get('/dashboard', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const user = req.session.user ? await User.findById(req.session.user._id) : null;
    
    const postHTML = posts.map(p => {
        const isXavi = p.author.toLowerCase() === 'xavi' || p.author.toLowerCase() === 'xavirox';
        let mediaTag = '';
        if (p.mediaUrl) {
            if (p.mediaType && p.mediaType.includes('video')) {
                mediaTag = `<video src="${p.mediaUrl}" class="post-media" controls></video>`;
            } else {
                mediaTag = `<img src="${p.mediaUrl}" class="post-media">`;
            }
        }

        return `
        <div class="card">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                <div class="avatar" style="${isXavi ? 'border:2px solid var(--p)' : ''}">${p.author[0].toUpperCase()}</div>
                <div style="font-weight:900; font-size:17px; display:flex; align-items:center;">
                    @${p.author} ${isXavi ? '<i class="fas fa-certificate blue-tick"></i>' : ''}
                </div>
            </div>
            <div style="font-size:17px; line-height:1.6; opacity:0.9;">${p.content}</div>
            ${mediaTag}
            <div class="action-row">
                <button class="action-btn" onclick="vote('${p._id}', 'up')"><i class="fas fa-heart"></i> <span id="v-${p._id}">${p.votes}</span></button>
                <i class="fas fa-paper-plane" onclick="navigator.clipboard.writeText(window.location.href); alert('Portal Link Copied!')" style="cursor:pointer; opacity:0.5;"></i>
            </div>
        </div>`;
    }).join('');

    res.send(MASTER_UI(postHTML, user, user?.username === 'xavi'));
});

// Post creation with Media support
app.post('/addpost', isAuthAction, upload.single('media'), async (req, res) => {
    let mediaUrl = '';
    let mediaType = '';
    if (req.file) {
        const base64Data = req.file.buffer.toString('base64');
        mediaUrl = `data:${req.file.mimetype};base64,${base64Data}`;
        mediaType = req.file.mimetype;
    }
    await new Post({ 
        author: req.session.user.username, 
        content: req.body.content,
        mediaUrl, mediaType
    }).save();
    res.redirect('/dashboard');
});

// Vote API
app.post('/api/vote/:id', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, error: 'auth' });
    const post = await Post.findById(req.params.id);
    if (!post.votedBy.includes(req.session.user.username)) {
        post.votes += 1;
        post.votedBy.push(req.session.user.username);
        await post.save();
        res.json({ success: true, newVotes: post.votes });
    } else { res.json({ success: false }); }
});

// Feedback to Xavi
app.post('/send-feedback', isAuthAction, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { 
        $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
    });
    res.send("<script>alert('Signal Transmitted!'); window.location='/dashboard';</script>");
});

// --- AUTHENTICATION ---
app.post('/signup', async (req, res) => {
    try {
        const user = req.body.username.toLowerCase().trim();
        // Protection for creator name
        if(['xavi', 'xavirox', 'admin', 'official'].includes(user)) {
            return res.send("<script>alert('Reserved ID!'); window.location='/signup';</script>");
        }
        const existing = await User.findOne({ $or: [{username: user}, {email: req.body.email.toLowerCase()}] });
        if(existing) return res.send("<script>alert('ID or Email already in use!'); window.location='/signup';</script>");
        
        const hashed = await bcrypt.hash(req.body.password, 10);
        await new User({ username: user, email: req.body.email.toLowerCase(), password: hashed }).save();
        res.redirect('/login');
    } catch(e) { res.send("<script>alert('Error in Sync!'); window.location='/signup';</script>"); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else { res.send("<script>alert('Invalid Access Key!'); window.location='/login';</script>"); }
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <div style="background:rgba(255,255,255,0.05); padding:50px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); width:350px; text-align:center; backdrop-filter:blur(20px);">
            <h1 style="background:linear-gradient(to right, #ff007f, #007AFF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:35px; font-weight:900;">XAVIROX</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; border:none; background:rgba(255,255,255,0.1); color:white; outline:none;" required>
                <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; border:none; background:rgba(255,255,255,0.1); color:white; outline:none;" required>
                <button style="width:100%; padding:15px; border-radius:50px; border:none; background:white; font-weight:900; cursor:pointer;">INITIALIZE</button>
            </form>
            <p style="font-size:12px; margin-top:20px; opacity:0.5;">New Entity? <a href="/signup" style="color:#ff007f; text-decoration:none;">Sync Now</a></p>
        </div>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <div style="background:rgba(255,255,255,0.05); padding:40px; border-radius:40px; border:1px solid #007AFF; width:350px; text-align:center;">
            <h2 style="color:#007AFF; font-weight:900;">CREATE ENTITY</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Choose ID" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;" required>
                <input name="email" type="email" placeholder="Neural Email" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;" required>
                <input name="password" type="password" placeholder="Set Key" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;" required>
                <button style="width:100%; padding:15px; border-radius:50px; border:none; background:#007AFF; color:white; font-weight:900; cursor:pointer;">SYNC DATA</button>
            </form>
            <a href="/login" style="color:white; font-size:11px; text-decoration:none; display:block; margin-top:20px; opacity:0.5;">Back to Login</a>
        </div>
    </body>`);
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 XAVIROX SUPREME CORE LIVE ON PORT ${PORT}`));