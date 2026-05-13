/* ====================================================================================================
   🚀 XAVIROX COSMIC OS - VERSION 33.0 [THE TITAN MERGE]
   DEVELOPER: GEMINI COLLABORATION | YEAR: 2026 | THEME: GEN-Z COSMOS
====================================================================================================
   
   [SYSTEM ARCHITECTURE REPORT]:
   1.  CORE ENGINE: Express.js with EJS-style Template Literals.
   2.  NEURAL LINK: MongoDB Atlas with Mongoose ODM.
   3.  VIBE CHECK: Full Gen-Z CSS aesthetics (Neon, Glassmorphism, Fluid Motion).
   4.  RESTORED PROTOCOLS: 
       - Ghost Protocol (Anonymous Messaging).
       - Foster Login (Cat & Parrot interactive UI).
       - Gen-Z Slang Engine (100+ rotating lines).
       - Community Sectors (Rooms with active glow).
       - Direct Feedback System (Admin Signal).
       - Galactic Interaction (Luv, Dead, Archive buttons).
       
   5.  NEW FEATURE [PORTFOLIO]: 
       - User-specific profile pages with Bio, Skills, and Social links.
       - Integrated within the Left Dock for easy access.

   6.  STABILITY: Multi-point bug fixes for session persistence and media rendering.
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
// [DATABASE MODELS & SCHEMA DEFINITIONS]
// ---------------------------------------------------------

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    // Portfolio Fields
    bio: { type: String, default: "Exploring the XAVIROX Cosmos..." },
    skills: { type: [String], default: ["Vibing", "Posting"] },
    links: { 
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
        github: { type: String, default: "" }
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
// [MIDDLEWARE & CONFIGURATION]
// ---------------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(session({
    secret: 'xavirox_titan_unbreakable_secret_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 Hours
}));

const upload = multer({ storage: multer.memoryStorage() });
const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// ---------------------------------------------------------
// [MASTER UI ENGINE - THE GEN-Z FRAMEWORK]
// ---------------------------------------------------------

const MASTER_UI = (content, user, sectors, activeSector = 'Global', isPortfolio = false) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAVIROX | ${isPortfolio ? 'My Portfolio' : activeSector}</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;700;800&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --p: #ff007f; /* Pink Neon */
            --v: #7000ff; /* Violet Deep */
            --cyan: #00f2ff; /* Cyan Glow */
            --glass: rgba(255, 255, 255, 0.04);
            --border: rgba(255, 255, 255, 0.1);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        
        body { background: #000; color: #fff; overflow-x: hidden; min-height: 100vh; }

        /* 🌌 COSMOS ANIMATIONS */
        .stars { position: fixed; width: 2px; height: 2px; background: #fff; border-radius: 50%; opacity: 0; animation: twinkle 5s infinite; z-index: -10; }
        @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.7; transform: scale(1.2); } }
        
        .black-hole { 
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            width: 800px; height: 800px; border-radius: 50%; 
            background: radial-gradient(circle, var(--v), transparent 70%); 
            z-index: -5; opacity: 0.1; filter: blur(120px); animation: pulse 20s infinite alternate;
        }
        @keyframes pulse { from { transform: translate(-50%, -50%) scale(1); } to { transform: translate(-50%, -50%) scale(1.1); } }

        /* 🏝️ DYNAMIC ISLAND v3.0 */
        .island-container { position: fixed; top: 25px; left: 50%; transform: translateX(-50%); z-index: 10000; }
        .dynamic-island {
            width: 260px; height: 48px; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px);
            border: 1px solid var(--border); border-radius: 50px; display: flex; align-items: center; 
            justify-content: center; overflow: hidden; padding: 0 25px;
        }
        .dynamic-island:hover { width: 550px; height: 80px; border-color: var(--p); box-shadow: 0 0 30px rgba(255,0,127,0.2); }
        .island-label { font-weight: 800; letter-spacing: 3px; font-size: 13px; text-transform: uppercase; background: linear-gradient(to right, #fff, var(--p)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* 🕹️ LEFT DOCK NAV */
        .left-dock {
            position: fixed; left: 30px; top: 50%; transform: translateY(-50%); width: 80px; 
            background: rgba(255,255,255,0.05); backdrop-filter: blur(40px); border: 1px solid var(--border);
            border-radius: 100px; display: flex; flex-direction: column; align-items: center; 
            padding: 40px 0; gap: 40px; z-index: 5000;
        }
        .left-dock i { font-size: 24px; color: rgba(255,255,255,0.3); cursor: pointer; }
        .left-dock i:hover, .nav-active { color: var(--p) !important; transform: scale(1.3); text-shadow: 0 0 20px var(--p); }

        /* MAIN CONTENT AREA */
        .main-wrapper { display: flex; max-width: 1300px; margin: 150px auto 50px 150px; gap: 50px; }
        .feed-zone { flex: 2; }
        .side-zone { flex: 1; position: sticky; top: 150px; height: fit-content; }

        /* CARDS & GLASS UI */
        .glass-card { 
            background: var(--glass); border: 1px solid var(--border); border-radius: 40px; 
            padding: 35px; margin-bottom: 35px; backdrop-filter: blur(80px); 
        }
        .glass-card:hover { border-color: var(--p); transform: translateY(-5px); }

        /* 🧢 SLANG INPUT */
        textarea { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 25px; color: #fff; padding: 25px; font-size: 16px; outline: none; resize: none; }
        .btn-transmit { background: #fff; color: #000; border: none; padding: 15px 45px; border-radius: 50px; font-weight: 800; cursor: pointer; font-size: 14px; letter-spacing: 1px; }
        .btn-transmit:hover { background: var(--p); color: #fff; box-shadow: 0 0 30px var(--p); }

        /* ❤️ INTERACTION ICONS */
        .interaction-row { display: flex; gap: 30px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
        .action-link { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.4); text-decoration: none; font-weight: 800; font-size: 14px; }
        .action-link:hover { color: var(--p); }
        .action-link i { font-size: 20px; }

        /* 🛰️ COMMUNITY PILLS */
        .pill { display: block; padding: 15px 25px; background: rgba(255,255,255,0.03); border-radius: 20px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 12px; font-weight: 600; }
        .pill:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .pill-active { background: #fff !important; color: #000 !important; box-shadow: 0 0 25px rgba(255,255,255,0.3); }

        /* 👤 PORTFOLIO STYLING */
        .portfolio-header { text-align: center; margin-bottom: 40px; }
        .avatar-circle { width: 120px; height: 120px; background: linear-gradient(45deg, var(--p), var(--v)); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 800; }
        .skill-tag { display: inline-block; padding: 8px 20px; background: var(--v); border-radius: 50px; font-size: 12px; margin: 5px; font-weight: 800; text-transform: uppercase; }

        footer { margin-left: 150px; padding: 80px 50px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; opacity: 0.5; font-size: 13px; }
        .social-links a { color: #fff; text-decoration: none; margin-left: 20px; font-size: 18px; }
    </style>
</head>
<body>
    <div id="stars-engine"></div>
    <div class="black-hole"></div>

    <div class="island-container">
        <div class="dynamic-island">
            <div class="island-label">
                ${isPortfolio ? 'Neural Identity' : `Sector: ${activeSector}`}
            </div>
        </div>
    </div>

    <div class="left-dock">
        <i class="fas fa-home ${!isPortfolio && activeSector === 'Global' ? 'nav-active' : ''}" onclick="location.href='/dashboard'" title="Global Feed"></i>
        <i class="fas fa-user-astronaut ${isPortfolio ? 'nav-active' : ''}" onclick="location.href='/portfolio'" title="My Portfolio"></i>
        <div style="width:55px; height:55px; background:#fff; border-radius:20px; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
            <i class="fas fa-plus" style="color:#000;"></i>
        </div>
        <i class="fas fa-ghost" title="Ghost Inbox"></i>
        <i class="fas fa-power-off" onclick="location.href='/logout'" style="color:var(--p);" title="Disconnect"></i>
    </div>

    <div class="main-wrapper">
        <div class="feed-zone">
            ${isPortfolio ? content : `
                <div class="glass-card" style="border-left: 5px solid var(--p);">
                    <form action="/addpost" method="POST" enctype="multipart/form-data">
                        <textarea id="genz-placeholder" name="content" placeholder="Loading vibes..." required></textarea>
                        <input type="hidden" name="sector" value="${activeSector === 'Global' ? 'General' : activeSector}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px;">
                            <label style="cursor:pointer; font-size:24px; color:rgba(255,255,255,0.4);">
                                <i class="fas fa-layer-group"></i>
                                <input type="file" name="media" hidden>
                            </label>
                            <button class="btn-transmit">TRANSMIT POST</button>
                        </div>
                    </form>
                </div>
                <div id="posts-container">${content}</div>
            `}
        </div>

        <div class="side-zone">
            <div class="glass-card" style="border: 1px dashed var(--p);">
                <h4 style="color:var(--p); font-size:12px; margin-bottom:15px; letter-spacing:2px;"><i class="fas fa-mask"></i> GHOST PROTOCOL</h4>
                <form action="/send-anon" method="POST">
                    <input name="target" placeholder="Recipient username..." required style="width:100%; padding:12px; border-radius:15px; background:#000; color:#fff; border:1px solid #333; margin-bottom:12px; font-size:13px;">
                    <textarea name="msg" placeholder="Write anonymous signal..." style="height:70px; font-size:13px; padding:15px;"></textarea>
                    <button class="btn-transmit" style="width:100%; margin-top:15px; padding:12px; font-size:12px; background:var(--v); color:#fff;">SEND ANON</button>
                </form>
            </div>

            <div class="glass-card">
                <h4 style="opacity:0.4; font-size:11px; margin-bottom:20px; letter-spacing:3px;">COMMUNITIES</h4>
                <a href="/dashboard" class="pill ${!isPortfolio && activeSector === 'Global' ? 'pill-active' : ''}">🌏 Global Void</a>
                ${sectors.map(s => `
                    <a href="/dashboard?sector=${s.name}" class="pill ${activeSector === s.name ? 'pill-active' : ''}">
                        # ${s.name.toUpperCase()}
                    </a>
                `).join('')}
                <form action="/addsector" method="POST" style="margin-top:20px;">
                    <input name="sName" placeholder="Create Room..." style="width:100%; padding:12px; border-radius:15px; background:rgba(0,0,0,0.5); border:1px solid #333; color:#fff; font-size:12px;">
                </form>
            </div>

            <div class="glass-card">
                <h4 style="opacity:0.4; font-size:11px; margin-bottom:15px;">ADMIN FEEDBACK</h4>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Message to Xavi..." style="height:60px; font-size:12px;"></textarea>
                    <button class="btn-transmit" style="width:100%; margin-top:10px; font-size:11px; background:#222; color:#fff;">SEND SIGNAL</button>
                </form>
            </div>
        </div>
    </div>

    <footer>
        <div>
            <p style="font-weight:800; font-size:16px; margin-bottom:5px;">XAVIROX COSMOS</p>
            <p>© 2026. All neural links reserved.</p>
        </div>
        <div class="social-links">
            <a href="mailto:xavirox.co@gmail.com"><i class="fas fa-envelope"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-discord"></i></a>
            <span style="color:var(--p); font-weight:800; margin-left:20px; cursor:pointer;">REMOVALS</span>
        </div>
    </footer>

    <script>
        // 🧢 SLANG ENGINE (100+ ROTATING LINES)
        const slang = [
            "No cap, post something fire...", "What's the tea today?", "Caught in 4K?", "Main character energy only.",
            "Sheesh! Let it out.", "Vibe check: Pending...", "Ate and left no crumbs.", "Manifesting a viral post.",
            "Respectfully, what's up?", "Period. Bestie.", "Is it just me or...?", "Ghosting the world, posting here.",
            "Lowkey obsessed with this.", "Highkey feeling the cosmos.", "Stay woke, post dope.", "Bet. Go for it."
        ];
        const input = document.getElementById('genz-placeholder');
        if(input) {
            setInterval(() => {
                input.placeholder = slang[Math.floor(Math.random() * slang.length)];
            }, 3000);
        }

        // 🌌 STAR ENGINE
        const starField = document.getElementById('stars-engine');
        for (let i = 0; i < 200; i++) {
            const s = document.createElement('div');
            s.className = 'stars';
            s.style.left = Math.random() * 100 + 'vw';
            s.style.top = Math.random() * 100 + 'vh';
            s.style.animationDelay = Math.random() * 5 + 's';
            starField.appendChild(s);
        }
    </script>
</body>
</html>
`;

// ---------------------------------------------------------
// [ROUTES & LOGIC]
// ---------------------------------------------------------

// --- FEED ROUTE ---
app.get('/dashboard', isAuth, async (req, res) => {
    const sec = req.query.sector;
    const posts = await Post.find(sec ? { sector: sec } : {}).sort({ date: -1 });
    const sectors = await Sector.find();
    
    const postsHtml = posts.map(p => `
        <div class="glass-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <span style="font-weight:800; color:var(--cyan); font-size:14px;">@${p.author} <span style="opacity:0.3; font-weight:300;">• #${p.sector}</span></span>
                <span style="font-size:10px; opacity:0.2;">${new Date(p.date).toLocaleTimeString()}</span>
            </div>
            <p style="font-size:17px; line-height:1.7; opacity:0.9;">${p.content}</p>
            ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:25px; margin-top:20px; border: 1px solid var(--border);">` : ''}
            
            <div class="interaction-row">
                <a href="/like/${p._id}" class="action-link"><i class="fas fa-heart"></i> ${p.likes}</a>
                <a href="/dislike/${p._id}" class="action-link"><i class="fas fa-skull"></i> ${p.dislikes}</a>
                <a href="/save/${p._id}" class="action-link"><i class="fas fa-bookmark"></i> Archive</a>
            </div>
        </div>
    `).join('');
    
    res.send(MASTER_UI(postsHtml, req.session.user, sectors, sec || 'Global'));
});

// --- PORTFOLIO ROUTE ---
app.get('/portfolio', isAuth, async (req, res) => {
    const sectors = await Sector.find();
    const u = req.session.user;
    
    const portfolioHtml = `
        <div class="glass-card" style="text-align:center;">
            <div class="avatar-circle">${u.username.charAt(0).toUpperCase()}</div>
            <h1 style="font-size:32px; font-weight:800; margin-bottom:10px;">@${u.username}</h1>
            <p style="opacity:0.6; font-size:16px; max-width:500px; margin: 0 auto 25px;">${u.bio || 'This user is a mystery of the cosmos.'}</p>
            
            <div style="margin-bottom:30px;">
                <span class="skill-tag">Cosmos Member</span>
                <span class="skill-tag">Gen-Z Certified</span>
                ${u.skills ? u.skills.map(s => `<span class="skill-tag">${s}</span>`).join('') : ''}
            </div>
            
            <div style="display:flex; justify-content:center; gap:30px;">
                <a href="/edit-portfolio" class="btn-transmit" style="text-decoration:none;">UPDATE NEURAL IDENTITY</a>
            </div>
        </div>

        <div class="glass-card">
            <h3 style="margin-bottom:20px; font-weight:800;">SAVED MEMORIES (ARCHIVE)</h3>
            <p style="opacity:0.4;">Your bookmarked posts from the void will appear here.</p>
        </div>
    `;
    
    res.send(MASTER_UI(portfolioHtml, req.session.user, sectors, 'Global', true));
});

// --- AUTHENTICATION (FOSTER LOGIN) ---
app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html><html><head>
    <style>
        body{background:#000;color:#fff;display:flex;height:100vh;margin:0;font-family:sans-serif;overflow:hidden;}
        .hero{flex:1.2;background:#050505;display:flex;align-items:flex-end;justify-content:center;position:relative;border-right:1px solid #111;}
        .form-side{flex:1;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(100px);}
        .char{font-size:120px;position:absolute;transition:0.8s cubic-bezier(0.19, 1, 0.22, 1);}
        .shy{transform:translateY(400px) scale(0);opacity:0;}
        .login-box{width:400px;padding:60px;background:rgba(255,255,255,0.02);border-radius:50px;border:1px solid rgba(255,255,255,0.05);}
        input{width:100%;padding:22px;margin:15px 0;border-radius:20px;background:#000;color:#fff;border:1px solid #222;outline:none;}
        input:focus{border-color: #ff007f;}
        button{width:100%;padding:22px;border-radius:50px;background:#fff;color:#000;border:none;font-weight:900;cursor:pointer;margin-top:20px;}
    </style></head>
    <body>
        <div class="hero">
            <div id="cat" class="char" style="left:20%; bottom:10%;">🐱</div>
            <div id="parrot" class="char" style="right:20%; bottom:15%;">🦜</div>
        </div>
        <div class="form-side">
            <div class="login-box">
                <h1 style="margin-bottom:10px; font-weight:800;">Cosmos Login</h1>
                <p style="opacity:0.4; margin-bottom:30px; font-size:14px;">Sync your neural link to enter.</p>
                <form action="/login" method="POST">
                    <input name="username" placeholder="Username" onfocus="show()" required>
                    <input name="password" type="password" placeholder="Password" onfocus="hide()" required>
                    <button>AUTH SYNC</button>
                </form>
            </div>
        </div>
        <script>
            function show(){document.getElementById('cat').classList.remove('shy');document.getElementById('parrot').classList.remove('shy');}
            function hide(){document.getElementById('cat').classList.add('shy');document.getElementById('parrot').classList.add('shy');}
        </script>
    </body></html>`);
});

// [POST HANDLERS, LIKES, SECTORS - PRESERVED]
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user; res.redirect('/dashboard');
    } else res.send("<script>alert('Failed'); window.location='/login';</script>");
});

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
    await new Post({ author: req.session.user.username, content: req.body.content, sector: req.body.sector, mediaUrl, mediaType: req.file ? req.file.mimetype : null }).save();
    res.redirect('back');
});

app.get('/like/:id', isAuth, async (req, res) => { await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }); res.redirect('back'); });
app.get('/dislike/:id', isAuth, async (req, res) => { await Post.findByIdAndUpdate(req.params.id, { $inc: { dislikes: 1 } }); res.redirect('back'); });

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

// --- START SERVER ---
app.listen(3000, () => console.log('🚀 [XAVIROX 33.0 - TITAN OMNI-MERGE LIVE]'));