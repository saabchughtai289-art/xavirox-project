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
        console.log('🌌 COSMIC CORE ONLINE');
    } catch (err) {
        console.error('💥 NEURAL COLLAPSE:', err);
    }
};

// 2. SCHEMAS
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasBlueTick: { type: Boolean, default: false },
    portfolioUrl: { type: String, default: 'https://xavirox.com' },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: { type: String, default: 'Anonymous' },
    content: String,
    community: { type: String, default: 'Multiverse' },
    votes: { type: Number, default: 0 },
    votedBy: { type: Array, default: [] }, 
    hasBlueTick: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}));

// 3. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(session({
    secret: 'galactic_pink_glow_99',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false }
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');
app.use(async (req, res, next) => { await connectDB(); next(); });

const funnyLines = [
    "Duniya gol hai, lekin ye post square...",
    "Pink hole se bach ke type karo!",
    "Aliens are reading... make it interesting.",
    "Mars par internet slow hai kya?",
    "Shhh... galactic signal broadcast ho rha hai."
];

// 4. MASTER DASHBOARD (HOVER TRANSFORMATION + GLASS UI)
app.get('/dashboard', isAuth, async (req, res) => {
    const user = await User.findById(req.session.user._id).populate('savedPosts');
    const allPosts = await Post.find().sort({ date: -1 });
    const randomLine = funnyLines[Math.floor(Math.random() * funnyLines.length)];

    let postHTML = allPosts.map(p => `
        <div class="ios-card animate-pop">
            <div class="post-header">
                <div class="avatar-orbit">${p.author[0].toUpperCase()}</div>
                <div class="user-info">
                    <span class="user-id">@${p.author} ${p.hasBlueTick ? '<i class="fas fa-certificate blue-tick"></i>' : ''}</span>
                    <span class="meta">${p.community} • Galaxy Time</span>
                </div>
            </div>
            <div class="post-content">${p.content}</div>
            <div class="ios-actions">
                <button class="action-btn" onclick="vote('${p._id}', 'up')"><i class="fas fa-arrow-up"></i> <span id="v-${p._id}">${p.votes}</span></button>
                <button class="action-btn" onclick="save('${p._id}')"><i class="far fa-bookmark"></i></button>
            </div>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                :root { 
                    --ios-blue: #007AFF; 
                    --ios-pink: #FF2D55; 
                    --glass: rgba(255, 255, 255, 0.1);
                    --glass-border: rgba(255, 255, 255, 0.15);
                    --neon-pink: #ff007f;
                }
                
                body { 
                    margin: 0; background: #000; color: white; 
                    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; 
                    overflow-x: hidden; min-height: 100vh;
                }
                
                .universe-bg {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle at 50% 0%, #300c52 0%, #000 60%, #001233 100%);
                    z-index: -2;
                }

                .stars {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: url('https://www.transparenttextures.com/patterns/stardust.png');
                    opacity: 0.3; z-index: -1; animation: drift 120s linear infinite;
                }
                @keyframes drift { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }

                .navbar { 
                    position: fixed; top: 0; width: 100%; height: 65px; 
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(25px); 
                    border-bottom: 1px solid var(--glass-border); 
                    display: flex; align-items: center; justify-content: space-between; 
                    padding: 0 20px; z-index: 1000; box-sizing: border-box;
                }
                .logo { font-size: 24px; font-weight: 900; background: linear-gradient(to right, var(--neon-pink), var(--ios-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

                .container { padding: 90px 15px 50px; max-width: 500px; margin: auto; }

                /* Strong Glass Card with Hover Effect */
                .ios-card { 
                    background: var(--glass); 
                    border-radius: 30px; padding: 22px; margin-bottom: 20px; 
                    border: 1px solid var(--glass-border); 
                    backdrop-filter: blur(20px); 
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    position: relative; overflow: hidden;
                }

                /* HOVER ANIMATION: PINK TRANSFORMATION */
                .ios-card:hover {
                    border-color: var(--neon-pink);
                    transform: translateY(-5px) scale(1.02);
                    background: rgba(255, 0, 127, 0.05);
                    box-shadow: 0 15px 40px rgba(255, 0, 127, 0.2);
                }

                textarea { 
                    width: 100%; background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border); 
                    border-radius: 20px; color: white; padding: 18px; font-size: 16px; 
                    outline: none; resize: none; box-sizing: border-box; transition: 0.3s;
                }
                textarea:focus { border-color: var(--neon-pink); background: rgba(0,0,0,0.6); }

                .btn-ios { 
                    background: #fff; color: #000; border: none; padding: 12px 28px; 
                    border-radius: 50px; font-weight: 800; float: right; 
                    margin-top: 10px; cursor: pointer; transition: 0.3s;
                }
                .btn-ios:hover { background: var(--neon-pink); color: #fff; transform: scale(1.1); }

                .avatar-orbit { 
                    width: 50px; height: 50px; 
                    background: linear-gradient(45deg, var(--neon-pink), #8e2de2); 
                    border-radius: 18px; display: flex; align-items: center; 
                    justify-content: center; font-weight: 900; font-size: 20px;
                }

                .post-header { display: flex; gap: 14px; align-items: center; margin-bottom: 18px; }
                .user-id { font-weight: 700; color: #fff; font-size: 16px; }
                .meta { font-size: 11px; opacity: 0.5; }
                .post-content { font-size: 17px; line-height: 1.6; color: #f0f0f0; }

                .ios-actions { display: flex; gap: 20px; margin-top: 20px; border-top: 1px solid var(--glass-border); padding-top: 18px; }
                .action-btn { background: none; border: none; color: white; font-size: 15px; cursor: pointer; transition: 0.3s; opacity: 0.7; }
                .action-btn:hover { color: var(--neon-pink); opacity: 1; transform: scale(1.2); }

                .animate-pop { animation: pop 0.5s ease-out; }
                @keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            </style>
        </head>
        <body>
            <div class="universe-bg"></div>
            <div class="stars"></div>
            <nav class="navbar"><div class="logo">XAVIROX</div><a href="/logout" style="color:var(--ios-pink); text-decoration:none; font-size:13px; font-weight:bold;">DISCONNECT</a></nav>
            <div class="container">
                <div class="ios-card animate-pop">
                    <form action="/addpost" method="POST">
                        <textarea name="content" rows="2" placeholder="${randomLine}" required></textarea>
                        <button class="btn-ios">TRANSMIT</button>
                    </form>
                    <div style="clear:both;"></div>
                </div>
                <div id="feed">${postHTML}</div>
            </div>
            <script>
                async function vote(id, type) {
                    const res = await fetch('/api/vote/'+id, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type}) });
                    const data = await res.json();
                    if(data.success) {
                        const count = document.getElementById('v-'+id);
                        count.innerText = data.newVotes;
                        count.style.color = '#ff007f';
                    }
                }
                async function save(id) { await fetch('/api/save/'+id, {method: 'POST'}); alert("Archived in Nebula!"); }
            </script>
        </body></html>
    `);
});

// 5. AUTH & LOGIC
app.post('/signup', async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10);
    await new User({ username: req.body.username, password: hashed }).save();
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else { res.send("<script>alert('Neural Mismatch!'); window.location='/login';</script>"); }
});

app.post('/addpost', isAuth, async (req, res) => {
    await new Post({ content: req.body.content, author: req.session.user.username }).save();
    res.redirect('/dashboard');
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; font-family:sans-serif;">
        <div style="background:rgba(255,255,255,0.03); padding:45px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); width:85%; max-width:350px; text-align:center; backdrop-filter:blur(30px); box-shadow: 0 20px 50px rgba(0,0,0,1);">
            <h1 style="letter-spacing:8px; margin-bottom:30px; background: linear-gradient(to right, #ff007f, #007AFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">XAVIROX</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" style="width:100%; padding:16px; margin-bottom:12px; border-radius:18px; border:none; background:rgba(255,255,255,0.08); color:white; outline:none;" required>
                <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:16px; margin-bottom:25px; border-radius:18px; border:none; background:rgba(255,255,255,0.08); color:white; outline:none;" required>
                <button style="width:100%; padding:16px; border-radius:50px; border:none; background:white; color:black; font-weight:900; cursor:pointer; transition:0.3s;">INITIALIZE</button>
            </form>
            <p style="font-size:11px; margin-top:25px; opacity:0.4;">No Access? <a href="/signup" style="color:#ff007f; text-decoration:none;">Create Identity</a></p>
        </div>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; font-family:sans-serif;">
        <div style="background:rgba(255,255,255,0.03); padding:45px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); width:85%; max-width:350px; text-align:center; backdrop-filter:blur(30px);">
            <h2 style="letter-spacing:2px;">NEW IDENTITY</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Choose ID" style="width:100%; padding:16px; margin-bottom:12px; border-radius:18px; border:none; background:rgba(255,255,255,0.08); color:white;" required>
                <input name="password" type="password" placeholder="Set Key" style="width:100%; padding:16px; margin-bottom:25px; border-radius:18px; border:none; background:rgba(255,255,255,0.08); color:white;" required>
                <button style="width:100%; padding:16px; border-radius:50px; border:none; background:white; color:black; font-weight:900;">SYNC DATA</button>
            </form>
        </div>
    </body>`);
});

app.post('/api/vote/:id', isAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post.votedBy.includes(req.session.user.username)) {
        post.votes += (req.body.type === 'up' ? 1 : -1);
        post.votedBy.push(req.session.user.username);
        await post.save();
        res.json({ success: true, newVotes: post.votes });
    } else { res.json({ success: false }); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;