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
        console.log('🌌 MULTIVERSE CORE ONLINE');
    } catch (err) {
        console.error('💥 SYSTEM CRASH:', err);
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
    community: { type: String, default: 'Global' },
    votes: { type: Number, default: 0 },
    votedBy: { type: Array, default: [] }, 
    hasBlueTick: { type: Boolean, default: false },
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
    secret: 'genz_galaxy_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false }
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');
app.use(async (req, res, next) => { await connectDB(); next(); });

// 4. GENZ SEARCH LINES
const searchPlaceholders = [
    "Search for your lost sanity...",
    "Looking for a vibe? Type here.",
    "Main character energy only...",
    "Search if you're not a bot.",
    "Hunting for tea? ☕",
    "Finding my last 2 brain cells..."
];

// 5. MASTER DASHBOARD
app.get('/dashboard', isAuth, async (req, res) => {
    const user = await User.findById(req.session.user._id).populate('savedPosts');
    const allPosts = await Post.find().sort({ date: -1 });
    const randomSearch = searchPlaceholders[Math.floor(Math.random() * searchPlaceholders.length)];

    let postHTML = allPosts.map(p => `
        <div class="ios-card animate-pop">
            <div class="post-header">
                <div class="avatar-orbit">${p.author[0].toUpperCase()}</div>
                <div class="user-info">
                    <span class="user-id">@${p.author} ${p.hasBlueTick ? '<i class="fas fa-check-circle" style="color:#007AFF;"></i>' : ''}</span>
                    <span class="meta">${p.community} • Just now</span>
                </div>
            </div>
            <div class="post-content">${p.content}</div>
            <div class="ios-actions">
                <button onclick="vote('${p._id}', 'up')"><i class="fas fa-arrow-up"></i> <span id="v-${p._id}">${p.votes}</span></button>
                <button onclick="save('${p._id}')"><i class="far fa-bookmark"></i></button>
            </div>
        </div>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>
                :root { --p: #ff007f; --b: #007AFF; --glass: rgba(255,255,255,0.08); }
                body { margin: 0; background: #000; color: white; font-family: -apple-system, sans-serif; overflow-x: hidden; }
                
                /* Universe BG */
                .universe { position: fixed; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle at top, #200140 0%, #000 60%); z-index:-2; }
                .stars { position: fixed; top:0; left:0; width:100%; height:100%; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity:0.3; z-index:-1; }

                /* Floating Nav */
                .nav { position: fixed; top: 0; width: 100%; height: 65px; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 1000; box-sizing: border-box; }
                .logo { font-size: 22px; font-weight: 900; background: linear-gradient(to right, var(--p), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

                /* GenZ Search Bar */
                .search-container { padding: 80px 15px 10px; max-width: 500px; margin: auto; }
                .search-bar { width: 100%; background: var(--glass); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; padding: 12px 20px; color: white; outline: none; font-size: 14px; transition: 0.3s; }
                .search-bar:focus { border-color: var(--p); box-shadow: 0 0 15px rgba(255,0,127,0.3); }

                .container { padding: 10px 15px 100px; max-width: 500px; margin: auto; }

                /* Bottom Tab Bar (GenZ Style) */
                .tab-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; background: rgba(255,255,255,0.1); backdrop-filter: blur(25px); border-radius: 30px; display: flex; justify-content: space-around; padding: 15px; border: 1px solid rgba(255,255,255,0.15); z-index: 1000; }
                .tab-bar i { font-size: 20px; color: rgba(255,255,255,0.6); transition: 0.3s; cursor: pointer; }
                .tab-bar i:hover { color: var(--p); transform: scale(1.2); }

                /* Cards & Logic */
                .ios-card { background: var(--glass); border-radius: 25px; padding: 20px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(15px); transition: 0.4s; }
                .ios-card:hover { border-color: var(--p); transform: translateY(-5px); }
                .avatar-orbit { width: 45px; height: 45px; background: linear-gradient(45deg, var(--p), var(--b)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                .post-header { display: flex; gap: 12px; align-items: center; margin-bottom: 15px; }
                .user-id { font-weight: 700; }
                .meta { font-size: 10px; opacity: 0.5; display: block; }
                .ios-actions { display: flex; gap: 20px; margin-top: 15px; border-top: 0.5px solid rgba(255,255,255,0.1); padding-top: 15px; }
                .ios-actions button { background: none; border: none; color: white; font-size: 14px; cursor: pointer; }

                .animate-pop { animation: pop 0.4s ease-out; }
                @keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .modal { display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.9); padding:30px; border-radius:30px; border:1px solid var(--p); z-index:2000; width:80%; }
            </style>
        </head>
        <body>
            <div class="universe"></div><div class="stars"></div>
            <nav class="nav"><div class="logo">XAVIROX</div><i class="fas fa-bell" onclick="alert('No new tea yet!')"></i></nav>
            
            <div class="search-container">
                <input type="text" class="search-bar" placeholder="${randomSearch}">
            </div>

            <div class="container">
                <div class="ios-card">
                    <form action="/addpost" method="POST">
                        <textarea name="content" style="width:100%; background:none; border:none; color:white; font-size:16px; outline:none;" placeholder="What's the tea?" required></textarea>
                        <button style="background:white; color:black; border:none; padding:10px 20px; border-radius:50px; font-weight:bold; float:right; margin-top:10px;">Transmit</button>
                    </form>
                    <div style="clear:both;"></div>
                </div>
                <div id="feed">${postHTML}</div>
            </div>

            <div class="tab-bar">
                <i class="fas fa-home" onclick="window.location='/dashboard'"></i>
                <i class="fas fa-fire" onclick="alert('Trending: #XaviroxEra')"></i>
                <i class="fas fa-users" onclick="document.getElementById('commModal').style.display='block'"></i>
                <i class="fas fa-user-circle" onclick="window.open('${user.portfolioUrl}')"></i>
                <i class="fas fa-sign-out-alt" onclick="window.location='/logout'"></i>
            </div>

            <div id="commModal" class="modal">
                <h3 style="color:var(--p)">Multiverse Feedback</h3>
                <form action="/feedback" method="POST">
                    <textarea name="msg" style="width:100%; height:80px; background:rgba(255,255,255,0.1); color:white; border:none; padding:10px; border-radius:15px;"></textarea>
                    <button style="width:100%; margin-top:15px; padding:10px; border-radius:50px; border:none; background:var(--b); color:white; font-weight:bold;">SEND SIGNAL</button>
                </form>
                <button onclick="this.parentElement.style.display='none'" style="margin-top:10px; background:none; border:none; color:white; font-size:12px; width:100%;">Close</button>
            </div>

            <script>
                async function vote(id, type) {
                    const res = await fetch('/api/vote/'+id, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type}) });
                    const data = await res.json();
                    if(data.success) document.getElementById('v-'+id).innerText = data.newVotes;
                }
                async function save(id) { await fetch('/api/save/'+id, {method: 'POST'}); alert("Saved to Nebula!"); }
            </script>
        </body></html>
    `);
});

// 6. ALL FUNCTIONAL ROUTES
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
    } else { res.send("<script>alert('L + Ratio + Wrong Password'); window.location='/login';</script>"); }
});

app.post('/addpost', isAuth, async (req, res) => {
    await new Post({ content: req.body.content, author: req.session.user.username }).save();
    res.redirect('/dashboard');
});

app.post('/feedback', isAuth, async (req, res) => {
    await new Feedback({ msg: req.body.msg, sender: req.session.user.username }).save();
    res.redirect('/dashboard');
});

app.post('/api/save/:id', isAuth, async (req, res) => {
    await User.findByIdAndUpdate(req.session.user._id, { $addToSet: { savedPosts: req.params.id } });
    res.sendStatus(200);
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
        <div style="background:rgba(255,255,255,0.05); padding:40px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); width:85%; max-width:320px; text-align:center; backdrop-filter:blur(30px);">
            <h1 style="letter-spacing:5px; background: linear-gradient(to right, #ff007f, #007AFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">XAVIROX</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" style="width:100%; padding:15px; margin-bottom:12px; border-radius:18px; border:none; background:rgba(255,255,255,0.1); color:white;">
                <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:15px; margin-bottom:25px; border-radius:18px; border:none; background:rgba(255,255,255,0.1); color:white;">
                <button style="width:100%; padding:15px; border-radius:50px; border:none; background:white; font-weight:bold;">ENTER GALAXY</button>
            </form>
            <p style="font-size:11px; margin-top:20px; opacity:0.4;">No ID? <a href="/signup" style="color:#ff007f;">Join Squad</a></p>
        </div>
    </body>`);
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;