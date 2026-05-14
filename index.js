/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - V41 [STARLIGHT EDITION]
    FEATURES: Animated Glowing Stars, Updated Admin Gmail, Dynamic Island Roasts
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

// --- [DATABASE] ---
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(dbURI, { bufferCommands: false });
        isConnected = true;
    } catch (err) { console.error('❌ DB ERROR:', err); }
};

// --- [MODELS] ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    aura: { type: Number, default: 100 }
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: String, content: String, mediaUrl: String, sector: { type: String, default: 'Global' }, date: { type: Date, default: Date.now }
}));

const Sector = mongoose.models.Sector || mongoose.model('Sector', new mongoose.Schema({ 
    name: { type: String, required: true, unique: true, lowercase: true }
}));

// --- [MIDDLEWARE] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({ 
    secret: 'xavirox_star_2026', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } 
}));
app.use(async (req, res, next) => { await connectDB(); next(); });

const upload = multer({ storage: multer.memoryStorage() });

// --- [MASTER UI ENGINE] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global') => {
    const isGuest = !user;
    const guestRoasts = [
        "still lurking? 💀", "sign up lil bro", "guest mode final boss", "rawdogging the app 😭", "stop stalking, join in",
        "one signup = infinite aura", "bro fears accounts", "unlock your username", "lurking goes crazy", "create account coward",
        "npc guest mode", "anonymous menace 👁️", "join the chaos", "gang still unsigned 😭", "your aura needs an account",
        "no account is wild 😭", "become chronically online", "bro skipped signup again", "accountless behavior 🚨",
        "signup before unc takes your name", "still in demo mode 😭", "stop being mysterious", "your username awaits",
        "free account btw 👀", "lurking professionally", "just sign up already 😭", "bro allergic to signup",
        "unlock main character mode", "the app misses you", "stop lurking and cook", "guest mode demon 👹",
        "make history. sign up.", "your username getting stolen rn", "zero posts, maximum lurking", "account creation fears you"
    ];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000; --glass: rgba(255,255,255,0.03); --border: rgba(255,255,255,0.08); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: var(--bg); color: #fff; font-family: sans-serif; overflow-x: hidden; }
        
        /* STAR ENGINE */
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: radial-gradient(circle at center, #111 0%, #000 100%); overflow: hidden; }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.5; animation: twinkle var(--d) infinite ease-in-out; }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); box-shadow: 0 0 0px #fff; } 50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 10px #fff; } }

        /* DYNAMIC ISLAND */
        .dynamic-island { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 280px; height: 40px; background: #000; border: 1px solid var(--border); border-radius: 30px; z-index: 10000; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; letter-spacing: 1px; transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 0 20px rgba(112,0,255,0.2); }

        .feedback-btn { position: fixed; right: -40px; top: 50%; transform: rotate(-90deg); background: var(--cyan); color: #000; padding: 10px 20px; border-radius: 10px 10px 0 0; font-weight: 900; font-size: 12px; cursor: pointer; z-index: 999; }

        .dock { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); width: 60px; background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 50px; display: flex; flex-direction: column; padding: 30px 0; gap: 25px; align-items: center; }
        .dock i { color: rgba(255,255,255,0.4); font-size: 18px; cursor: pointer; }
        .dock i:hover { color: var(--cyan); }

        .main-container { max-width: 900px; margin: 100px auto 50px 100px; display: flex; gap: 20px; }
        .card { background: var(--glass); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 25px; padding: 20px; margin-bottom: 20px; }
        .btn-transmit { background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 50px; font-weight: 800; cursor: pointer; }
        
        .guest-input { width: 100%; background: #111; border: 1px solid #333; padding: 12px; border-radius: 10px; color: #fff; margin-bottom: 15px; cursor: pointer; }
        footer { text-align: center; padding: 40px; font-size: 11px; opacity: 0.5; border-top: 1px solid var(--border); }
    </style>
</head>
<body>
    <div class="stars-container" id="stars"></div>
    
    <div class="dynamic-island" id="island">
        ${isGuest ? "STILL LURKING? 💀" : `SECTOR: ${activeSector.toUpperCase()}`}
    </div>

    <div class="feedback-btn" onclick="alert('Feedback Received, Boss!')">FEEDBACK</div>

    <div class="dock">
        <i class="fas fa-rocket" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fingerprint" onclick="location.href='/portfolio'"></i>
        <i class="fas fa-plus-circle" onclick="let n=prompt('New Community Name?'); if(n) location.href='/create-sector?name='+n"></i>
        <i class="fas fa-power-off" style="color:var(--p);" onclick="location.href='/logout'"></i>
    </div>

    <div class="main-container">
        <div style="flex:2">
            ${isGuest ? `
                <div class="card">
                    <input class="guest-input" placeholder="sign up gang 💀" readonly onclick="location.href='/login'">
                    <textarea class="guest-input" style="height:60px" placeholder="claim your username" readonly onclick="location.href='/login'"></textarea>
                    <button class="btn-transmit" onclick="location.href='/login'">SYNC IDENTITY</button>
                </div>
            ` : `
                <div class="card">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" style="width:100%; background:transparent; border:none; color:#fff; outline:none;" placeholder="What's on your mind?" required></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; margin-top:15px;">
                            <input type="file" name="media" id="media" hidden><label for="media" style="cursor:pointer"><i class="fas fa-image"></i></label>
                            <button class="btn-transmit">TRANSMIT</button>
                        </div>
                    </form>
                </div>
            `}
            ${content}
        </div>
        <div style="flex:1">
            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; margin-bottom:15px; letter-spacing:2px;">COMMUNITIES</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:10px; text-decoration:none;">🌏 GLOBAL</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#fff; font-size:13px; text-decoration:none; margin-top:5px;"># ${s.name.toUpperCase()}</a>`).join('')}
            </div>
        </div>
    </div>

    <footer>
        XAVIROX COSMIC OS © 2026<br>
        Legal & Support: <b>xavirox.co@gmail.com</b>
    </footer>

    <script>
        // STAR GENERATOR
        const container = document.getElementById('stars');
        for(let i=0; i<150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            star.style.setProperty('--d', (Math.random() * 3 + 2) + 's');
            container.appendChild(star);
        }

        // DYNAMIC ISLAND ROASTS
        const roasts = ${JSON.stringify(isGuest ? guestRoasts : [])};
        if(${isGuest}) {
            setInterval(() => {
                const island = document.getElementById('island');
                island.style.transform = 'translateX(-50%) scale(0.8)';
                setTimeout(() => {
                    island.innerText = roasts[Math.floor(Math.random() * roasts.length)].toUpperCase();
                    island.style.transform = 'translateX(-50%) scale(1)';
                }, 500);
            }, 20000);
        }
    </script>
</body></html>`;
};

// --- [CORE ROUTES] ---
app.get('/dashboard', async (req, res) => {
    const activeSector = req.query.sector || 'Global';
    const posts = await Post.find(activeSector !== 'Global' ? { sector: activeSector } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    const html = posts.map(p => `<div class="card"><b style="color:var(--cyan)">@${p.author}</b> <small style="opacity:0.3">#${p.sector}</small><p style="margin-top:10px">${p.content}</p>${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:15px; margin-top:10px">` : ''}</div>`).join('');
    res.send(MASTER_UI(html || '<div class="card">No transmissions found.</div>', req.session.user, sectors, activeSector));
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    await User.findOneAndUpdate({ username: req.session.user.username }, { $inc: { aura: 10 } });
    res.redirect('back');
});

app.get('/create-sector', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const name = req.query.name.toLowerCase();
    if (name) await new Sector({ name }).save();
    res.redirect('/dashboard?sector=' + name);
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh;"><form action="/login" method="POST" style="text-align:center;"><h1>SYNC IDENTITY</h1><input name="username" placeholder="ID" required style="display:block; margin:10px auto; padding:10px;"><input name="password" type="password" placeholder="KEY" required style="display:block; margin:10px auto; padding:10px;"><button style="padding:10px 40px; border-radius:50px; cursor:pointer;">SYNC</button></form></body>`);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
        const hashed = await bcrypt.hash(password, 10);
        user = await new User({ username: username.toLowerCase(), password: hashed }).save();
    }
    if (await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else res.send("Denied.");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;