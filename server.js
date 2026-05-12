const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// 1. DATABASE CONNECTION
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

// Vercel par stable connection ke liye logic
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(dbURI);
        isConnected = true;
        console.log('✅ XAVIROX NEURAL CORE STABILIZED');
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
app.use(session({
    secret: 'xavirox_ultra_secret_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// DB Connection Middleware for Vercel
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// 4. AUTH ROUTES
app.get('/login', (req, res) => {
    res.send(`
        <body style="background:#05050a; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="background:rgba(255,255,255,0.03); padding:40px; border-radius:25px; border:1px solid #ff007f; width:320px; backdrop-filter:blur(20px); text-align:center; box-shadow: 0 0 20px rgba(255,0,127,0.2);">
                <h2 style="color:#ff007f; letter-spacing:3px; text-shadow: 0 0 10px #ff007f;">XAVIROX LOGIN</h2>
                <form action="/login" method="POST">
                    <input name="username" placeholder="Neural ID" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <button type="submit" style="width:100%; padding:15px; border-radius:12px; border:none; background:linear-gradient(45deg, #ff007f, #7b61ff); color:white; font-weight:bold; cursor:pointer;">INITIALIZE</button>
                </form>
                <p style="font-size:12px; margin-top:15px; opacity:0.6;">New user? <a href="/signup" style="color:#ff007f; text-decoration:none;">Create ID</a></p>
            </div>
        </body>
    `);
});

app.get('/signup', (req, res) => {
    res.send(`
        <body style="background:#05050a; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="background:rgba(255,255,255,0.03); padding:40px; border-radius:25px; border:1px solid #ff007f; width:320px; backdrop-filter:blur(20px); text-align:center;">
                <h2 style="color:#ff007f; letter-spacing:3px;">NEW NEURAL ID</h2>
                <form action="/signup" method="POST">
                    <input name="username" placeholder="Choose ID" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <input name="password" type="password" placeholder="Set Key" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <button type="submit" style="width:100%; padding:15px; border-radius:12px; border:none; background:linear-gradient(45deg, #ff007f, #7b61ff); color:white; font-weight:bold; cursor:pointer;">REGISTER</button>
                </form>
            </div>
        </body>
    `);
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

// 5. THE MASTER DASHBOARD
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate('savedPosts');
        const allPosts = await Post.find().sort({ date: -1 });
        const comms = await Community.find();

        let postHTML = allPosts.map(p => `
            <div class="glass-card post-card" id="post-${p._id}">
                <div class="post-header">
                    <div class="avatar-glow">${p.author[0].toUpperCase()}</div>
                    <div class="post-meta">
                        <span class="author-name">@${p.author} ${p.hasBlueTick ? '<i class="fas fa-check-circle" style="color:#ff007f;"></i>' : ''}</span>
                        <div class="post-time">${p.community} • ${new Date(p.date).toLocaleTimeString()}</div>
                    </div>
                    <button onclick="savePost('${p._id}')" class="save-btn"><i class="far fa-bookmark"></i></button>
                </div>
                <div class="post-body">${p.content}</div>
                <div class="action-bar">
                    <button class="vote-btn" onclick="handleVote('${p._id}', 'up')"><i class="fas fa-chevron-up"></i> <span class="v-count">${p.votes}</span></button>
                    <button class="vote-btn" onclick="handleVote('${p._id}', 'down')"><i class="fas fa-chevron-down"></i></button>
                </div>
            </div>`).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    :root { --pink: #ff007f; --glow: rgba(255, 0, 127, 0.5); --bg: #05050a; --glass: rgba(255, 255, 255, 0.04); }
                    * { box-sizing: border-box; }
                    body { margin: 0; background: var(--bg); color: #fff; font-family: 'Segoe UI', sans-serif; overflow-x: hidden; }
                    .navbar { width: 100%; height: 65px; background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--pink); display: flex; align-items: center; justify-content: space-between; padding: 0 25px; position: fixed; top: 0; z-index: 1000; }
                    .logo { font-size: 22px; font-weight: 900; color: var(--pink); letter-spacing: 3px; text-shadow: 0 0 10px var(--pink); }
                    .main-layout { display: flex; justify-content: center; gap: 30px; padding: 90px 20px 30px; max-width: 1300px; margin: auto; }
                    .sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 90px; height: fit-content; }
                    .feed { width: 620px; flex-grow: 1; }
                    .glass-card { background: var(--glass); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 22px; backdrop-filter: blur(15px); margin-bottom: 20px; }
                    .p-avatar { width: 85px; height: 85px; background: linear-gradient(45deg, var(--pink), #7b61ff); border-radius: 25px; display: flex; align-items: center; justify-content: center; font-size: 35px; margin: 0 auto 15px; box-shadow: 0 0 20px var(--glow); }
                    .portfolio-link { background: var(--pink); color: #000; padding: 14px; border-radius: 12px; text-decoration: none; display: block; margin-top: 15px; font-weight: bold; text-align: center; }
                    .post-header { display: flex; align-items: center; margin-bottom: 15px; position: relative; }
                    .avatar-glow { width: 40px; height: 40px; border-radius: 10px; background: var(--pink); color:#000; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; }
                    .save-btn { position: absolute; right: 0; background: none; border: none; color: var(--pink); cursor: pointer; }
                    .transmit-btn { background: linear-gradient(45deg, var(--pink), #7b61ff); border: none; color: #fff; padding: 15px; border-radius: 15px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }
                    textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; color: #fff; padding: 15px; outline: none; resize: none; }
                    .vote-btn { background: rgba(255,255,255,0.05); border: none; padding: 8px 15px; border-radius: 8px; color: #fff; cursor: pointer; margin-right: 10px; }
                    @media (max-width: 900px) { .main-layout { flex-direction: column; align-items: center; padding-top: 80px; } .sidebar, .feed { width: 100%; position: relative; top: 0; } .sidebar { order: 1; } .feed { order: 2; } }
                </style>
            </head>
            <body>
                <nav class="navbar"><div class="logo">XAVIROX</div><a href="/logout" style="color:var(--pink); text-decoration:none; font-weight:bold;">DISCONNECT</a></nav>
                <div class="main-layout">
                    <div class="sidebar">
                        <div class="glass-card" style="text-align:center;">
                            <div class="p-avatar">${user.username[0].toUpperCase()}</div>
                            <div style="color:var(--pink); font-weight:bold;">@${user.username}</div>
                            <a href="${user.portfolioUrl}" target="_blank" class="portfolio-link">MY PORTFOLIO</a>
                            <form action="/update-portfolio" method="POST" style="margin-top:15px;">
                                <input name="url" placeholder="New URL..." style="width:100%; padding:8px; background:none; border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:8px; font-size:11px;">
                                <button class="transmit-btn" style="padding:8px; font-size:10px;">UPDATE</button>
                            </form>
                        </div>
                        <div class="glass-card">
                            <h4 style="color:var(--pink); margin-top:0;">COMMUNITIES</h4>
                            <form action="/create-comm" method="POST"><input name="name" style="width:100%; background:none; border:1px solid #333; color:#fff; padding:5px; border-radius:5px;"><button class="transmit-btn" style="font-size:10px;">FOUND</button></form>
                            <div style="margin-top:10px; font-size:12px; color:rgba(255,255,255,0.6);">${comms.map(c => `<div># ${c.name}</div>`).join('')}</div>
                        </div>
                        <div class="glass-card">
                            <h4 style="color:var(--pink); margin-top:0;">SAVED (${user.savedPosts.length})</h4>
                            <div style="font-size:10px; opacity:0.7;">${user.savedPosts.map(sp => `• ${sp.content.substring(0,25)}...<br>`).join('')}</div>
                        </div>
                    </div>
                    <div class="feed">
                        <div class="glass-card">
                            <form action="/addpost" method="POST">
                                <textarea name="content" rows="3" placeholder="Broadcast a neural signal..." required></textarea>
                                <select name="community" style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; border-radius:10px; margin-top:10px;">
                                    <option value="Global">Global Channel</option>${comms.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                                </select>
                                <button type="submit" class="transmit-btn">TRANSMIT</button>
                            </form>
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
                    async function savePost(id) { const res = await fetch('/api/save/'+id, {method: 'POST'}); if(res.ok) { alert("Saved!"); location.reload(); } }
                </script>
            </body></html>
        `);
    } catch (err) { res.status(500).send("System Error"); }
});

// 6. LOGIC ROUTES
app.post('/api/vote/:id', async (req, res) => {
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

app.post('/api/save/:id', isAuth, async (req, res) => {
    await User.findByIdAndUpdate(req.session.user._id, { $addToSet: { savedPosts: req.params.id } });
    res.sendStatus(200);
});

app.post('/update-portfolio', isAuth, async (req, res) => {
    let url = req.body.url;
    if(!url.startsWith('http')) url = 'https://' + url;
    await User.findByIdAndUpdate(req.session.user._id, { portfolioUrl: url });
    res.redirect('/dashboard');
});

app.post('/create-comm', isAuth, async (req, res) => {
    try { await new Community({ name: req.body.name, creator: req.session.user.username }).save(); res.redirect('/dashboard'); }
    catch (e) { res.send("Taken!"); }
});

app.post('/addpost', isAuth, async (req, res) => {
    await new Post({ content: req.body.content, author: req.session.user.username, community: req.body.community, hasBlueTick: req.session.user.hasBlueTick }).save();
    res.redirect('/dashboard');
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

// EXPORT FOR VERCEL
module.exports = app;

// Local Development
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`🚀 NEURAL SYSTEM LIVE ON ${PORT}`));
}