const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer'); 
const app = express();

// --- 1. DATABASE CONNECTION ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log('🌌 COSMIC CORE: ONLINE'))
    .catch(err => console.error('💥 NEURAL COLLAPSE:', err));

// --- 2. DATA MODELS ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }]
});

const PostSchema = new mongoose.Schema({
    author: String,
    content: { type: String, required: true },
    mediaUrl: String,      
    mediaType: String,
    isAnonymous: { type: Boolean, default: false },
    votes: { type: Number, default: 0 },
    votedBy: [String],
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// --- 3. MIDDLEWARES & CONFIG ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'xavirox_nebula_ultra_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } }); 

const isAuthAction = (req, res, next) => {
    if (req.session.user) return next();
    res.send("<script>alert('Neural ID required!'); window.location='/login';</script>");
};

// --- 4. THE SUPREME MASTER UI (Glassmorphism & Glow Edition) ---
const MASTER_UI = (content, user, isOwner) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
    <title>XAVIROX | Universe</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { 
            --p: #ff007f; 
            --b: #007AFF; 
            --glass: rgba(255, 255, 255, 0.05); /* Transparent Base */
            --border: rgba(255, 255, 255, 0.1); 
            --glow: rgba(255, 0, 127, 0.4);
        }
        
        * { box-sizing: border-box; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        body { margin: 0; background: #000; color: white; font-family: -apple-system, BlinkMacSystemFont, sans-serif; overflow-x: hidden; }
        
        /* COSMIC BACKGROUND */
        .universe-bg { position: fixed; top: 0; width: 100%; height: 100%; background: radial-gradient(circle at 50% 50%, #150030 0%, #000 100%); z-index: -3; }
        .stars { 
            position: fixed; top: 0; width: 100%; height: 100%; 
            background: url('https://www.transparenttextures.com/patterns/stardust.png'); 
            opacity: 0.3; z-index: -2; animation: twinkle 6s infinite alternate; 
        }
        @keyframes twinkle { from { opacity: 0.2; transform: scale(1); } to { opacity: 0.5; transform: scale(1.05); } }

        /* NAVIGATION WITH BLUR */
        .nav { 
            position: fixed; top: 0; width: 100%; height: 70px; 
            background: rgba(0, 0, 0, 0.6); 
            backdrop-filter: blur(25px); /* Strong Blur */
            -webkit-backdrop-filter: blur(25px);
            border-bottom: 1px solid var(--border); 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 0 30px; z-index: 1000; 
        }
        .logo { font-size: 26px; font-weight: 900; background: linear-gradient(45deg, var(--p), var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 3px; cursor: pointer; }
        
        /* MAIN LAYOUT */
        .main-wrapper { display: flex; max-width: 1200px; margin: 90px auto; padding: 0 20px 120px; gap: 30px; }
        .feed-container { flex: 2; min-width: 0; }
        .sidebar-container { flex: 1; }
        
        /* GLASS CARDS */
        .card { 
            background: var(--glass); 
            border-radius: 28px; 
            padding: 25px; 
            margin-bottom: 25px; 
            border: 1px solid var(--border); 
            backdrop-filter: blur(20px); /* Core Glassmorphism */
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        
        .card:hover { 
            border-color: rgba(255, 0, 127, 0.5); 
            box-shadow: 0 0 30px var(--glow); 
            transform: translateY(-8px) scale(1.01);
            background: rgba(255, 255, 255, 0.08);
        }

        /* INPUTS & BUTTONS */
        textarea { 
            width: 100%; background: rgba(0, 0, 0, 0.2); 
            border: 1px solid var(--border); border-radius: 18px; 
            color: white; padding: 18px; outline: none; resize: none; font-size: 16px;
        }
        textarea:focus { border-color: var(--b); box-shadow: 0 0 15px rgba(0, 122, 255, 0.4); background: rgba(0,0,0,0.4); }

        .primary-btn { 
            background: #fff; color: #000; border: none; padding: 12px 28px; 
            border-radius: 50px; font-weight: 900; cursor: pointer;
            box-shadow: 0 4px 15px rgba(255,255,255,0.2);
        }
        .primary-btn:hover { background: var(--p); color: white; box-shadow: 0 0 20px var(--p); transform: scale(1.1); }

        .comm-tag { 
            background: rgba(255,255,255,0.03); color: var(--b); padding: 12px 18px; 
            border-radius: 18px; font-size: 14px; cursor: pointer; margin-bottom: 12px; 
            display: flex; align-items: center; gap: 12px; border: 1px solid var(--border); 
        }
        .comm-tag:hover { background: var(--b); color: white; border-color: white; transform: translateX(10px); }

        .post-media { width: 100%; border-radius: 20px; margin-top: 18px; border: 1px solid var(--border); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }

        /* TAB BAR BLUR */
        .tab-bar { 
            position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); 
            width: 90%; max-width: 420px; background: rgba(0, 0, 0, 0.7); 
            backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
            border-radius: 50px; display: flex; justify-content: space-around; 
            padding: 18px; border: 1px solid var(--border); z-index: 1000;
        }
        .tab-bar i { font-size: 22px; color: rgba(255,255,255,0.4); cursor: pointer; }
        .tab-bar i:hover { color: var(--p); transform: translateY(-5px) scale(1.2); }

        @media (max-width: 900px) { .main-wrapper { flex-direction: column; } .sidebar-container { order: 2; } }
    </style>
</head>
<body>
    <div class="universe-bg"></div><div class="stars"></div>
    
    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        ${!user ? `<button onclick="location.href='/login'" class="primary-btn">SYNC</button>` : `<div style="font-size:13px; font-weight:600; color:var(--b);">@${user.username}</div>`}
    </nav>

    <div class="main-wrapper">
        <div class="feed-container">
            ${user ? `
            <div class="card" style="border-top: 2px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" placeholder="Broadcast your signal to the nebula..." required></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:18px;">
                        <label style="cursor:pointer; font-size:22px; opacity:0.6;"><i class="fas fa-image"></i> <input type="file" name="media" hidden accept="image/*,video/*"></label>
                        <div style="display:flex; align-items:center; gap:10px; font-size:13px; opacity:0.8;">
                            <input type="checkbox" name="isAnonymous"> <span>Ghost Mode</span>
                        </div>
                        <button type="submit" class="primary-btn" style="background:var(--p); color:white;">TRANSMIT</button>
                    </div>
                </form>
            </div>` : ''}
            <div id="feed-flow">${content}</div>
        </div>

        <div class="sidebar-container">
            <div class="card">
                <h4 style="margin-top:0; color:var(--b); letter-spacing:1px;"><i class="fas fa-meteor"></i> SECTORS</h4>
                <div class="comm-tag"><i class="fas fa-code"></i> #Dev_Nebula</div>
                <div class="comm-tag"><i class="fas fa-user-secret"></i> #Shadow_Room</div>
                <div class="comm-tag"><i class="fas fa-bolt"></i> #Viral_Signals</div>
                <button class="primary-btn" style="width:100%; font-size:12px; background:transparent; color:white; border:1px solid var(--border); margin-top:10px;">+ NEW SECTOR</button>
            </div>
            <div class="card">
                <h4 style="margin-top:0;"><i class="fas fa-paper-plane"></i> FEEDBACK</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Write to Xavi..." style="height:70px;"></textarea>
                    <button class="primary-btn" style="width:100%; margin-top:15px; background:white; color:black;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>

    <div class="tab-bar">
        <i class="fas fa-home" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fire"></i>
        <i class="fas fa-plus-circle" style="color:var(--p); font-size:32px;" onclick="window.scrollTo({top: 0, behavior: 'smooth'})"></i>
        <i class="fas fa-ghost"></i>
        ${user ? `<i class="fas fa-power-off" onclick="location.href='/logout'"></i>` : `<i class="fas fa-key" onclick="location.href='/login'"></i>`}
    </div>
</body>
</html>`;

// --- 5. SERVER ROUTES ---

app.get('/dashboard', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const user = req.session.user ? await User.findById(req.session.user._id) : null;
    
    const postHTML = posts.map(p => {
        const isXavi = (p.author === 'xavi' || p.author === 'xavirox') && !p.isAnonymous;
        const name = p.isAnonymous ? 'Anonymous_Entity' : p.author;
        
        let media = '';
        if (p.mediaUrl) {
            media = p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`;
        }

        return `
        <div class="card" style="${p.isAnonymous ? 'border-bottom: 2px solid #333; opacity:0.9;' : ''}">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                <div style="width:45px; height:45px; background:${p.isAnonymous ? '#222' : 'linear-gradient(135deg, var(--p), var(--b))'}; border-radius:15px; display:flex; align-items:center; justify-content:center; font-weight:bold; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    ${name[0].toUpperCase()}
                </div>
                <div>
                    <div style="font-weight:900; ${p.isAnonymous ? 'color:#888; font-style:italic;' : ''}">
                        @${name} ${isXavi ? '<i class="fas fa-check-circle" style="color:var(--b); margin-left:5px;"></i>' : ''}
                    </div>
                    <div style="font-size:11px; opacity:0.4;">${new Date(p.date).toLocaleString()}</div>
                </div>
            </div>
            <div style="font-size:17px; line-height:1.6; letter-spacing:0.3px;">${p.content}</div>
            ${media}
            <div style="margin-top:20px; display:flex; gap:30px; opacity:0.5; font-size:18px;">
                <i class="far fa-heart" style="cursor:pointer;"></i>
                <i class="far fa-comment-dots" style="cursor:pointer;"></i>
                <i class="fas fa-share-nodes" style="cursor:pointer;"></i>
            </div>
        </div>`;
    }).join('');

    res.send(MASTER_UI(postHTML, user, user?.username === 'xavi'));
});

// Post creation logic
app.post('/addpost', isAuthAction, upload.single('media'), async (req, res) => {
    let mediaUrl = ''; let mediaType = '';
    if (req.file) {
        mediaUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        mediaType = req.file.mimetype;
    }
    await new Post({ 
        author: req.session.user.username, 
        content: req.body.content,
        isAnonymous: req.body.isAnonymous === 'on',
        mediaUrl, mediaType
    }).save();
    res.redirect('/dashboard');
});

// Auth Routes (Sign up / Login)
app.post('/signup', async (req, res) => {
    const user = req.body.username.toLowerCase().trim();
    if(['xavi', 'admin', 'xavirox'].includes(user)) return res.send("<script>alert('ID Reserved!'); window.location='/signup';</script>");
    const hashed = await bcrypt.hash(req.body.password, 10);
    await new User({ username: user, email: req.body.email.toLowerCase(), password: hashed }).save();
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else { res.send("<script>alert('Access Denied!'); window.location='/login';</script>"); }
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <div class="card" style="width:340px; text-align:center; padding:50px; border:1px solid var(--p); background:rgba(255,255,255,0.05); backdrop-filter:blur(30px);">
            <h2 style="color:var(--p); font-weight:900; letter-spacing:2px;">LOG-IN</h2>
            <form action="/login" method="POST">
                <input name="username" placeholder="Neural ID" required style="width:100%; padding:14px; margin:12px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;">
                <input name="password" type="password" placeholder="Passkey" required style="width:100%; padding:14px; margin:12px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;">
                <button style="width:100%; padding:14px; border-radius:50px; background:white; font-weight:bold; margin-top:15px; cursor:pointer;">AUTHORIZE</button>
            </form>
            <p style="font-size:12px; margin-top:25px; opacity:0.5;">New Entity? <a href="/signup" style="color:var(--p); text-decoration:none;">Sync Here</a></p>
        </div>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
        <div class="card" style="width:340px; text-align:center; padding:45px; border:1px solid var(--b); background:rgba(255,255,255,0.05); backdrop-filter:blur(30px);">
            <h2 style="color:var(--b); font-weight:900; letter-spacing:1px;">REGISTER</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Choose ID" required style="width:100%; padding:14px; margin:12px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;">
                <input name="email" type="email" placeholder="Email" required style="width:100%; padding:14px; margin:12px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;">
                <input name="password" type="password" placeholder="Set Key" required style="width:100%; padding:14px; margin:12px 0; border-radius:12px; background:rgba(255,255,255,0.1); border:none; color:white; outline:none;">
                <button style="width:100%; padding:14px; border-radius:50px; background:var(--b); color:white; font-weight:bold; cursor:pointer;">SYNC DATA</button>
            </form>
        </div>
    </body>`);
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

// --- FEEDBACK SIGNAL ---
app.post('/send-feedback', isAuthAction, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { 
        $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
    });
    res.send("<script>alert('Signal Received by Xavi!'); window.location='/dashboard';</script>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('🚀 XAVIROX SUPREME CORE: ONLINE'));