const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// 1. DATABASE CONNECTION
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000
})
.then(() => console.log('✅ XAVIROX NEURAL CORE CONNECTED'))
.catch(err => console.error('❌ CONNECTION FAILED:', err));

// 2. DATA SCHEMAS
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasBlueTick: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    portfolioUrl: { type: String, default: 'https://your-portfolio.com' } 
});
const User = mongoose.model('User', UserSchema);

const Post = mongoose.model('Post', new mongoose.Schema({
    author: { type: String, default: 'Anonymous' },
    content: String,
    votes: { type: Number, default: 0 },
    votedBy: { type: Array, default: [] }, 
    hasBlueTick: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}));

const Feedback = mongoose.model('Feedback', new mongoose.Schema({
    msg: String,
    date: { type: Date, default: Date.now }
}));

// 3. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 
app.use(session({
    secret: 'xavirox_ultra_secret',
    resave: false,
    saveUninitialized: true
}));

const isAuth = (req, res, next) => {
    if (req.session.user) next();
    else res.redirect('/login');
};

// 4. AUTH ROUTES
app.get('/login', (req, res) => {
    res.send(`
        <body style="background:#05050a; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="background:rgba(255,255,255,0.03); padding:40px; border-radius:25px; border:1px solid rgba(0,255,255,0.2); width:320px; backdrop-filter:blur(20px);">
                <h2 style="color:#00ffff; text-align:center; letter-spacing:3px;">XAVIROX LOGIN</h2>
                <form action="/login" method="POST">
                    <input name="username" placeholder="Neural ID" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <button type="submit" style="width:100%; padding:15px; border-radius:12px; border:none; background:linear-gradient(45deg, #ff007f, #7b61ff); color:white; font-weight:bold; cursor:pointer;">INITIALIZE LINK</button>
                </form>
            </div>
        </body>
    `);
});

app.get('/signup', (req, res) => {
    res.send(`
        <body style="background:#05050a; color:white; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
            <div style="background:rgba(255,255,255,0.03); padding:40px; border-radius:25px; border:1px solid rgba(255,0,127,0.2); width:320px; backdrop-filter:blur(20px);">
                <h2 style="color:#ff007f; text-align:center; letter-spacing:3px;">NEW NEURAL ID</h2>
                <form action="/signup" method="POST">
                    <input name="username" placeholder="Choose ID" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <input name="password" type="password" placeholder="Set Key" style="width:100%; padding:15px; margin-bottom:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.5); color:white; box-sizing:border-box;" required>
                    <button type="submit" style="width:100%; padding:15px; border-radius:12px; border:none; background:linear-gradient(45deg, #00ffff, #7b61ff); color:white; font-weight:bold; cursor:pointer;">REGISTER ID</button>
                </form>
            </div>
        </body>
    `);
});

app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const isXavi = req.body.username.toLowerCase() === 'xavi';
        const newUser = new User({ 
            username: req.body.username, 
            password: hashedPassword,
            isAdmin: isXavi,
            hasBlueTick: isXavi 
        });
        await newUser.save();
        res.redirect('/login');
    } catch (err) { res.send("Username taken!"); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.send("<script>alert('Access Denied'); window.location='/login';</script>");
    }
});

// 5. DASHBOARD (FULL MERGED & FIXED)
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ date: -1 });
        const user = req.session.user;
        const placeholders = ["Broadcast to the network...", "Drop a forbidden opinion...", "Type your thoughts..."];
        const randomLine = placeholders[Math.floor(Math.random() * placeholders.length)];

        let postHTML = allPosts.map(p => `
            <div class="glass-card post" id="post-${p._id}" style="margin-bottom:20px;">
                <div class="post-header" style="display:flex; align-items:center;">
                    <div class="avatar-glow" style="width:40px; height:40px; border-radius:10px; background:linear-gradient(45deg, var(--glow), var(--purple)); display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:12px;">${p.author[0].toUpperCase()}</div>
                    <div class="post-meta">
                        <span class="author-name" style="color:var(--cyan); font-weight:bold;">
                            ${p.author} ${p.hasBlueTick ? '<i class="fas fa-check-circle" style="font-size:11px; color:var(--cyan);"></i>' : ''}
                        </span>
                        <div class="post-time" style="font-size:10px; opacity:0.5;">${new Date(p.date).toLocaleTimeString()}</div>
                    </div>
                </div>
                <div class="post-body" style="margin: 15px 0; line-height:1.5;">${p.content}</div>
                <div class="post-actions">
                    <div class="luxury-action-group" style="display:flex; background:rgba(255,255,255,0.05); border-radius:12px; width:fit-content;">
                        <button class="lux-btn" onclick="handleVote('${p._id}', 'up')" style="color:#00ffff;"><i class="fas fa-caret-up"></i> <span class="v-count">${p.votes}</span></button>
                        <button class="lux-btn" onclick="handleVote('${p._id}', 'down')" style="color:#ff007f;"><i class="fas fa-caret-down"></i></button>
                    </div>
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
                    :root { --glow: #ff007f; --cyan: #00ffff; --purple: #7b61ff; --bg: #05050a; }
                    body { margin: 0; background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
                    .universe { position: fixed; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a0b2e 0%, #05050a 100%); }
                    .navbar { width: 100%; height: 65px; background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; position: fixed; top: 0; z-index: 1000; box-sizing: border-box; }
                    .logo { font-size: 22px; font-weight: 900; color: var(--cyan); letter-spacing: 3px; }
                    
                    /* Desktop Layout Fix */
                    .main-layout { display: flex; justify-content: center; gap: 20px; padding: 85px 20px 20px; max-width: 1300px; margin: auto; }
                    .left-sidebar { width: 300px; flex-shrink: 0; }
                    .feed-container { flex-grow: 1; max-width: 650px; }
                    .right-sidebar { width: 300px; flex-shrink: 0; }

                    .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 20px; backdrop-filter: blur(20px); }
                    .profile-card { text-align: center; border: 1px solid var(--cyan); }
                    .p-avatar { width: 75px; height: 75px; background: linear-gradient(45deg, var(--glow), var(--purple)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; margin: 0 auto 15px; }
                    .portfolio-link { background: var(--cyan); color: #000; padding: 12px; border-radius: 12px; text-decoration: none; display: block; margin-top: 15px; font-weight: bold; }

                    @media (max-width: 1100px) { .right-sidebar { display: none; } }
                    @media (max-width: 800px) { 
                        .left-sidebar { display: none; } 
                        .main-layout { padding: 80px 10px 100px; }
                    }

                    textarea { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; color: #fff; padding: 15px; box-sizing: border-box; outline: none; resize: none; }
                    .transmit-btn { background: linear-gradient(45deg, var(--glow), var(--purple)); border: none; color: #fff; padding: 12px; border-radius: 15px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }
                    .lux-btn { background: none; border: none; padding: 10px 15px; cursor: pointer; font-weight: bold; }

                    .mobile-nav { display: none; position: fixed; bottom: 0; width: 100%; background: rgba(0,0,0,0.95); border-top: 1px solid rgba(255,255,255,0.1); padding: 15px 0; justify-content: space-around; z-index: 1000; }
                    @media (max-width: 800px) { .mobile-nav { display: flex; } }
                </style>
            </head>
            <body>
                <div class="universe"></div>
                <nav class="navbar">
                    <div class="logo">XAVIROX</div>
                    <a href="/logout" style="color:var(--glow); text-decoration:none; font-size:12px;">LOGOUT</a>
                </nav>

                <div class="main-layout">
                    <div class="left-sidebar">
                        <div class="glass-card profile-card">
                            <div class="p-avatar">${user.username[0].toUpperCase()}</div>
                            <div style="color:var(--cyan); font-weight:bold;">@${user.username} ${user.hasBlueTick ? '<i class="fas fa-check-circle"></i>' : ''}</div>
                            <a href="${user.portfolioUrl}" target="_blank" class="portfolio-link">MY PORTFOLIO</a>
                        </div>
                    </div>

                    <div class="feed-container">
                        <div class="input-area glass-card" style="margin-bottom: 25px;">
                            <form action="/addpost" method="POST">
                                <textarea name="content" placeholder="${randomLine}" required></textarea>
                                <button type="submit" class="transmit-btn">TRANSMIT SIGNAL</button>
                            </form>
                        </div>
                        <div id="posts-container">${postHTML}</div>
                    </div>

                    <div class="right-sidebar">
                        <div class="glass-card">
                            <h3 style="color:var(--glow); font-size:12px;">FEEDBACK</h3>
                            <textarea id="fbContent" style="height:60px;" placeholder="Message..."></textarea>
                            <button onclick="sendFeedback()" class="transmit-btn">SEND</button>
                        </div>
                    </div>
                </div>

                <div class="mobile-nav">
                    <i class="fas fa-home" style="color:var(--cyan)"></i>
                    <i class="fas fa-plus-circle" onclick="window.scrollTo(0,0)"></i>
                    <a href="${user.portfolioUrl}" style="color:inherit;"><i class="fas fa-briefcase"></i></a>
                    <i class="fas fa-user"></i>
                </div>

                <script>
                    window.handleVote = async function(postId, type) {
                        const res = await fetch('/api/vote/' + postId, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type })
                        });
                        const data = await res.json();
                        if(data.success) { 
                            const postElem = document.querySelector('#post-'+postId+' .v-count');
                            if(postElem) postElem.innerText = data.newVotes; 
                        }
                    };
                    window.sendFeedback = async function() {
                        const fb = document.getElementById('fbContent').value;
                        if(!fb) return;
                        const res = await fetch('/api/feedback', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ feedback: fb })
                        });
                        if(res.ok) { alert("Signal Sent!"); document.getElementById('fbContent').value = ""; }
                    };
                </script>
            </body>
            </html>
        `);
    } catch (err) { res.status(500).send("Core Sync Error"); }
});

// 6. API & POST ROUTES
app.post('/api/vote/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = req.session.user ? req.session.user.username : "guest"; 
        if (post.votedBy.includes(user)) return res.json({ success: false });
        post.votes += (req.body.type === 'up' ? 1 : -1);
        post.votedBy.push(user);
        await post.save();
        res.json({ success: true, newVotes: post.votes });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const newFB = new Feedback({ msg: req.body.feedback });
        await newFB.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/addpost', isAuth, async (req, res) => {
    try {
        const newPost = new Post({ 
            content: req.body.content,
            author: req.session.user.username,
            hasBlueTick: req.session.user.hasBlueTick
        });
        await newUserPost = await newPost.save();
        res.redirect('/dashboard');
    } catch (err) { res.status(500).send("Error"); }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/', (req, res) => res.redirect('/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 XAVIROX LIVE ON PORT ${PORT}`));