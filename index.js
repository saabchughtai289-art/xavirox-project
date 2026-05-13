=/* ====================================================================================================
   🚀 XAVIROX COSMIC OS - VERSION 38.0 [THE NEURAL OVERHAUL]
   DEVELOPER: GEMINI COLLABORATION | YEAR: 2026 | STATUS: FEATURE-COMPLETE
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();

// --- [DATABASE ARCHITECTURE] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";
mongoose.connect(dbURI).then(() => console.log('✅ [XAVIROX]: OMNI-LINK 38.0 STABLE'));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    pfp: { type: String, default: "" },
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
app.use(session({ secret: 'xavirox_neural_2026', resave: false, saveUninitialized: true }));
const upload = multer({ storage: multer.memoryStorage() });

// --- [MASTER UI FRAMEWORK] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global', isPortfolio = false) => {
    const isGuest = !user;
    const lurkerSlangs = [
        "xavirox :still lurking? 💀", "sign up lil bro", "guest mode final boss", "rawdogging the app 😭", "stop stalking, join in", "one signup = aura", "bro fears accounts", "unlock your username", "lurking goes crazy", "create account coward", "npc guest mode", "anonymous menace 👁️", "join the chaos", "gang still unsigned 😭", "stop lurking in 4k", "internet side character", "username loading...", "accountless behavior 🚨", "signup arc starts now", "still in demo mode", "become chronically online properly", "bro skipped signup again", "join before the drama starts", "no account is wild 😭", "make history. sign up.", "guest energy detected", "enter your villain arc", "lurking championship winner 🏆", "bro spectating life", "sign up and lock in", "your aura needs an account", "create account for lore", "stop watching. start posting.", "unc still not registered 💔", "anonymous but invested", "your username awaits", "free account btw 👀", "click signup gang", "lurking professionally", "account creation jumpscare", "just sign up already 😭", "internet gremlin detected", "join the timeline", "bro allergic to signup", "your future fame starts here", "guest mode premium edition", "unlock main character mode", "lurking since ancient times", "create account = instant upgrade", "join the internet properly", "still hiding huh?", "stop being mysterious", "no login, pure vibes", "bro got trust issues with signup", "join the madness", "stop hovering 😭", "signup speedrun when?", "one click away from chaos", "the app misses you", "make your mark gang", "bro farming guest hours", "stop lurking and cook", "login screen undefeated", "your account arc starts today", "type less, signup more", "bro living anonymously", "unlock elite commenting", "lurking level maxed", "internet ghost detected", "guest mode demon 👹", "stop spectating bro", "signup before it’s too late", "your username getting stolen rn", "make the account already 💀", "still accountless is crazy", "your villain arc needs signup", "zero posts, maximum lurking", "account creation fears you", "just one tiny signup 👀", "bro moving undercover", "lurking with passion", "sign up for character development", "become part of the lore", "bro avoiding responsibility digitally", "enter the timeline properly", "signup and cause chaos", "your aura feels guest mode", "stop being a background character", "anonymous scrolling champion", "internet citizen application pending", "stop peeking and join", "one signup changes everything", "bro still testing the waters", "create account. become legend.", "the lurk ends here", "signup before the tea spills ☕", "no account? bold strategy", "guest mode warrior", "this app knows you already", "bro really said “continue as guest” 😭"
    ];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>XAVIROX | ${isPortfolio ? 'Identity' : activeSector}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --glass: rgba(255, 255, 255, 0.05); }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.6s cubic-bezier(0.19, 1, 0.22, 1); }
        body { background: #000; color: #fff; overflow-x: hidden; min-height: 100vh; }
        
        .stars { position: fixed; width: 2px; height: 2px; background: #fff; border-radius: 50%; opacity: 0; animation: twinkle 4s infinite; z-index: -10; }
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.8; } }
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, var(--v), transparent 75%); z-index: -5; opacity: 0.12; filter: blur(120px); }

        /* 🏝️ DYNAMIC ISLAND FIX */
        .island-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; transition: 0.5s; }
        .dynamic-island {
            width: ${isGuest ? '420px' : '320px'}; height: 55px; background: rgba(0,0,0,0.9); backdrop-filter: blur(40px);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; display: flex; align-items: center; 
            justify-content: center; padding: 0 30px; border-top: 2px solid ${isGuest ? 'var(--v)' : 'var(--p)'};
            cursor: pointer; overflow: hidden;
        }
        .dynamic-island:hover { width: 580px; height: 80px; border-color: var(--cyan); }
        .island-label { font-weight: 900; letter-spacing: 1px; font-size: 13px; text-transform: uppercase; text-align: center; }

        .left-dock {
            position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 85px; 
            background: rgba(255,255,255,0.06); backdrop-filter: blur(50px); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 45px 0; gap: 40px; z-index: 5000;
        }
        .left-dock i { font-size: 24px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .left-dock i:hover, .nav-active { color: var(--p) !important; transform: scale(1.3); text-shadow: 0 0 15px var(--p); }

        .wrapper { display: flex; max-width: 1250px; margin: 160px auto 50px 160px; gap: 40px; }
        .feed-area { flex: 2.3; }
        .side-area { flex: 1; position: sticky; top: 160px; height: fit-content; }

        .card { background: var(--glass); border: 1px solid rgba(255,255,255,0.08); border-radius: 40px; padding: 35px; margin-bottom: 35px; backdrop-filter: blur(100px); position: relative; }
        .card:hover { border-color: var(--p); }
        
        textarea { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #fff; padding: 20px; outline: none; resize: none; }
        .btn-x { background: #fff; color: #000; border: none; padding: 12px 30px; border-radius: 50px; font-weight: 900; cursor: pointer; }
        .btn-x:hover { background: var(--p); color: #fff; box-shadow: 0 0 20px var(--p); }
        
        .pfp-main { width: 110px; height: 110px; border-radius: 35px; object-fit: cover; margin-bottom: 20px; border: 2px solid var(--p); }
        .del-btn { position: absolute; top: 30px; right: 30px; color: #ff4444; cursor: pointer; opacity: 0.4; }
        .del-btn:hover { opacity: 1; transform: scale(1.2); }
        
        .guest-lock { filter: blur(6px); pointer-events: none; opacity: 0.4; user-select: none; }
        
        footer { margin-left: 160px; padding: 60px 40px; border-top: 1px solid rgba(255,255,255,0.1); opacity: 0.4; display: flex; justify-content: space-between; }
    </style>
</head>
<body>
    <div id="stars"></div>
    <div class="black-hole"></div>

    <div class="island-container">
        <div class="dynamic-island">
            <div class="island-label" id="island-txt">
                ${isGuest ? lurkerSlangs[0] : `<span style="color:var(--p)">XAVIROX</span> | ${activeSector.toUpperCase()}`}
            </div>
        </div>
    </div>

    <div class="left-dock">
        <i class="fas fa-home ${activeSector === 'Global' && !isPortfolio ? 'nav-active' : ''}" onclick="location.href='/dashboard'"></i>
        <i class="fas fa-user-circle ${isPortfolio ? 'nav-active' : ''}" onclick="location.href='/portfolio'"></i>
        <i class="fas fa-save" onclick="location.href='/saved-posts'"></i>
        <i class="fas fa-ghost"></i>
        <i class="fas fa-power-off" onclick="location.href='${isGuest ? '/login' : '/logout'}'" style="color:var(--p)"></i>
    </div>

    <div class="wrapper">
        <div class="feed-area">
            ${isGuest ? `
                <div class="card" style="text-align:center; border: 2px solid var(--v); animation: pulse 2s infinite;">
                    <h2 style="margin-bottom:10px; letter-spacing:2px;">GUEST MODE: FINAL BOSS</h2>
                    <p style="opacity:0.6; margin-bottom:20px;">Watching from the shadows? Join the void.</p>
                    <button class="btn-x" onclick="location.href='/login'">SIGN UP LIL BRO</button>
                </div>
            ` : (isPortfolio ? content : `
                <div class="card" style="border-top: 3px solid var(--p);">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" placeholder="Vibe check..." required id="slang-box" style="height:100px;"></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                            <label style="cursor:pointer; font-size:20px; opacity:0.6;"><i class="fas fa-camera"></i><input type="file" name="media" hidden></label>
                            <button class="btn-x">TRANSMIT</button>
                        </div>
                    </form>
                </div>
            `)}
            ${!isPortfolio ? content : ''}
        </div>

        <div class="side-area">
            <div class="card ${isGuest ? 'guest-lock' : ''}">
                <h4 style="color:var(--cyan); font-size:11px; margin-bottom:15px; letter-spacing:2px;">FEEDBACK SIGNAL</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Message to Xavi..." style="height:70px; font-size:12px;"></textarea>
                    <button class="btn-x" style="width:100%; margin-top:10px; background:var(--cyan); color:#000; font-size:11px;">SEND SIGNAL</button>
                </form>
            </div>

            <div class="card ${isGuest ? 'guest-lock' : ''}">
                <h4 style="color:var(--p); font-size:11px; margin-bottom:15px; letter-spacing:2px;">GHOST PROTOCOL</h4>
                <form action="/send-anon" method="POST">
                    <input name="target" placeholder="Target user..." required style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:12px; border-radius:15px; margin-bottom:10px; font-size:12px;">
                    <textarea name="msg" placeholder="Anonymous msg..." style="height:60px; font-size:12px;"></textarea>
                    <button class="btn-x" style="width:100%; margin-top:10px; font-size:11px;">SEND ANON</button>
                </form>
            </div>

            <div class="card">
                <h4 style="opacity:0.4; font-size:11px; margin-bottom:15px;">COMMUNITIES</h4>
                <a href="/dashboard" style="display:block; color:#fff; text-decoration:none; margin-bottom:12px; font-weight:800; font-size:14px;">🌏 GLOBAL VOID</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:rgba(255,255,255,0.4); text-decoration:none; margin-bottom:10px; font-size:13px;"># ${s.name.toUpperCase()}</a>`).join('')}
            </div>
        </div>
    </div>

    <footer>
        <div><strong>XAVIROX COSMOS</strong><br><span style="font-size:10px;">SYNCED @ 2026</span></div>
        <a href="mailto:xavirox.co@gmail.com" style="color:var(--p); text-decoration:none; font-weight:bold;">xavirox.co@gmail.com</a>
    </footer>

    <script>
        ${isGuest ? `
            const slangs = ${JSON.stringify(lurkerSlangs)};
            let slangIdx = 0;
            // 45 Seconds Interval as requested
            setInterval(() => {
                const txt = document.getElementById('island-txt');
                txt.style.opacity = 0;
                setTimeout(() => {
                    slangIdx = (slangIdx + 1) % slangs.length;
                    txt.innerText = slangs[slangIdx];
                    txt.style.opacity = 1;
                }, 500);
            }, 45000);
        ` : `
            const genzSlangs = ["No cap...", "What's the tea?", "Caught in 4K", "Ate and left no crumbs", "Main character energy", "Sheesh", "Bet", "Vibe check", "Sending it"];
            setInterval(() => {
                const box = document.getElementById('slang-box');
                if(box) box.placeholder = genzSlangs[Math.floor(Math.random()*genzSlangs.length)];
            }, 3000);
        `}
        
        const starsLayer = document.getElementById('stars');
        for(let j=0; j<120; j++) {
            const s = document.createElement('div'); s.className='stars';
            s.style.left=Math.random()*100+'vw'; s.style.top=Math.random()*100+'vh';
            s.style.animationDelay = Math.random()*4+'s';
            starsLayer.appendChild(s);
        }
    </script>
</body>
</html>`;
};

// --- [CORE LOGIC & ROUTES] ---

app.get('/dashboard', async (req, res) => {
    const sec = req.query.sector || 'General';
    const posts = await Post.find(sec !== 'Global' && sec !== 'General' ? { sector: sec } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    const user = req.session.user;

    const html = posts.map(p => `
        <div class="card">
            ${(user && (user.username === p.author || user.username === 'xavi')) ? `<a href="/delete-post/${p._id}" class="del-btn"><i class="fas fa-trash"></i></a>` : ''}
            <div style="font-weight:900; color:var(--cyan); font-size:12px; margin-bottom:12px;">@${p.author} <span style="opacity:0.3; margin-left:5px;">• #${p.sector}</span></div>
            <p style="font-size:17px; opacity:0.9; line-height:1.6;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:25px; margin-top:20px; border:1px solid rgba(255,255,255,0.1);">` : ''}
            <div style="display:flex; gap:25px; margin-top:25px; opacity:0.5; font-size:14px;">
                <a href="/like/${p._id}" style="color:#fff; text-decoration:none;"><i class="fas fa-heart"></i> ${p.likes}</a>
                <a href="/save/${p._id}" style="color:#fff; text-decoration:none;"><i class="fas fa-bookmark"></i> ARCHIVE</a>
            </div>
        </div>
    `).join('');
    res.send(MASTER_UI(html, user, sectors, sec));
});

// --- [NEURAL LOGIN PAGE FIX] ---
app.get('/login', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>XAVIROX | SYNC</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><style>
    body { background:#000; color:#fff; display:flex; height:100vh; margin:0; font-family:sans-serif; overflow:hidden; }
    .side-art { flex:1.2; background:#050105; display:flex; align-items:flex-end; justify-content:center; position:relative; border-right:1px solid #111; }
    #c { font-size:120px; position:absolute; left:20%; bottom:10%; transition:0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
    #p { font-size:120px; position:absolute; right:20%; bottom:15%; transition:0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
    .form-side { flex:1; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at center, #110011, #000); }
    .box { width:380px; padding:50px; background:rgba(255,255,255,0.02); border-radius:40px; border:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(20px); }
    input { width:100%; padding:20px; margin:12px 0; border-radius:15px; background:#000; color:#fff; border:1px solid #222; outline:none; }
    input:focus { border-color: #ff007f; }
    button { width:100%; padding:20px; border-radius:50px; background:#fff; border:none; font-weight:900; margin-top:20px; cursor:pointer; }
    button:hover { background:#ff007f; color:#fff; transform:scale(1.02); }
    </style></head><body>
    <div class="side-art"><div id="c">🐱</div><div id="p">🦜</div></div>
    <div class="form-side"><div class="box"><h1 style="letter-spacing:5px; margin-bottom:30px;">XAVIROX</h1>
    <form action="/login" method="POST">
    <input name="username" placeholder="NEURAL ID" required onfocus="document.getElementById('c').style.transform='translateY(0)';document.getElementById('p').style.transform='translateY(0)'">
    <input name="password" type="password" placeholder="ACCESS KEY" required onfocus="document.getElementById('c').style.transform='translateY(450px)';document.getElementById('p').style.transform='translateY(450px)'">
    <button>SYNC CORE</button></form>
    <p style="text-align:center; margin-top:20px; font-size:12px; opacity:0.4;">AUTHENTICATION REQUIRED FOR UPLINK</p>
    </div></div></body></html>`);
});

// --- [PORTFOLIO & PROFILE] ---
app.get('/portfolio', async (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    const u = await User.findOne({ username: req.session.user.username });
    const sectors = await Sector.find();
    const html = `
        <div class="card" style="text-align:center; border-bottom: 4px solid var(--v);">
            <img src="${u.pfp || 'https://via.placeholder.com/150'}" class="pfp-main">
            <form action="/upload-pfp" method="POST" enctype="multipart/form-data">
                <input type="file" name="pfp" onchange="this.form.submit()" id="pfp-in" hidden>
                <label for="pfp-in" style="font-size:11px; color:var(--cyan); cursor:pointer; font-weight:900;">[ UPDATE IDENTITY IMAGE ]</label>
            </form>
            <h1 style="font-size:40px; margin-top:20px;">@${u.username}</h1>
            <p style="margin:20px 0; opacity:0.7; font-size:18px;">${u.bio}</p>
            <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                ${u.skills.map(s => `<span style="background:var(--v); padding:8px 20px; border-radius:50px; font-size:11px; font-weight:bold;">${s}</span>`).join('')}
            </div>
        </div>
    `;
    res.send(MASTER_UI(html, u, sectors, 'Global', true));
});

// --- [HANDLERS] ---
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if(user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('SYNC FAILED'); window.location='/login';</script>");
});

app.post('/send-feedback', async (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    await User.findOneAndUpdate({ username: 'xavi' }, { $push: { feedback: { msg: req.body.msg, from: req.session.user.username } } });
    res.send("<script>alert('SIGNAL RECEIVED'); window.location='/dashboard';</script>");
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    res.redirect('back');
});

app.get('/delete-post/:id', async (req, res) => {
    const p = await Post.findById(req.params.id);
    if(p && (p.author === req.session.user.username || req.session.user.username === 'xavi')) {
        await Post.findByIdAndDelete(req.params.id);
    }
    res.redirect('back');
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });

app.listen(3000, () => console.log('🚀 XAVIROX 38.0 - NEURAL RENAISSANCE LIVE'));