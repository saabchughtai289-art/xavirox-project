// ==========================================
// XAVIROX COSMIC CORE ENGINE - VER 12.0 (THE UNHINGED MERGE)
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const app = express();

// --- 1. CORE DATABASE CONNECTION (NEURAL LINK) ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log('🌌 [COSMIC LOG]: DATABASE SYNCED SUCCESSFULLY'))
    .catch(err => console.error('💥 [CRITICAL ERROR]: DB CONNECTION FAILED', err));

// --- 2. DATA ARCHITECTURE ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    mediaType: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// --- 3. INFRASTRUCTURE MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({
    secret: 'xavirox_nebula_supreme_unhinged_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 } 
});

const isAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.send(`<script>alert('Vibe Check Failed: Login to transmit!'); window.location='/login';</script>`);
};

// --- 4. THE SUPREME UI (PUBLIC VIEW + UNHINGED PLACEHOLDERS) ---
const MASTER_UI = (content, user) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>XAVIROX | Event Horizon</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        :root { --p: #ff007f; --b: #007AFF; --v: #7000ff; --glass: rgba(255, 255, 255, 0.04); --border: rgba(255, 255, 255, 0.12); }
        * { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.4s ease; }
        body { background: #000; color: #fff; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }

        .black-hole { position: fixed; top: 50%; left: 65%; transform: translate(-50%, -50%); width: 500px; height: 500px; background: #000; border-radius: 50%; box-shadow: 0 0 60px 20px #fff, 0 0 140px 60px var(--v), 0 0 240px 90px var(--p); z-index: -5; opacity: 0.35; filter: blur(60px); animation: pulse 12s infinite alternate; }
        @keyframes pulse { from { transform: scale(1); opacity: 0.3; } to { transform: scale(1.2); opacity: 0.5; } }
        .stars { position: fixed; top: 0; width: 100%; height: 100%; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.4; z-index: -4; }

        .side-dock { position: fixed; left: 25px; top: 50%; transform: translateY(-50%); width: 75px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(50px); -webkit-backdrop-filter: blur(50px); border: 1px solid var(--border); border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 40px 0; gap: 45px; z-index: 2000; }
        .side-dock i { font-size: 24px; color: rgba(255,255,255,0.4); cursor: pointer; }
        .side-dock i:hover { color: var(--p); transform: scale(1.3); filter: drop-shadow(0 0 10px var(--p)); }
        .add-btn { width: 50px; height: 50px; background: var(--p); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; }

        .nav { position: fixed; top: 0; width: 100%; height: 85px; background: rgba(0,0,0,0.7); backdrop-filter: blur(35px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 50px 0 130px; z-index: 1000; }
        .logo { font-size: 28px; font-weight: 900; background: linear-gradient(to right, var(--p), #fff, var(--b)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 6px; cursor: pointer; }

        .main-wrapper { display: flex; max-width: 1250px; margin: 110px 0 150px 130px; padding-right: 40px; gap: 40px; }
        .feed-container { flex: 2; min-width: 0; }
        .sidebar-container { flex: 1; }

        .card { background: var(--glass); border-radius: 35px; padding: 30px; margin-bottom: 35px; border: 1px solid var(--border); backdrop-filter: blur(40px); }
        .card:hover { border-color: var(--p); box-shadow: 0 0 50px rgba(255, 0, 127, 0.2); }

        textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 25px; color: white; padding: 22px; outline: none; resize: none; font-size: 17px; }
        textarea:disabled { opacity: 0.5; cursor: not-allowed; }

        .primary-btn { background: white; color: black; border: none; padding: 16px 35px; border-radius: 60px; font-weight: 900; cursor: pointer; }
        .primary-btn:hover:not(:disabled) { background: var(--p); color: white; box-shadow: 0 0 25px var(--p); }

        .post-media { width: 100%; border-radius: 25px; margin-top: 25px; border: 1px solid var(--border); }
        .footer { text-align: center; padding: 70px 20px; opacity: 0.6; font-size: 13px; border-top: 1px solid var(--border); margin-left: 130px; }
        .footer a { color: var(--p); text-decoration: none; font-weight: bold; }

        @media (max-width: 900px) {
            .main-wrapper { margin: 100px 20px 150px; flex-direction: column; padding-right: 0; }
            .side-dock { left: 50%; top: auto; bottom: 25px; transform: translateX(-50%); flex-direction: row; width: 92%; height: 75px; padding: 0 25px; }
            .footer { margin-left: 0; }
        }
    </style>
</head>
<body>
    <div class="black-hole"></div><div class="stars"></div>
    
    <div class="side-dock">
        <i class="fas fa-home" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fire-alt"></i>
        <div class="add-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})"><i class="fas fa-plus"></i></div>
        <i class="fas fa-user-astronaut"></i>
        ${user ? `<i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);"></i>` : `<i class="fas fa-key" onclick="location.href='/login'"></i>`}
    </div>

    <nav class="nav">
        <div class="logo" onclick="location.href='/dashboard'">XAVIROX</div>
        <div>${user ? `<span style="font-size: 13px; font-weight: bold; color: var(--b);">@${user.username}</span>` : ''}</div>
    </nav>

    <div class="main-wrapper">
        <div class="feed-container">
            <div class="card" style="border-left: 6px solid var(--p);">
                <form action="/addpost" method="POST" enctype="multipart/form-data">
                    <textarea name="content" id="genz-input" ${user ? '' : 'disabled'} required></textarea>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px;">
                        <label style="cursor:${user ? 'pointer' : 'not-allowed'}; font-size:26px; color: var(--b); opacity: ${user ? '1' : '0.3'};">
                            <i class="fas fa-cloud-upload-alt"></i> 
                            ${user ? '<input type="file" name="media" hidden accept="image/*,video/*">' : ''}
                        </label>
                        <div style="font-size:14px; font-weight: bold; opacity: ${user ? '0.8' : '0.3'};">
                            <input type="checkbox" name="isAnonymous" ${user ? '' : 'disabled'}> Ghost Mode 👻
                        </div>
                        ${user ? `<button type="submit" class="primary-btn" style="background:var(--p); color:white;">TRANSMIT</button>` : `<button type="button" onclick="location.href='/login'" class="primary-btn">LOGIN TO POST</button>`}
                    </div>
                </form>
            </div>
            <div id="feed-flow">${content}</div>
        </div>

        <div class="sidebar-container">
            <div class="card">
                <h4 style="color:var(--b); margin-bottom: 20px;">ACTIVE SECTORS</h4>
                <p style="font-size:14px; opacity:0.6;">#Viral_Bangers<br>#No_Cap_Energy</p>
            </div>
            <div class="card">
                <p style="font-size:12px; text-align:center;">Support: <a href="mailto:xavirox.co@gmail.com">xavirox.co@gmail.com</a></p>
            </div>
        </div>
    </div>

    <footer class="footer">
        <p>XAVIROX CORE V12 | <a href="mailto:xavirox.co@gmail.com">DMCA/SUPPORT</a></p>
    </footer>

    <script>
        const unhingedLines = [
            "type something unhinged...", "drop your hot take here", "bro is thinking...", "enter your villain arc thoughts", "type before the motivation disappears", "the internet is listening 👀", "cooked or cooking?", "say something legendary", "your brainrot goes here", "start a war in the comments", "type like nobody screenshots", "certified yap zone", "summon chaos here", "drop lore immediately", "speak your truth king", "type something your future self regrets", "enter forbidden opinions", "post and pray", "write like the main character", "start typing before the cringe hits", "insert midnight thoughts", "say it louder for the lurkers", "this box can’t handle your aura", "type your daily delusion", "one post away from fame", "internet historians are watching", "type with dramatic music playing", "go full sigma", "the council awaits your message", "release the dopamine", "type like it’s 3am", "your intrusive thoughts called", "enter chaos mode", "drop the coldest take possible", "become viral accidentally", "type something oddly specific", "your enemies might read this", "make the algorithm proud", "type like a sleep deprived genius", "enter your cinematic monologue", "say something lowkey iconic", "the void wants your opinion", "warning: peak content only", "type with unnecessary confidence", "bro definitely has something to say", "start your comeback story", "internet moment loading...", "type here before reality loads", "unleash the yapper within", "this textbox has trust issues", "write history or nonsense", "type your plot twist", "send vibes only", "type your rarest thought", "enter emotional damage here", "go ahead, overshare", "this post might age terribly", "type like you’re in an edit", "say something that starts drama", "your aura increases per letter", "keyboard warrior mode activated", "type now, think later", "this box runs on attention", "enter your daily nonsense", "the timeline needs content", "type something dangerously relatable", "feed the algorithm", "drop a legendary comment", "internet addiction starts here", "type with rizz", "this could’ve stayed in drafts", "say something chronically online", "type your shower thoughts", "reality is optional here", "type like the camera zooms in after", "post something your gc would roast", "enter elite level yapping", "type your “hear me out”", "become the meme", "write like you already went viral", "type your last two braincells fighting", "this box smells like energy drinks", "type something illegally funny", "post certified nonsense", "say something that needs context", "enter your random side quest", "type like the edits depend on it", "drop peak fiction", "type something lowkey cursed", "your followers aren’t ready", "enter sigma headquarters", "type your chaotic masterpiece", "say something with main character energy", "your wifi carried you here", "type your next bad decision", "enter thoughts.exe", "this textbox survives on drama", "type before your confidence expires", "drop internet gold", "the world wasn’t ready for this post"
        ];
        const input = document.getElementById('genz-input');
        if(input) {
            input.placeholder = input.disabled ? "Login to unleash your thoughts..." : unhingedLines[Math.floor(Math.random() * unhingedLines.length)];
        }
    </script>
</body>
</html>`;

// --- 5. ROUTES ---
app.get('/dashboard', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const user = req.session.user ? await User.findById(req.session.user._id) : null;
    const postHTML = posts.map(p => {
        let media = p.mediaUrl ? (p.mediaType.includes('video') ? `<video src="${p.mediaUrl}" controls class="post-media"></video>` : `<img src="${p.mediaUrl}" class="post-media">`) : '';
        return `<div class="card">
            <div style="font-weight:900; margin-bottom:10px;">@${p.isAnonymous ? 'Ghost_Entity' : p.author}</div>
            <div style="font-size:18px;">${p.content}</div>
            ${media}
        </div>`;
    }).join('');
    res.send(MASTER_UI(postHTML, user));
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, isAnonymous: req.body.isAnonymous === 'on', mediaUrl, mediaType: req.file ? req.file.mimetype : null }).save();
    res.redirect('/dashboard');
});

// Auth Routes (Login/Signup/Logout same as before)
app.get('/login', (req, res) => res.send('<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh;"><form action="/login" method="POST" style="text-align:center;"><input name="username" placeholder="Username" required style="display:block; padding:15px; margin:10px; border-radius:15px; border:none;"><input name="password" type="password" placeholder="Password" required style="display:block; padding:15px; margin:10px; border-radius:15px; border:none;"><button style="padding:15px 40px; border-radius:50px; background:white; border:none; font-weight:bold; cursor:pointer;">LOGIN</button><br><a href="/signup" style="color:pink; font-size:12px; margin-top:20px; display:inline-block;">New here? Signup</a></form></body>'));

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) { req.session.user = user; res.redirect('/dashboard'); }
    else res.send("<script>alert('Failed!'); window.location='/login';</script>");
});

app.get('/signup', (req, res) => res.send('<body style="background:#000; color:white; display:flex; align-items:center; justify-content:center; height:100vh;"><form action="/signup" method="POST" style="text-align:center;"><input name="username" placeholder="Username" required style="display:block; padding:15px; margin:10px; border-radius:15px; border:none;"><input name="email" placeholder="Email" required style="display:block; padding:15px; margin:10px; border-radius:15px; border:none;"><input name="password" type="password" placeholder="Password" required style="display:block; padding:15px; margin:10px; border-radius:15px; border:none;"><button style="padding:15px 40px; border-radius:50px; background:pink; border:none; font-weight:bold; cursor:pointer;">SIGNUP</button></form></body>'));

app.post('/signup', async (req, res) => {
    const hashed = await bcrypt.hash(req.body.password, 10);
    await new User({ username: req.body.username.toLowerCase(), email: req.body.email.toLowerCase(), password: hashed }).save();
    res.redirect('/login');
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

app.listen(3000, () => console.log('🚀 UNHINGED LIVE ON 3000'));