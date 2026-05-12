const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// 1. DATABASE CONNECTION
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(dbURI);
        isConnected = true;
        console.log('✅ NEURAL CORE CONNECTED');
    } catch (err) {
        console.error('❌ DB ERROR:', err);
    }
};

// 2. DATA SCHEMAS
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasBlueTick: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    portfolioUrl: { type: String, default: 'https://xavirox.com' },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: { type: String, default: 'Anonymous' },
    content: String,
    community: { type: String, default: 'Global' },
    votes: { type: Number, default: 0 },
    votedBy: { type: Array, default: [] }, 
    hasBlueTick: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}));

const Community = mongoose.models.Community || mongoose.model('Community', new mongoose.Schema({
    name: { type: String, unique: true },
    creator: String,
    date: { type: Date, default: Date.now }
}));

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', new mongoose.Schema({
    msg: String,
    sender: String,
    date: { type: Date, default: Date.now }
}));

// 3. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(session({
    secret: 'xavirox_2026_super_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false }
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');
app.use(async (req, res, next) => { await connectDB(); next(); });

// 4. FUNNY PLACEHOLDERS
const funnyLines = [
    "Duniya gol hai, lekin ye post square...",
    "Neural network garam hai, kuch phenk ke maro!",
    "Aliens are watching... make it interesting.",
    "Elon Musk ko tag karun kya?",
    "Shhh... secret message broadcast karein.",
    "Mars par signal bhej rahe ho?"
];

// 5. MASTER DASHBOARD (iOS 26 + UNIVERSE UI)
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate('savedPosts');
        const allPosts = await Post.find().sort({ date: -1 });
        const comms = await Community.find();
        const randomLine = funnyLines[Math.floor(Math.random() * funnyLines.length)];

        let postHTML = allPosts.map(p => `
            <div class="ios-card animate-slide" id="post-${p._id}">
                <div class="post-header">
                    <div class="avatar-orbit">${p.author[0].toUpperCase()}</div>
                    <div class="user-info">
                        <span class="user-id">@${p.author} ${p.hasBlueTick ? '<i class="fas fa-check-circle" style="color:#007AFF;"></i>' : ''}</span>
                        <div class="meta">${p.community} • ${new Date(p.date).toLocaleTimeString()}</div>
                    </div>
                    <button onclick="savePost('${p._id}')" class="save-icon"><i class="far fa-bookmark"></i></button>
                </div>
                <div class="post-content">${p.content}</div>
                <div class="ios-actions">
                    <button onclick="handleVote('${p._id}', 'up')"><i class="fas fa-chevron-up"></i> <span class="v-count">${p.votes}</span></button>
                    <button onclick="handleVote('${p._id}', 'down')"><i class="fas fa-chevron-down"></i></button>
                </div>
            </div>`).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    :root { --ios-bg: #000; --ios-blue: #007AFF; --ios-pink: #FF2D55; --glass: rgba(255,255,255,0.06); }
                    body { margin: 0; background: var(--ios-bg); color: white; font-family: -apple-system, system-ui; overflow-x: hidden; }
                    body::before { content: ""; position: fixed; width: 200%; height: 200%; background: radial-gradient(circle at center, #1a1a2e 0%, #000 75%); z-index: -1; animation: rotateGalaxy 120s linear infinite; }
                    @keyframes rotateGalaxy { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                    .navbar { position: fixed; top: 0; width: 100%; height: 65px; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); border-bottom: 0.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 1000; box-sizing: border-box; }
                    .logo { font-size: 22px; font-weight: 900; background: linear-gradient(to right, #ff007f, #007AFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px; }

                    .main-layout { display: flex; justify-content: center; gap: 30px; padding: 85px 15px 30px; max-width: 1200px; margin: auto; }
                    .sidebar { width: 280px; flex-shrink: 0; position: sticky; top: 85px; height: fit-content; display: block; }
                    .feed { width: 100%; max-width: 600px; }

                    .ios-card { background: var(--glass); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 20px; margin-bottom: 15px; backdrop-filter: blur(15px); }
                    .avatar-orbit { width: 45px; height: 45px; background: linear-gradient(45deg, var(--ios-blue), var(--ios-pink)); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; color: #000; }
                    
                    .post-header { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; position: relative; }
                    .user-id { font-weight: 700; font-size: 15px; }
                    .meta { font-size: 11px; opacity: 0.5; }
                    .save-icon { position: absolute; right: 0; background: none; border: none; color: white; opacity: 0.6; }

                    .ios-actions { display: flex; gap: 15px; padding-top: 15px; border-top: 0.5px solid rgba(255,255,255,0.05); }
                    .ios-actions button { background: rgba(255,255,255,0.05); border: none; color: white; padding: 8px 15px; border-radius: 12px; font-size: 13px; display: flex; align-items: center; gap: 6px; }

                    textarea { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; color: white; padding: 15px; font-size: 16px; outline: none; resize: none; }
                    .transmit-btn { background: #fff; color: #000; border: none; padding: 12px 25px; border-radius: 50px; font-weight: 700; float: right; margin-top: 10px; cursor: pointer; transition: 0.3s; }
                    .transmit-btn:hover { background: var(--ios-blue); color: white; }

                    .animate-slide { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                    @media (max-width: 900px) { .sidebar { display: none; } .main-layout { padding-top: 75px; } }
                </style>
            </head>
            <body>
                <nav class="navbar"><div class="logo">XAVIROX</div><a href="/logout" style="color:var(--ios-pink); text-decoration:none; font-weight:bold; font-size:14px;">Disconnect</a></nav>
                <div class="main-layout">
                    <div class="sidebar">
                        <div class="ios-card" style="text-align:center;">
                            <div class="avatar-orbit" style="width:70px; height:70px; margin: 0 auto 15px; font-size:28px;">${user.username[0].toUpperCase()}</div>
                            <div style="font-weight:bold; font-size:18px;">@${user.username}</div>
                            <a href="${user.portfolioUrl}" target="_blank" style="color:var(--ios-blue); display:block; margin:15px 0; text-decoration:none; font-size:13px; font-weight:600;">VISIT PORTFOLIO</a>
                            <form action="/update-portfolio" method="POST">
                                <input name="url" placeholder="New Link..." style="width:100%; padding:8px; background:rgba(0,0,0,0.5); border:1px solid #333; color:white; border-radius:10px; font-size:11px;">
                                <button class="transmit-btn" style="float:none; width:100%; font-size:10px; padding:8px;">UPDATE</button>
                            </form>
                        </div>
                        <div class="ios-card">
                            <h4 style="margin:0 0 10px 0; color:var(--ios-blue); font-size:12px;">COMMUNITIES</h4>
                            <div style="font-size:13px; opacity:0.7;">${comms.map(c => `<div style="margin-bottom:5px;"># ${c.name}</div>`).join('')}</div>
                        </div>
                    </div>
                    <div class="feed">
                        <div class="ios-card">
                            <form action="/addpost" method="POST">
                                <textarea name="content" rows="2" placeholder="${randomLine}" required></textarea>
                                <select name="community" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:8px; border-radius:12px; margin-top:10px; font-size:12px;">
                                    <option value="Global">Global Channel</option>
                                    ${comms.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                                </select>
                                <button type="submit" class="transmit-btn">Transmit</button>
                            </form>
                            <div style="clear:both;"></div>
                        </div>
                        <div id="feed-root">${postHTML}</div>
                    </div>
                </div>
                <script>
                    async function handleVote(id, type) {
                        const res = await fetch('/api/vote/'+id, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type}) });
                        const data = await res.json();
                        if(data.success) document.querySelector('#post-'+id+' .v-count').innerText = data.newVotes;
                    }
                    async function savePost(id) { const res = await fetch('/api/save/'+id, {method: 'POST'}); if(res.ok) alert("Sync'd to Archive!"); }
                </script>
            </body></html>
        `);
    } catch (err) { res.status(500).send("Neural Link Error"); }
});

// 6. ALL SYSTEM ROUTES
app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
        <form action="/login" method="POST" style="width:300px; text-align:center; background:rgba(255,255,255,0.05); padding:40px; border-radius:30px; border:1px solid rgba(255,255,255,0.1);">
            <h2 style="letter-spacing:4px; color:white;">XAVIROX</h2>
            <input name="username" placeholder="Neural ID" style="width:100%; padding:15px; margin-bottom:10px; border-radius:15px; background:rgba(255,255,255,0.1); border:none; color:white;" required>
            <input name="password" type="password" placeholder="Key" style="width:100%; padding:15px; margin-bottom:20px; border-radius:15px; background:rgba(255,255,255,0.1); border:none; color:white;" required>
            <button style="width:100%; padding:15px; border-radius:50px; border:none; background:white; font-weight:bold; cursor:pointer;">INITIALIZE</button>
            <p style="font-size:12px; margin-top:20px; opacity:0.5;">New here? <a href="/signup" style="color:var(--ios-blue);">Create ID</a></p>
        </form>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0;">
        <form action="/signup" method="POST" style="width:300px; text-align:center; background:rgba(255,255,255,0.05); padding:40px; border-radius:30px; border:1px solid rgba(255,255,255,0.1);">
            <h2>NEW IDENTITY</h2>
            <input name="username" placeholder="Choose ID" style="width:100%; padding:15px; margin-bottom:10px; border-radius:15px; background:rgba(255,255,255,0.1); border:none; color:white;" required>
            <input name="password" type="password" placeholder="Set Key" style="width:100%; padding:15px; margin-bottom:20px; border-radius:15px; background:rgba(255,255,255,0.1); border:none; color:white;" required>
            <button style="width:100%; padding:15px; border-radius:50px; border:none; background:white; font-weight:bold;">REGISTER</button>
        </form>
    </body>`);
});

app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const isXavi = req.body.username.toLowerCase() === 'xavi';
        await new User({ username: req.body.username, password: hashedPassword, isAdmin: isXavi, hasBlueTick: isXavi }).save();
        res.redirect('/login');
    } catch (err) { res.send("ID already exists!"); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else { res.send("<script>alert('Invalid Access'); window.location='/login';</script>"); }
});

app.post('/api/vote/:id', isAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = req.session.user.username;
        if (post.votedBy.includes(user)) return res.json({ success: false });
        post.votes += (req.body.type === 'up' ? 1 : -1);
        post.votedBy.push(user);
        await post.save();
        res.json({ success: true, newVotes: post.votes });
    } catch (e) { res.status(500).json({ success: false }); }
});

app.post('/addpost', isAuth, async (req, res) => {
    await new Post({ content: req.body.content, author: req.session.user.username, community: req.body.community, hasBlueTick: req.session.user.hasBlueTick }).save();
    res.redirect('/dashboard');
});

app.post('/update-portfolio', isAuth, async (req, res) => {
    let url = req.body.url;
    if(!url.startsWith('http')) url = 'https://' + url;
    await User.findByIdAndUpdate(req.session.user._id, { portfolioUrl: url });
    res.redirect('/dashboard');
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;