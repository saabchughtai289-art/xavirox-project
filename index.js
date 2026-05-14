/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - V42 [IOS26 & GLASS-GLOW EDITION]
    FEATURES: iOS 26 Dynamic Island, Pink-Purple Aura Glow, Unhinged Prompts, Vercel Ready
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
    secret: 'xavirox_titan_core_2026', 
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
        "no account is wild 😭", "become chronically online properly", "bro skipped signup again", "accountless behavior 🚨",
        "signup before unc takes your name", "still in demo mode 😭", "stop being mysterious", "your username awaits",
        "free account btw 👀", "lurking professionally", "just sign up already 😭", "bro allergic to signup",
        "unlock main character mode", "the app misses you", "stop lurking and cook", "guest mode demon 👹",
        "make history. sign up.", "your username getting stolen rn", "zero posts, maximum lurking", "account creation fears you",
        "bro really said continue as guest 😭", "claim your username", "create your aura", "signup = instant aura"
    ];

    const unhingedPrompts = [
        "type something unhinged...", "drop your hot take here", "bro is thinking...", "enter your villain arc thoughts",
        "type before the motivation disappears", "the internet is listening 👀", "cooked or cooking?", "say something legendary",
        "your brainrot goes here", "start a war in the comments", "type like nobody screenshots", "certified yap zone",
        "summon chaos here", "drop lore immediately", "speak your truth king", "enter forbidden opinions", "post and pray",
        "write like the main character", "insert midnight thoughts", "this box can’t handle your aura", "type your daily delusion",
        "one post away from fame", "go full sigma", "the council awaits your message", "release the dopamine",
        "your intrusive thoughts called", "enter chaos mode", "drop the coldest take possible", "become viral accidentally",
        "type like a sleep-deprived genius", "the void wants your opinion", "warning: peak content only", "unleash the yapper within",
        "this textbox has trust issues", "write history or nonsense", "type your plot twist", "send vibes only", "go ahead, overshare",
        "type like you’re in an edit", "your aura increases per letter", "keyboard warrior mode activated", "feed the algorithm",
        "drop a legendary comment", "type with rizz", "say something chronically online", "become the meme",
        "type your last two braincells fighting", "drop peak fiction", "your followers aren’t ready", "enter sigma headquarters"
    ];

    const randomPrompt = unhingedPrompts[Math.floor(Math.random() * unhingedPrompts.length)];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #000; --glass: rgba(255, 255, 255, 0.05); --border: rgba(255, 255, 255, 0.1); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: var(--bg); color: #fff; font-family: 'Segoe UI', sans-serif; overflow-x: hidden; }

        /* STAR ENGINE */
        .stars-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -2; background: #000; overflow: hidden; }
        .star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.5; animation: twinkle var(--d) infinite ease-in-out; }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 8px #fff; } }

        /* iOS 26 DYNAMIC ISLAND HOVER */
        .dynamic-island { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 220px; height: 35px; background: #000; border: 1px solid var(--border); border-radius: 50px; z-index: 10000; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; letter-spacing: 1px; transition: 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); cursor: pointer; overflow: hidden; }
        .dynamic-island:hover { width: 350px; height: 60px; background: rgba(0,0,0,0.9); box-shadow: 0 0 30px rgba(255, 0, 127, 0.3); border-color: var(--p); }

        /* GLASS & GLO-AURA SYSTEM */
        .card { background: var(--glass); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid var(--border); border-radius: 30px; padding: 25px; margin-bottom: 25px; transition: 0.4s ease; position: relative; }
        .card:hover { border-color: transparent; box-shadow: 0 0 25px -5px var(--p), 0 0 25px -5px var(--v); transform: translateY(-3px); }
        
        .dock { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); width: 65px; background: var(--glass); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 50px; display: flex; flex-direction: column; padding: 35px 0; gap: 30px; align-items: center; z-index: 1000; }
        .dock i { color: rgba(255,255,255,0.3); font-size: 20px; transition: 0.3s; cursor: pointer; }
        .dock i:hover { color: var(--p); filter: drop-shadow(0 0 10px var(--p)); transform: scale(1.2); }

        .main-container { max-width: 1000px; margin: 110px auto 50px 120px; display: flex; gap: 25px; }
        .feed { flex: 2; }
        .sidebar { flex: 1; }

        .cosmic-input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 20px; color: #fff; padding: 18px; outline: none; transition: 0.3s; font-size: 15px; }
        .cosmic-input:focus { border-color: var(--cyan); box-shadow: 0 0 15px rgba(0, 242, 255, 0.2); }

        .btn-transmit { background: #fff; color: #000; border: none; padding: 12px 30px; border-radius: 50px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .btn-transmit:hover { background: var(--cyan); box-shadow: 0 0 20px var(--cyan); transform: scale(1.05); }

        .feedback-card { background: linear-gradient(135deg, rgba(255,0,127,0.1), rgba(112,0,255,0.1)); border: 1px solid var(--p); border-radius: 20px; padding: 15px; text-align: center; cursor: pointer; margin-top: 15px; }
        .feedback-card:hover { background: var(--p); color: #000; }

        footer { text-align: center; padding: 50px; font-size: 11px; opacity: 0.4; }
    </style>
</head>
<body>
    <div class="stars-container" id="stars"></div>
    
    <div class="dynamic-island" id="island">
        ${isGuest ? "STILL LURKING? 💀" : `SECTOR: ${activeSector.toUpperCase()}`}
    </div>

    <div class="dock">
        <i class="fas fa-rocket" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-fingerprint" onclick="location.href='/portfolio'"></i>
        <i class="fas fa-plus-circle" onclick="let n=prompt('Name the New Community?'); if(n) location.href='/create-sector?name='+n"></i>
        <i class="fas fa-power-off" style="color:var(--p);" onclick="location.href='/logout'"></i>
    </div>

    <div class="main-container">
        <div class="feed">
            <div class="card">
                ${isGuest ? `
                    <input class="cosmic-input" placeholder="sign up gang 💀" readonly onclick="location.href='/login'">
                    <textarea class="cosmic-input" style="height:80px; margin-top:15px;" placeholder="claim your username" readonly onclick="location.href='/login'"></textarea>
                    <button class="btn-transmit" style="margin-top:15px; width:100%" onclick="location.href='/login'">INITIALIZE SYNC</button>
                ` : `
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" class="cosmic-input" style="height:100px; background:transparent; border:none; padding:10px;" placeholder="${randomPrompt}" required></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                            <label for="media" style="cursor:pointer; opacity:0.6;"><i class="fas fa-image fa-lg"></i><input type="file" name="media" id="media" hidden></label>
                            <button class="btn-transmit">TRANSMIT</button>
                        </div>
                    </form>
                `}
            </div>
            ${content}
        </div>

        <div class="sidebar">
            <div class="card">
                <h4 style="font-size:10px; opacity:0.5; margin-bottom:15px; letter-spacing:2px;">COMMUNITIES</h4>
                <a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); margin-bottom:12px; text-decoration:none; font-weight:800;">🌏 GLOBAL</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#fff; font-size:13px; text-decoration:none; margin-top:8px; opacity:0.8;"># ${s.name.toUpperCase()}</a>`).join('')}
                
                <hr style="margin:20px 0; border:none; border-top:1px solid var(--border);">
                
                <div class="feedback-card" onclick="alert('Feedback Received, Boss!')">
                    <i class="fas fa-comment-dots"></i> FEEDBACK
                </div>
            </div>
        </div>
    </div>

    <footer>
        XAVIROX COSMIC OS © 2026 | DEV-SYNC COMPLETE<br>
        Legal & Support: <b>xavirox.co@gmail.com</b>
    </footer>

    <script>
        // STARS BACKGROUND ENGINE
        const container = document.getElementById('stars');
        for(let i=0; i<180; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2.5;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            star.style.setProperty('--d', (Math.random() * 3 + 2) + 's');
            container.appendChild(star);
        }

        // DYNAMIC ISLAND ROASTS (20s)
        const roasts = ${JSON.stringify(isGuest ? guestRoasts : [])};
        if(${isGuest}) {
            setInterval(() => {
                const island = document.getElementById('island');
                island.style.height = '10px';
                island.style.opacity = '0';
                setTimeout(() => {
                    island.innerText = roasts[Math.floor(Math.random() * roasts.length)].toUpperCase();
                    island.style.height = '35px';
                    island.style.opacity = '1';
                }, 600);
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
    const html = posts.map(p => `
        <div class="card">
            <b style="color:var(--cyan); font-size:14px;">@${p.author}</b> <small style="opacity:0.3; margin-left:8px;">#${p.sector}</small>
            <p style="margin-top:12px; line-height:1.5; font-size:15px;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:15px; border:1px solid var(--border);">` : ''}
        </div>
    `).join('');
    res.send(MASTER_UI(html || '<div class="card" style="text-align:center; opacity:0.5;">No transmissions in this sector.</div>', req.session.user, sectors, activeSector));
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
    res.send(`<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><form action="/login" method="POST" style="background:rgba(255,255,255,0.05); padding:40px; border-radius:30px; border:1px solid rgba(255,255,255,0.1); text-align:center;"><h1>SYNC IDENTITY</h1><input name="username" placeholder="USERNAME" required style="display:block; margin:20px auto; padding:15px; width:250px; background:#111; border:1px solid #333; color:#fff; border-radius:10px;"><input name="password" type="password" placeholder="SECURITY KEY" required style="display:block; margin:20px auto; padding:15px; width:250px; background:#111; border:1px solid #333; color:#fff; border-radius:10px;"><button style="padding:12px 50px; border-radius:50px; background:#fff; color:#000; font-weight:900; border:none; cursor:pointer;">SYNC</button></form></body>`);
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
    } else res.send("Access Denied.");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;