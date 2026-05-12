const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();

// --- 1. CONFIGURATION & DATABASE ---
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log('🌌 COSMIC DATABASE SYNCED'))
    .catch(err => console.error('💥 NEURAL DATABASE COLLAPSE:', err));

// --- 2. SCHEMAS (Expanded Logic) ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    portfolioUrl: { type: String, default: 'https://xavirox.com' },
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bio: { type: String, default: "Exploring the XAVIROX Multiverse." },
    notifications: [{ msg: String, date: { type: Date, default: Date.now } }]
});

const PostSchema = new mongoose.Schema({
    author: String,
    content: { type: String, required: true },
    votes: { type: Number, default: 0 },
    votedBy: [String], // To prevent multiple votes
    community: { type: String, default: 'Global Verse' },
    isPinned: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const FeedbackSchema = new mongoose.Schema({
    sender: String,
    message: String,
    category: { type: String, default: 'UI/UX' },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Feedback = mongoose.model('Feedback', FeedbackSchema);

// --- 3. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'xavirox_nebula_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- 4. MASTER INTERFACE (CSS & HTML) ---
const UI_SHELL = (content, user, searchHint) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover">
    <title>XAVIROX | Multiverse</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --b: #007AFF; --g: rgba(255,255,255,0.08); --border: rgba(255,255,255,0.12); }
        
        * { box-sizing: border-box; scroll-behavior: smooth; }
        body { margin: 0; background: #000; color: white; font-family: -apple-system, sans-serif; overflow-x: hidden; min-height: 100vh; }
        
        /* Cosmic Background */
        .bg-layer { position: fixed; top: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 0%, #1a0136 0%, #000 75%); z-index: -2; }
        .stars { position: fixed; top: 0; width: 100%; height: 100%; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.3; z-index: -1; animation: spaceDrift 200s linear infinite; }
        @keyframes spaceDrift { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }

        /* Navbar & Headings */
        .nav { position: fixed; top: 0; width: 100%; height: 65px; background: rgba(0,0,0,0.85); backdrop-filter: blur(25px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 1000; }
        .logo { font-size: 22px; font-weight: 900; background: linear-gradient(to right, var(--p), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px; }

        /* Content Container - Optimized for Laptop & Mobile */
        .wrapper { max-width: 700px; margin: 0 auto; padding: 85px 15px 120px; width: 100%; }
        
        /* Search Box */
        .search-area { margin-bottom: 25px; }
        .search-input { width: 100%; background: var(--g); border: 1px solid var(--border); border-radius: 50px; padding: 15px 25px; color: white; font-size: 15px; outline: none; transition: 0.4s; }
        .search-input:focus { border-color: var(--p); box-shadow: 0 0 20px rgba(255,0,127,0.2); }

        /* Cards & Posts */
        .card { background: var(--g); border-radius: 28px; padding: 22px; margin-bottom: 20px; border: 1px solid var(--border); backdrop-filter: blur(20px); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .card:hover { border-color: var(--p); transform: translateY(-5px); background: rgba(255,0,127,0.03); box-shadow: 0 15px 40px rgba(0,0,0,0.4); }

        .post-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .avatar { width: 50px; height: 50px; background: linear-gradient(45deg, var(--p), var(--b)); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #000; font-size: 20px; }
        .user-id { font-weight: 700; font-size: 16px; display: flex; align-items: center; }
        .blue-tick { color: var(--b); font-size: 13px; margin-left: 6px; }

        .content-text { font-size: 17px; line-height: 1.6; color: #f0f0f0; margin-bottom: 15px; }

        /* Actions - Interaction Grid */
        .action-bar { display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 18px; }
        .btn-group { display: flex; gap: 22px; }
        .btn-action { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 6px; }
        .btn-action:hover { color: var(--p); transform: scale(1.15); }

        /* Floating Bottom Nav */
        .bottom-nav { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 92%; max-width: 450px; background: rgba(0,0,0,0.7); backdrop-filter: blur(30px); border-radius: 40px; border: 1px solid var(--border); display: flex; justify-content: space-around; padding: 18px; z-index: 1000; box-shadow: 0 20px 60px rgba(0,0,0,0.8); }
        .bottom-nav i { font-size: 22px; color: rgba(255,255,255,0.5); cursor: pointer; transition: 0.3s; }
        .bottom-nav i:hover { color: var(--p); transform: scale(1.2); }

        /* Modals */
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 2000; align-items: center; justify-content: center; }
        .modal { background: #0a0a0a; border: 1px solid var(--p); padding: 35px; border-radius: 35px; width: 90%; max-width: 400px; text-align: center; }
        textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 18px; color: white; padding: 15px; font-size: 16px; outline: none; margin: 15px 0; resize: none; }
        .primary-btn { background: white; color: black; border: none; padding: 12px 30px; border-radius: 50px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .primary-btn:hover { background: var(--p); color: white; }

        @media (max-width: 600px) { .wrapper { padding-top: 75px; } .card { border-radius: 20px; } }
    </style>
</head>
<body>
    <div class="bg-layer"></div><div class="stars"></div>
    <nav class="nav">
        <div class="logo">XAVIROX</div>
        <div style="display:flex; gap:20px; align-items:center;">
            <i class="fas fa-search" style="opacity:0.6;"></i>
            <i class="fas fa-bell" onclick="alert('Universe is quiet today...')"></i>
        </div>
    </nav>

    <div class="wrapper">
        <div class="search-area">
            <input type="text" class="search-input" placeholder="${searchHint}">
        </div>
        ${content}
    </div>

    <div class="bottom-nav">
        <i class="fas fa-home" onclick="window.location='/dashboard'"></i>
        <i class="fas fa-fire"></i>
        <i class="fas fa-plus-circle" style="color:var(--p); font-size:28px;" onclick="window.scrollTo(0,0)"></i>
        <i class="fas fa-comment-alt" onclick="toggleModal('feedbackModal')"></i>
        <i class="fas fa-user-circle" onclick="window.location.href='${user.portfolioUrl}'"></i>
        <i class="fas fa-sign-out-alt" onclick="window.location='/logout'"></i>
    </div>

    <div class="modal-overlay" id="feedbackModal">
        <div class="modal">
            <h2 style="color:var(--p)">Neural Feedback</h2>
            <form action="/feedback" method="POST">
                <textarea name="message" placeholder="Help us build the Multiverse..." required></textarea>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button type="button" class="primary-btn" style="background:rgba(255,255,255,0.1); color:white;" onclick="toggleModal('feedbackModal')">CLOSE</button>
                    <button type="submit" class="primary-btn">SEND SIGNAL</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function toggleModal(id) {
            const m = document.getElementById(id);
            m.style.display = (m.style.display === 'flex') ? 'none' : 'flex';
        }
        async function vote(id, type) {
            const res = await fetch('/api/vote/'+id, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type}) });
            const data = await res.json();
            if(data.success) document.getElementById('v-'+id).innerText = data.newVotes;
        }
        async function save(id) { 
            await fetch('/api/save/'+id, {method:'POST'}); 
            alert("Data Archived in Nebula.");
        }
    </script>
</body>
</html>
`;

// --- 5. ROUTES (Auth, Dashboard, API) ---

app.get('/dashboard', isAuth, async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const user = await User.findById(req.session.user._id);

    const postFeed = posts.map(p => {
        const isXavi = p.author.toLowerCase() === 'xavi';
        return `
        <div class="card">
            <div class="post-header">
                <div class="avatar" style="${isXavi ? 'border:2px solid var(--p)' : ''}">${p.author[0].toUpperCase()}</div>
                <div class="user-info">
                    <div class="user-id">@${p.author} ${isXavi ? '<i class="fas fa-certificate blue-tick"></i>' : ''}</div>
                    <div style="font-size:11px; opacity:0.5;">${p.community} • Cosmic Time</div>
                </div>
            </div>
            <div class="content-text">${p.content}</div>
            <div class="action-bar">
                <div class="btn-group">
                    <button class="btn-action" onclick="vote('${p._id}', 'up')"><i class="fas fa-heart"></i> <span id="v-${p._id}">${p.votes}</span></button>
                    <button class="btn-action" onclick="vote('${p._id}', 'down')"><i class="fas fa-heart-broken"></i></button>
                </div>
                <div class="btn-group">
                    <button class="btn-action" onclick="navigator.clipboard.writeText(window.location.href); alert('Portal Link Copied!')"><i class="fas fa-share-alt"></i></button>
                    <button class="btn-action" onclick="save('${p._id}')"><i class="far fa-bookmark"></i></button>
                </div>
            </div>
        </div>`;
    }).join('');

    const mainHTML = `
        <div class="card">
            <form action="/addpost" method="POST">
                <textarea name="content" style="height:80px; margin:0;" placeholder="What's happening in your universe?" required></textarea>
                <button type="submit" class="primary-btn" style="float:right; margin-top:12px;">TRANSMIT</button>
            </form>
            <div style="clear:both;"></div>
        </div>
        <div id="feed">${postFeed}</div>
    `;

    res.send(UI_SHELL(mainHTML, user, "🔍 Search vibes, users, or the tea..."));
});

// Authentication Routes
app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="background:rgba(255,255,255,0.05); padding:50px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); width:350px; text-align:center; backdrop-filter:blur(20px);">
            <h1 style="letter-spacing:5px; background:linear-gradient(to right, #ff007f, #007AFF); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">XAVIROX</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; border:none; background:rgba(255,255,255,0.1); color:white; outline:none;">
                <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:15px; margin:10px 0; border-radius:15px; border:none; background:rgba(255,255,255,0.1); color:white; outline:none;">
                <button style="width:100%; padding:15px; border-radius:50px; border:none; background:white; font-weight:900; cursor:pointer; margin-top:10px;">INITIALIZE</button>
            </form>
            <p style="font-size:12px; opacity:0.5; margin-top:20px;">Missing ID? <a href="/signup" style="color:#ff007f;">Sync Identity</a></p>
        </div>
    </body>`);
});

app.post('/signup', async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10);
    await new User({ username: req.body.username, password: hashed }).save();
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else { res.send("<script>alert('L + Ratio + Wrong Key'); window.location='/login';</script>"); }
});

// Logic Routes
app.post('/addpost', isAuth, async (req, res) => {
    await new Post({ author: req.session.user.username, content: req.body.content }).save();
    res.redirect('/dashboard');
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

app.post('/feedback', isAuth, async (req, res) => {
    await new Feedback({ sender: req.session.user.username, message: req.body.message }).save();
    res.send("<script>alert('Signal Received by XAVIROX Command Center!'); window.location='/dashboard';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

// --- 6. INITIALIZATION ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 NEURAL NETWORK ACTIVE ON PORT ${PORT}`));