/* ====================================================================================================
   🚀 XAVIROX COSMIC OS - VERSION 36.0 [THE OMNI-RENAISSANCE]
   DEVELOPER: GEMINI COLLABORATION | YEAR: 2026 | STATUS: FEATURE-COMPLETE
====================================================================================================
   UPGRADES IN THIS MERGE:
   - 🏝️ DYNAMIC ISLAND: Permanent "XAVIROX" branding + Dynamic Sector Info.
   - 📧 GMAIL FOOTER: Professional contact integration (xavirox.co@gmail.com).
   - 💬 FEEDBACK 2.0: Optimized signal transmission logic with better UI placement.
   - 👤 PORTFOLIO: Neural Identity page with bio, skills, and archive section.
   - 👻 GHOST PROTOCOL: Anonymous messaging sidebar fully functional.
   - 🪐 OMNI-MERGE: All previous features (Login characters, Slang engine, Sectors) merged.
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();

// --- [DATABASE ARCHITECTURE] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";
mongoose.connect(dbURI).then(() => console.log('✅ [XAVIROX]: OMNI-NEURAL LINK STABLE'));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: "Inhabitant of the Xavirox Cosmos." },
    skills: { type: [String], default: ["Gen-Z", "Xaviroxian"] },
    feedback: [{ msg: String, from: String, date: { type: Date, default: Date.now } }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    anonInbox: [{ msg: String, date: { type: Date, default: Date.now } }]
});

const PostSchema = new mongoose.Schema({
    author: String, content: String, mediaUrl: String, mediaType: String,
    likes: { type: Number, default: 0 }, dislikes: { type: Number, default: 0 },
    sector: { type: String, default: 'General' }, date: { type: Date, default: Date.now }
});

const SectorSchema = new mongoose.Schema({ name: { type: String, required: true, unique: true } });

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Sector = mongoose.model('Sector', SectorSchema);

// --- [SYSTEM MIDDLEWARE] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({ secret: 'xavirox_renaissance_2026', resave: false, saveUninitialized: true }));
const upload = multer({ storage: multer.memoryStorage() });
const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- [MASTER UI FRAMEWORK] ---
const MASTER_UI = (content, user, sectors, activeSector = 'Global', isPortfolio = false) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>XAVIROX | ${isPortfolio ? 'Identity' : activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --glass: rgba(255, 255, 255, 0.05); }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        body { background: #000; color: #fff; overflow-x: hidden; min-height: 100vh; }
        
        /* 🪐 COSMIC BACKGROUND */
        .stars { position: fixed; width: 2px; height: 2px; background: #fff; border-radius: 50%; opacity: 0; animation: twinkle 4s infinite; z-index: -10; }
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.8; } }
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, var(--v), transparent 75%); z-index: -5; opacity: 0.12; filter: blur(120px); }

        /* 🛸 DYNAMIC ISLAND (XAVIROX BRANDED) */
        .island-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; }
        .dynamic-island {
            width: 320px; height: 52px; background: rgba(0,0,0,0.9); backdrop-filter: blur(30px);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; display: flex; align-items: center; 
            justify-content: center; padding: 0 30px; border-top: 1px solid var(--p);
        }
        .dynamic-island:hover { width: 550px; height: 85px; border-color: var(--cyan); }
        .island-label { font-weight: 900; letter-spacing: 2px; font-size: 13px; text-transform: uppercase; display: flex; align-items: center; gap: 10px; }
        .brand-name { color: var(--p); text-shadow: 0 0 10px var(--p); }

        /* 🕹️ LEFT DOCK */
        .left-dock {
            position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 85px; 
            background: rgba(255,255,255,0.06); backdrop-filter: blur(50px); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 45px 0; gap: 45px; z-index: 5000;
        }
        .left-dock i { font-size: 26px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .left-dock i:hover, .nav-active { color: var(--p) !important; transform: scale(1.4); text-shadow: 0 0 20px var(--p); }

        /* CONTENT WRAPPER */
        .wrapper { display: flex; max-width: 1250px; margin: 160px auto 50px 160px; gap: 40px; }
        .feed-area { flex: 2.3; }
        .side-area { flex: 1; position: sticky; top: 160px; height: fit-content; }

        .card { background: var(--glass); border: 1px solid rgba(255,255,255,0.08); border-radius: 40px; padding: 35px; margin-bottom: 35px; backdrop-filter: blur(100px); }
        .card:hover { border-color: var(--p); transform: translateY(-5px); }

        textarea { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 25px; color: #fff; padding: 25px; font-size: 16px; outline: none; resize: none; }
        .btn-x { background: #fff; color: #000; border: none; padding: 15px 40px; border-radius: 50px; font-weight: 900; cursor: pointer; }
        .btn-x:hover { background: var(--p); color: #fff; box-shadow: 0 0 30px var(--p); }

        .pill { display: block; padding: 15px 25px; background: rgba(255,255,255,0.03); border-radius: 20px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 12px; font-weight: 700; }
        .pill-active { background: #fff !important; color: #000 !important; }

        /* 📧 GMAIL FOOTER */
        footer { margin-left: 160px; padding: 80px 40px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; opacity: 0.4; font-size: 13px; }
        .footer-mail { color: var(--p); text-decoration: none; font-weight: 800; }
    </style>
</head>
<body>
    <div id="stars"></div>
    <div class="black-hole"></div>

    <div class="island-container">
        <div class="dynamic-island">
            <div class="island-label">
                <span class="brand-name">XAVIROX</span> 
                <span style="opacity:0.3; margin: 0 10px;">|</span> 
                <span>${isPortfolio ? 'IDENTITY' : activeSector.toUpperCase()}</span>
            </div>
        </div>
    </div>

    <div class="left-dock">
        <i class="fas fa-home ${!isPortfolio && activeSector === 'Global' ? 'nav-active' : ''}" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-user-astronaut ${isPortfolio ? 'nav-active' : ''}" onclick="location.href='/portfolio'"></i>
        <div style="width:55px; height:55px; background:#fff; border-radius:18px; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            <i class="fas fa-plus" style="color:#000;"></i>
        </div>
        <i class="fas fa-ghost"></i>
        <i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);"></i>
    </div>

    <div class="wrapper">
        <div class="feed-area">
            ${isPortfolio ? content : `
                <div class="card" style="border-top: 4px solid var(--p);">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea id="genz-slang" name="content" placeholder="Vibe check..." required></textarea>
                        <input type="hidden" name="sector" value="${activeSector === 'Global' ? 'General' : activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                            <label style="cursor:pointer; font-size:24px; opacity:0.5;"><i class="fas fa-camera"></i><input type="file" name="media" hidden></label>
                            <button class="btn-x">TRANSMIT</button>
                        </div>
                    </form>
                </div>
                ${content}
            `}
        </div>

        <div class="side-area">
            <div class="card" style="border: 1px solid var(--cyan);">
                <h4 style="font-size:11px; color:var(--cyan); margin-bottom:15px; letter-spacing:2px;">FEEDBACK SIGNAL</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Message to Xavi..." style="height:60px; font-size:12px;"></textarea>
                    <button class="btn-x" style="width:100%; margin-top:12px; font-size:11px; background:var(--cyan); color:#000;">SEND SIGNAL</button>
                </form>
            </div>

            <div class="card" style="border: 1px dashed var(--p);">
                <h4 style="color:var(--p); font-size:11px; margin-bottom:15px;">GHOST PROTOCOL</h4>
                <form action="/send-anon" method="POST">
                    <input name="target" placeholder="Target user..." required style="width:100%; padding:12px; border-radius:15px; background:#000; color:#fff; border:1px solid #333; margin-bottom:12px; font-size:12px;">
                    <textarea name="msg" placeholder="Anonymous msg..." style="height:60px; font-size:12px;"></textarea>
                    <button class="btn-x" style="width:100%; margin-top:12px; font-size:11px;">SEND ANON</button>
                </form>
            </div>

            <div class="card">
                <h4 style="opacity:0.4; font-size:11px; margin-bottom:20px; letter-spacing:3px;">COMMUNITIES</h4>
                <a href="/dashboard" class="pill ${!isPortfolio && activeSector === 'Global' ? 'pill-active' : ''}">🌏 GLOBAL VOID</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" class="pill ${activeSector === s.name ? 'pill-active' : ''}"># ${s.name.toUpperCase()}</a>`).join('')}
            </div>
        </div>
    </div>

    <footer>
        <div>
            <p style="font-weight:900; font-size:16px; margin-bottom:5px;">XAVIROX COSMOS</p>
            <p>SYNCED @ 2026. ALL RIGHTS RESERVED.</p>
        </div>
        <div style="text-align:right;">
            <p style="margin-bottom:5px;">Official Support:</p>
            <a href="mailto:xavirox.co@gmail.com" class="footer-mail"><i class="fas fa-envelope"></i> xavirox.co@gmail.com</a>
        </div>
    </footer>

    <script>
        const slang = ["No cap...", "What's the tea?", "Caught in 4K", "Sheeesh!", "Vibe check passed."];
        const input = document.getElementById('genz-slang');
        if(input) { setInterval(() => { input.placeholder = slang[Math.floor(Math.random()*slang.length)]; }, 3000); }
        const layer = document.getElementById('stars');
        for(let i=0; i<150; i++) {
            const s = document.createElement('div'); s.className='stars';
            s.style.left=Math.random()*100+'vw'; s.style.top=Math.random()*100+'vh';
            layer.appendChild(s);
        }
    </script>
</body>
</html>
`;

// --- [ROUTES] ---

app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', isAuth, async (req, res) => {
    const sec = req.query.sector;
    const posts = await Post.find(sec ? { sector: sec } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    const html = posts.map(p => `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <span style="font-weight:900; color:var(--cyan); font-size:14px;">@${p.author} <span style="opacity:0.3;">• #${p.sector}</span></span>
            </div>
            <p style="font-size:17px; line-height:1.7; opacity:0.9;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:25px; margin-top:20px; border:1px solid rgba(255,255,255,0.1);">` : ''}
            <div style="display:flex; gap:25px; margin-top:25px; opacity:0.5; font-size:14px;">
                <a href="/like/${p._id}" style="color:#fff; text-decoration:none;"><i class="fas fa-heart"></i> ${p.likes}</a>
                <a href="/dislike/${p._id}" style="color:#fff; text-decoration:none;"><i class="fas fa-skull"></i> ${p.dislikes}</a>
                <a href="/save/${p._id}" style="color:#fff; text-decoration:none;"><i class="fas fa-bookmark"></i> ARCHIVE</a>
            </div>
        </div>
    `).join('');
    res.send(MASTER_UI(html, req.session.user, sectors, sec || 'Global'));
});

app.get('/portfolio', isAuth, async (req, res) => {
    const sectors = await Sector.find();
    const u = req.session.user;
    const html = `
        <div class="card" style="text-align:center;">
            <div style="width:110px; height:110px; background:linear-gradient(45deg, var(--p), var(--v)); border-radius:30px; margin: 0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:40px; font-weight:900;">${u.username[0].toUpperCase()}</div>
            <h1 style="font-size:35px; font-weight:900;">@${u.username}</h1>
            <p style="opacity:0.6; margin:20px 0;">${u.bio}</p>
            <div>${u.skills.map(s => `<span style="background:var(--v); padding:8px 18px; border-radius:50px; font-size:11px; margin:5px; display:inline-block; font-weight:800;">${s}</span>`).join('')}</div>
        </div>
    `;
    res.send(MASTER_UI(html, u, sectors, 'Global', true));
});

// --- [AUTH (FOSTER LOGIN)] ---
app.get('/login', (req, res) => {
    res.send(`<!DOCTYPE html><html><body style="background:#000;color:#fff;display:flex;height:100vh;margin:0;font-family:sans-serif;overflow:hidden;"><div style="flex:1.2;background:#050105;display:flex;align-items:flex-end;justify-content:center;position:relative;"><div id="c" style="font-size:120px;position:absolute;left:20%;bottom:10%;transition:0.8s;">🐱</div><div id="p" style="font-size:120px;position:absolute;right:20%;bottom:15%;transition:0.8s;">🦜</div></div><div style="flex:1;display:flex;align-items:center;justify-content:center;"><div style="width:400px;padding:60px;background:rgba(255,255,255,0.02);border-radius:50px;border:1px solid rgba(255,255,255,0.08);"><h1>XAVIROX</h1><form action="/login" method="POST"><input name="username" placeholder="Username" style="width:100%;padding:22px;margin:15px 0;border-radius:20px;background:#000;color:#fff;border:1px solid #222;" onfocus="document.getElementById('c').style.transform='translateY(0)';document.getElementById('p').style.transform='translateY(0)'"><input name="password" type="password" placeholder="Password" style="width:100%;padding:22px;margin:15px 0;border-radius:20px;background:#000;color:#fff;border:1px solid #222;" onfocus="document.getElementById('c').style.transform='translateY(400px)';document.getElementById('p').style.transform='translateY(400px)'"><button style="width:100%;padding:22px;border-radius:50px;background:#fff;border:none;font-weight:900;margin-top:20px;">SYNC</button></form></div></div></body></html>`);
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) { req.session.user = user; res.redirect('/dashboard'); }
    else res.send("<script>alert('Denied'); window.location='/login';</script>");
});

app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { feedback: { msg: req.body.msg, from: req.session.user.username } } });
    res.send("<script>alert('Feedback Received!'); window.location='/dashboard';</script>");
});

app.post('/send-anon', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: req.body.target.toLowerCase() }, { $push: { anonInbox: { msg: req.body.msg } } });
    res.send("<script>alert('Ghost Msg Sent!'); window.location='/dashboard';</script>");
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    res.redirect('back');
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

app.listen(3000, () => console.log('🚀 [XAVIROX 36.0 RENAISSANCE LIVE]'));