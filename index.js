/* ====================================================================================================
   🚀 XAVIROX COSMIC OS - VERSION 37.0 [THE LURKER'S RECKONING]
   DEVELOPER: GEMINI COLLABORATION | YEAR: 2026 | STATUS: SUPREME MERGE
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();

// --- [DATABASE ARCHITECTURE] ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";
mongoose.connect(dbURI).then(() => console.log('✅ [XAVIROX]: OMNI-LINK 37.0 STABLE'));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    pfp: { type: String, default: "" },
    bio: { type: String, default: "Vibing in the Xavirox Void." },
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
app.use(session({ secret: 'xavirox_lurker_final_boss', resave: false, saveUninitialized: true }));
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
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        body { background: #000; color: #fff; overflow-x: hidden; min-height: 100vh; }
        .stars { position: fixed; width: 2px; height: 2px; background: #fff; border-radius: 50%; opacity: 0; animation: twinkle 4s infinite; z-index: -10; }
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.8; } }
        .black-hole { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; border-radius: 50%; background: radial-gradient(circle, var(--v), transparent 75%); z-index: -5; opacity: 0.12; filter: blur(120px); }

        .island-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10000; }
        .dynamic-island {
            width: ${isGuest ? '400px' : '320px'}; height: 52px; background: rgba(0,0,0,0.95); backdrop-filter: blur(30px);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; display: flex; align-items: center; 
            justify-content: center; padding: 0 30px; border-top: 2px solid ${isGuest ? 'var(--v)' : 'var(--p)'};
        }
        .island-label { font-weight: 900; letter-spacing: 1px; font-size: 13px; text-transform: uppercase; text-align: center; }

        .left-dock {
            position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 85px; 
            background: rgba(255,255,255,0.06); backdrop-filter: blur(50px); border: 1px solid rgba(255,255,255,0.1);
            border-radius: 100px; display: flex; flex-direction: column; align-items: center; padding: 45px 0; gap: 45px; z-index: 5000;
        }
        .left-dock i { font-size: 26px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .left-dock i:hover, .nav-active { color: var(--p) !important; transform: scale(1.4); }

        .wrapper { display: flex; max-width: 1250px; margin: 160px auto 50px 160px; gap: 40px; }
        .feed-area { flex: 2.3; }
        .side-area { flex: 1; position: sticky; top: 160px; height: fit-content; }

        .card { background: var(--glass); border: 1px solid rgba(255,255,255,0.08); border-radius: 40px; padding: 35px; margin-bottom: 35px; backdrop-filter: blur(100px); position: relative; }
        .btn-x { background: #fff; color: #000; border: none; padding: 12px 30px; border-radius: 50px; font-weight: 900; cursor: pointer; }
        .btn-x:hover { background: var(--p); color: #fff; }
        
        .pfp-main { width: 110px; height: 110px; border-radius: 35px; object-fit: cover; margin-bottom: 20px; border: 2px solid var(--p); }
        .del-btn { position: absolute; top: 30px; right: 30px; color: #ff4444; cursor: pointer; opacity: 0.5; }
        .del-btn:hover { opacity: 1; }
        
        .guest-lock { filter: blur(4px); pointer-events: none; opacity: 0.5; }
        .lock-overlay { position: absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; z-index:10; }
        
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
        <i class="fas fa-power-off" onclick="location.href='${isGuest ? '/login' : '/logout'}'" style="color:var(--p)"></i>
    </div>

    <div class="wrapper">
        <div class="feed-area">
            ${isGuest ? `
                <div class="card" style="text-align:center; border: 2px solid var(--v)">
                    <h2 style="margin-bottom:10px;">GUEST MODE DETECTED</h2>
                    <p style="opacity:0.6; margin-bottom:20px;">Unlock full aura by joining the chaos.</p>
                    <button class="btn-x" onclick="location.href='/login'">SIGN UP LIL BRO</button>
                </div>
            ` : (isPortfolio ? content : `
                <div class="card">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea name="content" placeholder="Vibe check..." required id="slang-box"></textarea>
                        <input type="hidden" name="sector" value="${activeSector}">
                        <div style="display:flex; justify-content:space-between; margin-top:20px;">
                            <label style="cursor:pointer;"><i class="fas fa-image"></i><input type="file" name="media" hidden></label>
                            <button class="btn-x">TRANSMIT</button>
                        </div>
                    </form>
                </div>
            `)}
            ${!isPortfolio ? content : ''}
        </div>

        <div class="side-area">
            <div class="card ${isGuest ? 'guest-lock' : ''}">
                <h4 style="color:var(--cyan); font-size:11px; margin-bottom:15px;">GHOST PROTOCOL</h4>
                <form action="/send-anon" method="POST">
                    <input name="target" placeholder="Target..." style="width:100%; background:#000; color:#fff; border:1px solid #333; padding:10px; border-radius:10px; margin-bottom:10px;">
                    <textarea name="msg" style="height:50px;"></textarea>
                    <button class="btn-x" style="width:100%; margin-top:10px; background:var(--cyan); color:#000;">SEND ANON</button>
                </form>
            </div>
            <div class="card">
                <h4 style="opacity:0.4; font-size:11px; margin-bottom:15px;">COMMUNITIES</h4>
                <a href="/dashboard" style="display:block; color:#fff; text-decoration:none; margin-bottom:10px; font-weight:800;">🌏 GLOBAL VOID</a>
                ${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:rgba(255,255,255,0.5); text-decoration:none; margin-bottom:10px;"># ${s.name}</a>`).join('')}
            </div>
        </div>
    </div>

    <footer>
        <div>XAVIROX COSMOS 2026</div>
        <a href="mailto:xavirox.co@gmail.com" style="color:var(--p); text-decoration:none;">xavirox.co@gmail.com</a>
    </footer>

    <script>
        ${isGuest ? `
            const slangs = ${JSON.stringify(lurkerSlangs)};
            let i = 0;
            setInterval(() => {
                document.getElementById('island-txt').innerText = slangs[i % slangs.length];
                i++;
            }, 3000);
        ` : `
            const genzSlangs = ["No cap...", "What's the tea?", "Caught in 4K", "Ate and left no crumbs", "Main character energy", "Sheesh", "Bet", "Manifesting fire"];
            setInterval(() => {
                const box = document.getElementById('slang-box');
                if(box) box.placeholder = genzSlangs[Math.floor(Math.random()*genzSlangs.length)];
            }, 3000);
        `}
        const l = document.getElementById('stars');
        for(let j=0; j<150; j++) {
            const s = document.createElement('div'); s.className='stars';
            s.style.left=Math.random()*100+'vw'; s.style.top=Math.random()*100+'vh';
            l.appendChild(s);
        }
    </script>
</body>
</html>`;
};

// --- [CORE LOGIC] ---

app.get('/dashboard', async (req, res) => {
    const sec = req.query.sector || 'General';
    const posts = await Post.find(sec !== 'Global' && sec !== 'General' ? { sector: sec } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    const user = req.session.user;

    const html = posts.map(p => `
        <div class="card">
            ${(user && user.username === p.author) ? `<a href="/delete-post/${p._id}" class="del-btn"><i class="fas fa-trash"></i></a>` : ''}
            <div style="font-weight:900; color:var(--cyan); font-size:12px; margin-bottom:10px;">@${p.author} • #${p.sector}</div>
            <p style="font-size:17px; opacity:0.9;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:20px; margin-top:15px; border:1px solid #222;">` : ''}
            <div style="display:flex; gap:20px; margin-top:20px; opacity:0.5; font-size:13px;">
                <a href="/like/${p._id}" style="color:#fff; text-decoration:none;"><i class="fas fa-heart"></i> ${p.likes}</a>
                <a href="/save/${p._id}" style="color:#fff; text-decoration:none;"><i class="fas fa-bookmark"></i></a>
            </div>
        </div>
    `).join('');
    res.send(MASTER_UI(html, user, sectors, sec));
});

app.get('/portfolio', async (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    const u = await User.findOne({ username: req.session.user.username });
    const sectors = await Sector.find();
    const html = `
        <div class="card" style="text-align:center;">
            <img src="${u.pfp || 'https://via.placeholder.com/150'}" class="pfp-main">
            <form action="/upload-pfp" method="POST" enctype="multipart/form-data" style="margin-bottom:20px;">
                <input type="file" name="pfp" onchange="this.form.submit()" id="pfp-in" hidden>
                <label for="pfp-in" style="font-size:11px; color:var(--p); cursor:pointer;">CHANGE PFP</label>
            </form>
            <h1>@${u.username}</h1>
            <p style="margin:15px 0; opacity:0.6;">${u.bio}</p>
        </div>
    `;
    res.send(MASTER_UI(html, u, sectors, 'Global', true));
});

app.get('/saved-posts', async (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    const u = await User.findOne({ username: req.session.user.username }).populate('savedPosts');
    const sectors = await Sector.find();
    const html = u.savedPosts.map(p => `<div class="card"><h4>@${p.author}</h4><p>${p.content}</p></div>`).join('');
    res.send(MASTER_UI(`<h3>ARCHIVED MEMORIES</h3><br>${html}`, u, sectors, 'Global', true));
});

// --- [HANDLERS] ---
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if(user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Failed'); window.location='/login';</script>");
});

app.post('/addpost', upload.single('media'), async (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl }).save();
    res.redirect('back');
});

app.post('/upload-pfp', upload.single('pfp'), async (req, res) => {
    const pfpUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    await User.findOneAndUpdate({ username: req.session.user.username }, { pfp: pfpUrl });
    res.redirect('back');
});

app.get('/delete-post/:id', async (req, res) => {
    const p = await Post.findById(req.params.id);
    if(p && p.author === req.session.user.username) await Post.findByIdAndDelete(req.params.id);
    res.redirect('back');
});

app.get('/save/:id', async (req, res) => {
    if(!req.session.user) return res.redirect('/login');
    await User.findOneAndUpdate({ username: req.session.user.username }, { $addToSet: { savedPosts: req.params.id } });
    res.redirect('back');
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));
app.get('/login', (req, res) => res.send('...login page here...')); // Previous cat/parrot login logic fits here

app.listen(3000, () => console.log('🚀 XAVIROX 37.0 - GUEST MODE ENABLED'));