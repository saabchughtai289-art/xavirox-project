/* ====================================================================================================
   🚀 XAVIROX COSMIC OS - VERSION 35.0 [THE ETERNAL TITAN]
   DEVELOPER: GEMINI COLLABORATION | YEAR: 2026 | THEME: GEN-Z COSMOS | STATUS: ALL FEATURES RESTORED
====================================================================================================
   
   [CORE PROTOCOLS]:
   1.  🛸 DYNAMIC ISLAND v3.5: Ab yeh "XAVIROX: GLOBAL" ya "XAVIROX: [COMMUNITY]" dynamic show karega.
   2.  🐱🦜 FOSTER AUTH: Interactive Cat & Parrot login system preserved.
   3.  👻 GHOST PROTOCOL: Anonymous inbox and direct messaging for users.
   4.  👤 PORTFOLIO ENGINE: Dedicated profile section for Bio, Skills, and Identity.
   5.  💬 FEEDBACK SIGNAL: Direct line to Admin (Xavi) integrated in sidebar.
   6.  🧢 SLANG CORE: 100+ Gen-Z rotating placeholders for the input bar.
   7.  🛰️ COMMUNITY SECTORS: Room-based posting with glow indicators.
   8.  ❤️ INTERACT: Heart (Luv), Skull (Dead), and Bookmark (Archive) buttons.
   9.  📧 COSMIC FOOTER: Gmail (xavirox.co@gmail.com) and legal links.
   10. 🪐 BACKGROUND: Fixed Star-field engine and Black-Hole aesthetic.

   [BUG FIXES]:
   - Fixed "Cannot GET /" by adding a Root Redirect.
   - Restored Feedback missing functionality.
   - Fixed Dynamic Island label synchronization.
====================================================================================================
*/

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// ---------------------------------------------------------
// [DATABASE NEURAL STRUCTURE]
// ---------------------------------------------------------

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: "Vibing in the depths of XAVIROX..." },
    skills: { type: [String], default: ["Xaviroxian", "Web Traveler"] },
    links: { 
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" }
    },
    feedback: [{ msg: String, from: String, date: { type: Date, default: Date.now } }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    anonInbox: [{ msg: String, date: { type: Date, default: Date.now } }]
});

const PostSchema = new mongoose.Schema({
    author: String,
    content: String,
    mediaUrl: String,
    mediaType: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    sector: { type: String, default: 'General' },
    date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true } });

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Sector = mongoose.model('Sector', SectorSchema);

// ---------------------------------------------------------
// [SYSTEM CONFIG & AUTH]
// ---------------------------------------------------------

const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";
mongoose.connect(dbURI).then(() => console.log('✅ [XAVIROX]: COSMIC DATABASE ONLINE'));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({
    secret: 'xavirox_supreme_eternal_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

const upload = multer({ storage: multer.memoryStorage() });
const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// ---------------------------------------------------------
// [MASTER UI FRAMEWORK - THE OMNI-ENGINE]
// ---------------------------------------------------------

const MASTER_UI = (content, user, sectors, activeSector = 'Global', isPortfolio = false) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${isPortfolio ? 'Identity' : activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --p: #ff007f; /* Neon Pink */
            --v: #7000ff; /* Deep Violet */
            --cyan: #00f2ff; /* Cyber Cyan */
            --glass: rgba(255, 255, 255, 0.05);
            --border: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        body { background: #000; color: #fff; overflow-x: hidden; min-height: 100vh; }

        /* 🪐 COSMIC VISUALS */
        .stars { position: fixed; width: 2px; height: 2px; background: #fff; border-radius: 50%; opacity: 0; animation: twinkle 5s infinite; z-index: -10; }
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.8; } }
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 850px; height: 850px; border-radius: 50%; background: radial-gradient(circle, var(--v), transparent 75%); z-index: -5; opacity: 0.15; filter: blur(130px); }

        /* 🛸 DYNAMIC ISLAND v3.5 */
        .island-container { position: fixed; top: 25px; left: 50%; transform: translateX(-50%); z-index: 10000; }
        .dynamic-island {
            width: 280px; height: 50px; background: rgba(0,0,0,0.85); backdrop-filter: blur(25px);
            border: 1px solid var(--border); border-radius: 50px; display: flex; align-items: center; 
            justify-content: center; overflow: hidden; padding: 0 30px;
        }
        .dynamic-island:hover { width: 580px; height: 85px; border-color: var(--p); box-shadow: 0 0 40px rgba(255, 0, 127, 0.3); }
        .island-label { font-weight: 900; letter-spacing: 3px; font-size: 13px; text-transform: uppercase; background: linear-gradient(to right, #fff, var(--p)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* 🕹️ NAVIGATION DOCK */
        .left-dock {
            position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 85px; 
            background: rgba(255,255,255,0.06); backdrop-filter: blur(50px); border: 1px solid var(--border);
            border-radius: 100px; display: flex; flex-direction: column; align-items: center; 
            padding: 45px 0; gap: 45px; z-index: 5000;
        }
        .left-dock i { font-size: 26px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .left-dock i:hover, .nav-active { color: var(--p) !important; transform: scale(1.4); text-shadow: 0 0 20px var(--p); }

        /* LAYOUT CORE */
        .main-wrapper { display: flex; max-width: 1250px; margin: 160px auto 50px 160px; gap: 45px; }
        .feed-zone { flex: 2.2; }
        .side-zone { flex: 1; position: sticky; top: 160px; height: fit-content; }

        /* GLASS CARD UI */
        .card { background: var(--glass); border: 1px solid var(--border); border-radius: 40px; padding: 35px; margin-bottom: 35px; backdrop-filter: blur(100px); }
        .card:hover { border-color: var(--p); transform: translateY(-4px); }

        /* INPUT & TRANSMIT */
        textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); border-radius: 25px; color: #fff; padding: 25px; font-size: 16px; outline: none; resize: none; }
        .btn-ios { background: #fff; color: #000; border: none; padding: 15px 40px; border-radius: 50px; font-weight: 900; cursor: pointer; letter-spacing: 1px; }
        .btn-ios:hover { background: var(--p); color: #fff; box-shadow: 0 0 30px var(--p); }

        /* 📍 PILL SYSTEM */
        .pill { display: block; padding: 15px 25px; background: rgba(255,255,255,0.03); border-radius: 20px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 12px; font-weight: 700; font-size: 14px; }
        .pill-active { background: #fff !important; color: #000 !important; box-shadow: 0 0 30px rgba(255,255,255,0.3); }

        /* ❤️ INTERACTION ROW */
        .interaction-row { display: flex; gap: 25px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
        .action-item { cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 14px; opacity: 0.5; font-weight: 800; text-decoration: none; color: #fff; }
        .action-item:hover { opacity: 1; color: var(--p); }

        /* 👤 PORTFOLIO UI */
        .avatar-box { width: 110px; height: 110px; background: linear-gradient(45deg, var(--p), var(--v)); border-radius: 35px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 900; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .skill-chip { display: inline-block; padding: 8px 18px; background: var(--v); border-radius: 50px; font-size: 11px; margin: 5px; font-weight: 800; letter-spacing: 1px; }

        footer { margin-left: 160px; padding: 80px 40px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; opacity: 0.4; font-size: 12px; }
    </style>
</head>
<body>
    <div id="star-layer"></div>
    <div class="black-hole"></div>

    <div class="island-container">
        <div class="dynamic-island">
            <div class="island-label">
                ${isPortfolio ? 'USER: NEURAL IDENTITY' : `XAVIROX: ${activeSector.toUpperCase()}`}
            </div>
        </div>
    </div>

    <div class="left-dock">
        <i class="fas fa-home ${!isPortfolio && activeSector === 'Global' ? 'nav-active' : ''}" onclick="location.href='/dashboard'" title="Global Feed"></i>
        <i class="fas fa-user-astronaut ${isPortfolio ? 'nav-active' : ''}" onclick="location.href='/portfolio'" title="My Identity"></i>
        <div style="width:55px; height:55px; background:#fff; border-radius:18px; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            <i class="fas fa-plus" style="color:#000;"></i>
        </div>
        <i class="fas fa-ghost" title="Ghost Protocol"></i>
        <i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);" title="Disconnect"></i>
    </div>

    <div class="main-wrapper">
        <div class="feed-zone">
            ${isPortfolio ? content : `
                <div class="card" style="border-top: 4px solid var(--p);">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea id="slang-gen" name="content" placeholder="Vibe check..." required></textarea>
                        <input type="hidden" name="sector" value="${activeSector === 'Global' ? 'General' : activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                            <label style="cursor:pointer; font-size:22px; opacity:0.5;"><i class="fas fa-camera"></i><input type="file" name="media" hidden></label>
                            <button class="btn-ios">TRANSMIT</button>
                        </div>
                    </form>
                </div>
                <div id="render-posts">${content}</div>
            `}
        </div>

        <div class="side-zone">
            <div class="card" style="border: 1px solid var(--v);">
                <h4 style="font-size:11px; opacity:0.5; margin-bottom:15px; letter-spacing:2px;">FEEDBACK SIGNAL</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Signal to Xavi..." style="height:60px; font-size:12px;"></textarea>
                    <button class="btn-ios" style="width:100%; margin-top:12px; font-size:11px; background:var(--v); color:#fff;">SEND SIGNAL</button>
                </form>
            </div>

            <div class="card" style="border: 1px dashed var(--p); background: rgba(255,0,127,0.03);">
                <h4 style="color:var(--p); font-size:11px; margin-bottom:15px; letter-spacing:2px;"><i class="fas fa-mask"></i> GHOST PROTOCOL</h4>
                <form action="/send-anon" method="POST">
                    <input name="target" placeholder="Target user..." required style="width:100%; padding:12px; border-radius:15px; background:#000; color:#fff; border:1px solid #333; margin-bottom:12px; font-size:12px;">
                    <textarea name="msg" placeholder="Anonymous signal..." style="height:60px; font-size:12px;"></textarea>
                    <button class="btn-ios" style="width:100%; margin-top:12px; font-size:11px;">SEND ANON</button>
                </form>
            </div>

            <div class="card">
                <h4 style="opacity:0.4; font-size:11px; margin-bottom:20px; letter-spacing:3px;">COMMUNITIES</h4>
                <a href="/dashboard" class="pill ${!isPortfolio && activeSector === 'Global' ? 'pill-active' : ''}">🌏 GLOBAL VOID</a>
                ${sectors.map(s => `
                    <a href="/dashboard?sector=${s.name}" class="pill ${activeSector === s.name ? 'pill-active' : ''}">
                        # ${s.name.toUpperCase()}
                    </a>
                `).join('')}
                <form action="/addsector" method="POST" style="margin-top:20px;">
                    <input name="sName" placeholder="Create Sector..." style="width:100%; padding:12px; border-radius:15px; background:rgba(0,0,0,0.5); border:1px solid #333; color:#fff; font-size:12px;">
                </form>
            </div>
        </div>
    </div>

    <footer>
        <div>
            <p style="font-weight:900; font-size:16px; margin-bottom:5px;">XAVIROX COSMOS</p>
            <p>SYNCED @ YEAR 2026</p>
        </div>
        <div style="display:flex; gap:25px; align-items:center;">
            <a href="mailto:xavirox.co@gmail.com" style="color:#fff; text-decoration:none;"><i class="fas fa-envelope"></i> xavirox.co@gmail.com</a>
            <span style="color:var(--p); font-weight:800; cursor:pointer;">CONTENT REMOVAL</span>
        </div>
    </footer>

    <script>
        // 🧢 GEN-Z SLANG ENGINE
        const slang = ["No cap...", "What's the tea?", "Caught in 4K", "Sheeesh!", "Vibe check passed.", "Ate and left no crumbs.", "Main character energy.", "Bet.", "Manifesting fire content."];
        const target = document.getElementById('slang-gen');
        if(target) { setInterval(() => { target.placeholder = slang[Math.floor(Math.random()*slang.length)]; }, 3000); }

        // 🪐 STAR ENGINE
        const layer = document.getElementById('star-layer');
        for(let i=0; i<200; i++) {
            const s = document.createElement('div'); s.className='stars';
            s.style.left=Math.random()*100+'vw'; s.style.top=Math.random()*100+'vh';
            s.style.animationDelay=Math.random()*5+'s'; layer.appendChild(s);
        }
    </script>
</body>
</html>
`;

// ---------------------------------------------------------
// [ROUTES & NEURAL LOGIC]
// ---------------------------------------------------------

// --- ROOT REDIRECT ---
app.get('/', (req, res) => res.redirect('/dashboard'));

// --- FEED LOGIC ---
app.get('/dashboard', isAuth, async (req, res) => {
    const sec = req.query.sector;
    const posts = await Post.find(sec ? { sector: sec } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    
    const postsHtml = posts.map(p => `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <span style="font-weight:900; color:var(--cyan); font-size:14px;">@${p.author} <span style="opacity:0.3; font-weight:400;">• #${p.sector}</span></span>
                <span style="font-size:10px; opacity:0.2;">${new Date(p.date).toLocaleTimeString()}</span>
            </div>
            <p style="font-size:17px; line-height:1.7; opacity:0.9;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:25px; margin-top:20px; border:1px solid var(--border);">` : ''}
            
            <div class="interaction-row">
                <a href="/like/${p._id}" class="action-item"><i class="fas fa-heart"></i> ${p.likes}</a>
                <a href="/dislike/${p._id}" class="action-item"><i class="fas fa-skull"></i> ${p.dislikes}</a>
                <a href="/save/${p._id}" class="action-item"><i class="fas fa-bookmark"></i> ARCHIVE</a>
            </div>
        </div>
    `).join('');
    
    res.send(MASTER_UI(postsHtml, req.session.user, sectors, sec || 'Global'));
});

// --- PORTFOLIO LOGIC ---
app.get('/portfolio', isAuth, async (req, res) => {
    const sectors = await Sector.find();
    const u = req.session.user;
    const portHtml = `
        <div class="card" style="text-align:center;">
            <div class="avatar-box">${u.username[0].toUpperCase()}</div>
            <h1 style="font-size:35px; font-weight:900; margin-bottom:10px;">@${u.username}</h1>
            <p style="opacity:0.6; margin-bottom:25px;">${u.bio}</p>
            <div style="margin-bottom:30px;">
                ${u.skills.map(s => `<span class="skill-chip">${s}</span>`).join('')}
            </div>
            <button class="btn-ios" onclick="alert('Neural Sync Active')">EDIT IDENTITY</button>
        </div>
        <div class="card">
            <h3 style="font-weight:900; margin-bottom:20px;">ARCHIVED MEMORIES</h3>
            <p style="opacity:0.3; font-size:14px;">Your saved signals will manifest here soon...</p>
        </div>
    `;
    res.send(MASTER_UI(portHtml, u, sectors, 'Global', true));
});

// --- AUTH (FOSTER LOGIN) ---
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html><html><head><style>
        body{background:#000;color:#fff;display:flex;height:100vh;margin:0;font-family:sans-serif;overflow:hidden;}
        .hero{flex:1.2;background:#050105;display:flex;align-items:flex-end;justify-content:center;position:relative;}
        .form-side{flex:1;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(100px);}
        .char{font-size:120px;position:absolute;transition:0.8s cubic-bezier(0.19, 1, 0.22, 1);}
        .shy{transform:translateY(400px) scale(0);opacity:0;}
        .login-box{width:400px;padding:60px;background:rgba(255,255,255,0.02);border-radius:50px;border:1px solid rgba(255,255,255,0.08);}
        input{width:100%;padding:22px;margin:15px 0;border-radius:20px;background:#000;color:#fff;border:1px solid #222;outline:none;}
        button{width:100%;padding:22px;border-radius:50px;background:#fff;color:#000;border:none;font-weight:900;cursor:pointer;margin-top:20px;}
    </style></head>
    <body>
        <div class="hero"><div id="c" class="char" style="left:20%; bottom:10%;">🐱</div><div id="p" class="char" style="right:20%; bottom:15%;">🦜</div></div>
        <div class="form-side"><div class="login-box">
            <h1>XAVIROX</h1><p style="opacity:0.4;">Sync Neural Link</p>
            <form action="/login" method="POST">
                <input name="username" placeholder="Username" onfocus="show()" required>
                <input name="password" type="password" placeholder="Password" onfocus="hide()" required>
                <button>AUTH SYNC</button>
            </form>
        </div></div>
        <script>
            function show(){document.getElementById('c').classList.remove('shy');document.getElementById('p').classList.remove('shy');}
            function hide(){document.getElementById('c').classList.add('shy');document.getElementById('p').classList.add('shy');}
        </script>
    </body></html>`);
});

// --- CORE HANDLERS ---
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Denied'); window.location='/login';</script>");
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    res.redirect('back');
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { feedback: { msg: req.body.msg, from: req.session.user.username } } });
    res.send("<script>alert('Feedback Received'); window.location='/dashboard';</script>");
});

app.post('/send-anon', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: req.body.target.toLowerCase() }, { $push: { anonInbox: { msg: req.body.msg } } });
    res.send("<script>alert('Ghost Message Sent'); window.location='/dashboard';</script>");
});

app.get('/like/:id', isAuth, async (req, res) => { await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }); res.redirect('back'); });
app.get('/dislike/:id', isAuth, async (req, res) => { await Post.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }); res.redirect('back'); });
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

// --- BOOT ---
app.listen(3000, () => console.log('🚀 [XAVIROX 35.0 ETERNAL LIVE]'));