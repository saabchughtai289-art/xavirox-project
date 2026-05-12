const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// 1. DATABASE CONNECTION
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
.then(() => console.log('✅ XAVIROX NEURAL CORE CONNECTED'))
.catch(err => console.error('❌ CONNECTION FAILED:', err));

// 2. DATA SCHEMAS
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasBlueTick: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    portfolioUrl: { type: String, default: 'https://google.com' } 
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
                <p style="font-size:12px; text-align:center; margin-top:15px;">New? <a href="/signup" style="color:#00ffff;">Create ID</a></p>
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
            hasBlueTick: isXavi,
            portfolioUrl: 'https://xavirox.com' // Default link set
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

// 5. DASHBOARD (DESKTOP PORTFOLIO FIX)
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ date: -1 });
        const user = req.session.user;
        const pUrl = user.portfolioUrl || 'https://google.com';

        let postHTML = allPosts.map(p => `
            <div class="glass-card post" id="post-${p._id}" style="margin-bottom:20px;">
                <div class="post-header" style="display:flex; align-items:center;">
                    <div class="avatar-glow" style="width:40px; height:40px; border-radius:10px; background:linear-gradient(45deg, var(--glow), var(--purple)); display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:12px;">${p.author[0].toUpperCase()}</div>
                    <div class="post-meta">
                        <span class="author-name" style="color:var(--cyan); font-weight:bold;">
                            @${p.author} ${p.hasBlueTick ? '<i class="fas fa-check-circle" style="font-size:11px; color:var(--cyan);"></i>' : ''}
                        </span>
                        <div class="post-time" style="font-size:10px; opacity:0.5;">${new Date(p.date).toLocaleTimeString()}</div>
                    </div>
                </div>
                <div class="post-body" style="margin: 15px 0; color:#ddd;">${p.content}</div>
                <div class="luxury-action-group" style="display:flex; background:rgba(255,255,255,0.05); border-radius:12px; width:fit-content;">
                    <button class="lux-btn" onclick="handleVote('${p._id}', 'up')" style="color:var(--cyan); background:none; border:none; padding:10px 15px; cursor:pointer;"><i class="fas fa-caret-up"></i> <span class="v-count">${p.votes}</span></button>
                    <button class="lux-btn" onclick="handleVote('${p._id}', 'down')" style="color:var(--glow); background:none; border:none; padding:10px 15px; cursor:pointer;"><i class="fas fa-caret-down"></i></button>
                </div>
            </div>`).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    :root { --glow: #ff007f; --cyan: #00ffff; --purple: #7b61ff; --bg: #05050a; }
                    body { margin: 0; background: var(--bg); color: #fff; font-family: sans-serif; }
                    .universe { position: fixed; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a0b2e 0%, #05050a 100%); }
                    
                    /* FIXED NAVBAR */
                    .navbar { width: 100%; height: 60px; background: rgba(0,0,0,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; position: fixed; top: 0; z-index: 1000; box-sizing: border-box; }
                    .logo { font-size: 20px; font-weight: 900; color: var(--cyan); letter-spacing: 2px; }

                    /* MAIN LAYOUT - FLEX IS BETTER */
                    .main-layout { display: flex; justify-content: center; gap: 30px; padding: 80px 20px 20px; max-width: 1200px; margin: auto; }
                    
                    .left-sidebar { width: 280px; display: block; }
                    .feed-container { width: 600px; }
                    .right-sidebar { width: 280px; display: block; }

                    .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 20px; backdrop-filter: blur(20px); }
                    .profile-card { text-align: center; border: 1px solid var(--cyan); box-shadow: 0 0 20px rgba(0,255,255,0.1); }
                    .p-avatar { width: 80px; height: 80px; background: linear-gradient(45deg, var(--glow), var(--purple)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 15px; }
                    
                    /* PORTFOLIO BUTTON */
                    .portfolio-link { background: var(--cyan); color: #000; padding: 12px; border-radius: 12px; text-decoration: none; display: block; margin-top: 15px; font-weight: bold; transition: 0.3s; text-transform: uppercase; font-size: 13px; }
                    .portfolio-link:hover { transform: scale(1.05); box-shadow: 0 0 15px var(--cyan); }

                    @media (max-width: 1100px) { .right-sidebar { display: none; } }
                    @media (max-width: 850px) { 
                        .left-sidebar { display: none; } 
                        .feed-container { width: 100%; }
                        .main-layout { padding: 70px 10px 100px; }
                    }

                    textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; color: #fff; padding: 15px; box-sizing: border-box; outline: none; resize: none; font-family: inherit; }
                    .transmit-btn { background: linear-gradient(45deg, var(--glow), var(--purple)); border: none; color: #fff; padding: 15px; border-radius: 15px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }

                    .mobile-nav { display: none; position: fixed; bottom: 0; width: 100%; background: rgba(0,0,0,0.95); border-top: 1px solid rgba(255,255,255,0.1); padding: 20px 0; justify-content: space-around; z-index: 1001; }
                    @media (max-width: 850px) { .mobile-nav { display: flex; } }
                </style>
            </head>
            <body>
                <div class="universe"></div>
                <nav class="navbar">
                    <div class="logo">XAVIROX</div>
                    <a href="/logout" style="color:var(--glow); text-decoration:none; font-weight:bold; font-size:12px;">DISCONNECT</a>
                </nav>

                <div class="main-layout">
                    <div class="left-sidebar">
                        <div class="glass-card profile-card">
                            <div class="p-avatar">${user.username[0].toUpperCase()}</div>
                            <div style="color:var(--cyan); font-weight:bold; font-size:18px;">@${user.username} ${user.hasBlueTick ? '<i class="fas fa-check-circle"></i>' : ''}</div>
                            <a href="${pUrl}" target="_blank" class="portfolio-link"><i class="fas fa-external-link-alt"></i> Open Portfolio</a>
                        </div>
                    </div>

                    <div class="feed-container">
                        <div class="input-area glass-card" style="margin-bottom: 25px;">
                            <form action="/addpost" method="POST">
                                <textarea name="content" rows="3" placeholder="Broadcast to the network..." required></textarea>
                                <button type="submit" class="transmit-btn">TRANSMIT SIGNAL</button>
                            </form>
                        </div>
                        <div id="posts-container">${postHTML}</div>
                    </div>

                    <div class="right-sidebar">
                        <div class="glass-card">
                            <h3 style="color:var(--glow); font-size:12px; letter-spacing:1px; margin-bottom:15px;">SYSTEM FEEDBACK</h3>
                            <textarea id="fbContent" rows="2" placeholder="Send message..."></textarea>
                            <button onclick="sendFeedback()" class="transmit-btn" style="padding:10px;">SEND</button>
                        </div>
                    </div>
                </div>

                <div class="mobile-nav">
                    <i class="fas fa-home" style="color:var(--cyan); font-size:20px;"></i>
                    <i class="fas fa-plus-circle" style="font-size:20px;" onclick="window.scrollTo(0,0)"></i>
                    <a href="${pUrl}" target="_blank" style="color:inherit;"><i class="fas fa-user-circle" style="font-size:20px;"></i></a>
                    <i class="fas fa-sign-out-alt" style="font-size:20px;" onclick="window.location='/logout'"></i>
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
                            const countSpan = document.querySelector('#post-'+postId+' .v-count');
                            if(countSpan) countSpan.innerText = data.newVotes; 
                        }
                    };

                    window.sendFeedback = async function() {
                        const fb = document.getElementById('fbContent').value;
                        if(!fb) return;
                        const res = await fetch('/api/feedback', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ feedback: fb })
                        });
                        if(res.ok) { alert("Signal Received!"); document.getElementById('fbContent').value = ""; }
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
        await newPost.save();
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