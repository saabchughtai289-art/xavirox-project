const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();

// --- 1. CONFIGURATION & DATABASE SYNC ---
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log('🌌 COSMIC CORE: ONLINE'))
    .catch(err => console.error('💥 NEURAL COLLAPSE:', err));

// --- 2. SCHEMAS (Expanded Logic) ---
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

// --- 3. MIDDLEWARES & ASSETS ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'xavirox_nebula_ultra_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- 4. THE FULL SCALE UI (Merged & Expanded) ---
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

        /* Animated Universe Background */
        .universe-bg { position: fixed; top: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 0%, #1a0136 0%, #000 80%); z-index: -2; }
        .stars { position: fixed; top: 0; width: 100%; height: 100%; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.3; z-index: -1; animation: drift 200s linear infinite; }
        @keyframes drift { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }

        /* Full Size Navbar */
        .nav { position: fixed; top: 0; width: 100%; height: 70px; background: rgba(0,0,0,0.8); backdrop-filter: blur(25px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 30px; z-index: 1000; }
        .logo { font-size: 26px; font-weight: 900; background: linear-gradient(to right, var(--p), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 3px; }

        /* Responsive Master Layout */
        .main-wrapper { display: flex; max-width: 1200px; margin: 90px auto; padding: 0 20px 120px; gap: 30px; }
        .feed-container { flex: 2; min-width: 0; }
        .sidebar-container { flex: 1; min-width: 320px; }

        /* Massive Cards */
        .card { background: var(--glass); border-radius: 30px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); backdrop-filter: blur(30px); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .card:hover { border-color: var(--p); transform: translateY(-5px); box-shadow: 0 15px 40px rgba(255, 0, 127, 0.1); }

        .avatar { width: 55px; height: 55px; background: linear-gradient(45deg, var(--p), var(--b)); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 22px; color: #000; }
        .blue-tick { color: var(--b); font-size: 14px; margin-left: 8px; }

        textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 20px; color: white; padding: 18px; font-size: 16px; outline: none; resize: none; margin-bottom: 15px; transition: 0.3s; }
        textarea:focus { border-color: var(--p); background: rgba(255,255,255,0.1); }

        .primary-btn { background: white; color: black; border: none; padding: 14px 30px; border-radius: 50px; font-weight: 900; cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        .primary-btn:hover { background: var(--p); color: white; transform: scale(1.05); }

        /* Sidebar UI */
        .sidebar-box { position: sticky; top: 100px; }
        .info-header { color: var(--p); font-weight: 900; font-size: 15px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        .official-mail { display: block; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 15px; border: 1px solid var(--border); color: #fff; text-decoration: none; font-size: 14px; transition: 0.3s; margin-bottom: 20px; }
        .official-mail:hover { border-color: var(--b); background: rgba(0, 122, 255, 0.1); }

        /* Interaction Buttons */
        .action-row { display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 10px; }
        .action-btn { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 19px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
        .action-btn:hover { color: var(--p); transform: scale(1.2); }

        /* Tab Bar (Mobile Navigation) */
        .tab-bar { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 450px; background: rgba(0,0,0,0.8); backdrop-filter: blur(35px); border-radius: 40px; border: 1px solid var(--border); display: flex; justify-content: space-around; padding: 20px; z-index: 1000; box-shadow: 0 20px 50px rgba(0,0,0,0.7); }
        .tab-bar i { font-size: 24px; color: rgba(255,255,255,0.4); cursor: pointer; transition: 0.3s; }
        .tab-bar i:hover { color: var(--p); }

        @media (max-width: 950px) {
            .main-wrapper { flex-direction: column; }
            .sidebar-container { order: -1; }
            .sidebar-box { position: static; }
            .nav { padding: 0 15px; }
        }
    </style>
</head>
<body>
    <div class="universe-bg"></div><div class="stars"></div>
    <nav class="nav">
        <div class="logo">XAVIROX</div>
        <i class="fas fa-search" style="opacity:0.5; font-size:20px;"></i>
    </nav>

    <div class="main-wrapper">
        <div class="feed-container">
            <div class="card">
                <form action="/addpost" method="POST">
                    <textarea name="content" placeholder="Drop your neural vibe..." required></textarea>
                    <button type="submit" class="primary-btn" style="float:right;">TRANSMIT</button>
                    <div style="clear:both;"></div>
                </form>
            </div>
            <div id="feed-flow">${content}</div>
        </div>

        <div class="sidebar-container">
            <div class="card sidebar-box">
                <div class="info-header"><i class="fas fa-shield-alt"></i> COMMAND CENTER</div>
                <p style="font-size:13px; opacity:0.6; line-height:1.6;">For queries, copyright claims, or content removal requests, contact our official neural node:</p>
                <a href="mailto:xavirox.co@gmail.com" class="official-mail">
                    <i class="fas fa-envelope" style="color:var(--p); margin-right:10px;"></i> xavirox.co@gmail.com
                </a>

                <div style="margin-top:30px;">
                    <div class="info-header"><i class="fas fa-comment-dots"></i> PRIVATE SIGNAL</div>
                    <form action="/send-feedback" method="POST">
                        <textarea name="msg" placeholder="Something to tell Xavi?" style="height:100px;" required></textarea>
                        <button class="primary-btn" style="width:100%;">SEND FEEDBACK</button>
                    </form>
                </div>

                ${isOwner ? `
                <div style="margin-top:30px; border-top:2px solid var(--p); padding-top:20px;">
                    <div class="info-header" style="color:var(--b);"><i class="fas fa-user-secret"></i> MASTER LOGS</div>
                    <div style="max-height:300px; overflow-y:auto; padding-right:5px;">
                        ${user.adminMessages.length > 0 ? user.adminMessages.reverse().map(m => `
                            <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:12px; margin-bottom:10px; border-left:3px solid var(--p);">
                                <div style="font-size:11px; font-weight:bold; color:var(--b);">@${m.from}</div>
                                <div style="font-size:13px; margin-top:5px;">${m.text}</div>
                            </div>
                        `).join('') : '<p style="font-size:12px; opacity:0.4;">No signals yet.</p>'}
                    </div>
                </div>` : ''}
            </div>
        </div>
    </div>

    <div class="tab-bar">
        <i class="fas fa-home" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fire"></i>
        <i class="fas fa-plus-circle" style="color:var(--p); font-size:30px;" onclick="window.scrollTo(0,0)"></i>
        <i class="fas fa-user-astronaut" onclick="location.href='${user.portfolioUrl}'"></i>
        <i class="fas fa-sign-out-alt" onclick="location.href='/logout'"></i>
    </div>

    <script>
        async function vote(id, type) {
            const res = await fetch('/api/vote/'+id, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type}) });
            const data = await res.json();
            if(data.success) document.getElementById('v-'+id).innerText = data.newVotes;
        }
    </script>
</body>
</html>
`;

// --- 5. LOGIC ROUTES (Merged & Bari) ---

app.get('/dashboard', isAuth, async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const user = await User.findById(req.session.user._id);
    const isOwner = user.username === 'xavi';

    const postHTML = posts.map(p => {
        const isXavi = p.author.toLowerCase() === 'xavi';
        return `
        <div class="card">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                <div class="avatar" style="${isXavi ? 'border:3px solid var(--p)' : ''}">${p.author[0].toUpperCase()}</div>
                <div>
                    <div style="font-weight:900; font-size:17px; display:flex; align-items:center;">
                        @${p.author} ${isXavi ? '<i class="fas fa-certificate blue-tick"></i>' : ''}
                    </div>
                    <div style="font-size:11px; opacity:0.5;">Global Community • 2026</div>
                </div>
            </div>
            <div style="font-size:17px; line-height:1.6; opacity:0.9;">${p.content}</div>
            <div class="action-row">
                <div style="display:flex; gap:25px;">
                    <button class="action-btn" onclick="vote('${p._id}', 'up')"><i class="fas fa-heart"></i> <span id="v-${p._id}">${p.votes}</span></button>
                    <button class="action-btn" onclick="vote('${p._id}', 'down')"><i class="fas fa-heart-broken"></i></button>
                </div>
                <div style="display:flex; gap:20px;">
                    <button class="action-btn" onclick="navigator.clipboard.writeText(window.location.href); alert('Portal Link Copied!')"><i class="fas fa-paper-plane"></i></button>
                    <button class="action-btn"><i class="far fa-bookmark"></i></button>
                </div>
            </div>
        </div>`;
    }).join('');

    res.send(MASTER_UI(postHTML, user, isOwner));
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { 
        $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
    });
    res.send("<script>alert('Signal Transmitted to Xavi!'); window.location='/dashboard';</script>");
});

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

// Auth Boilerplate
app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="background:rgba(255,255,255,0.05); padding:60px; border-radius:40px; border:1px solid rgba(255,255,255,0.1); width:400px; text-align:center; backdrop-filter:blur(20px);">
            <h1 style="letter-spacing:10px; background:linear-gradient(to right, #ff007f, #007AFF); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-size:35px; font-weight:900;">XAVIROX</h1>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" style="width:100%; padding:18px; margin:15px 0; border-radius:15px; border:none; background:rgba(255,255,255,0.08); color:white; outline:none;" required>
                <input name="password" type="password" placeholder="Access Key" style="width:100%; padding:18px; margin:15px 0; border-radius:15px; border:none; background:rgba(255,255,255,0.08); color:white; outline:none;" required>
                <button style="width:100%; padding:18px; border-radius:50px; border:none; background:white; font-weight:900; cursor:pointer; margin-top:15px; font-size:16px;">INITIALIZE CORE</button>
            </form>
            <p style="font-size:12px; opacity:0.4; margin-top:30px;">New Entity? <a href="/signup" style="color:#ff007f; text-decoration:none;">Sync with Nebula</a></p>
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
    } else { res.send("<script>alert('Credential Mismatch!'); window.location='/login';</script>"); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

app.listen(3000, () => console.log('🚀 XAVIROX SUPREME CORE ONLINE'));