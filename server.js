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
        :root {
            --p: #ff007f;
            --b: #007AFF;
            --glass: rgba(255,255,255,0.08);
            --border: rgba(255,255,255,0.15);

            /* Light Pink / Deep Navy theme system */
            --light-bg: #FFF0F5;
            --light-text: #0F172A;
            --dark-bg: #0F172A;
            --dark-text: #FFF0F5;
        }

        * { box-sizing: border-box; scroll-behavior: smooth; }
        body {
            margin: 0;
            font-family: -apple-system, sans-serif;
            overflow-x: hidden;

            background: var(--light-bg);
            color: var(--light-text);
        }

        /* Dark mode inversion (class-based for compatibility with existing theme runtime) */
        html.dark body {
            background: var(--dark-bg);
            color: var(--dark-text);
        }

        .glass-surface {
            backdrop-filter: blur(40px) saturate(220%);
            -webkit-backdrop-filter: blur(40px) saturate(220%);
            background: rgba(255,255,255,0.40);
            border: 1px solid rgba(15, 23, 42, 0.10);
            color: inherit;
        }
        html.dark .glass-surface {
            background: rgba(0,0,0,0.40);
            border: 1px solid rgba(255, 240, 245, 0.10);
        }


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
                <form id="mainPostForm" action="/addpost" method="POST" enctype="multipart/form-data" data-ajax="1">
                    <textarea id="txBarEngine" name="content" placeholder="Drop your neural vibe..." required></textarea>

                    <!-- Premium media composer (local preview via createObjectURL) -->
                    <div style="margin-top:12px; display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                        <label style="display:inline-flex; align-items:center; gap:10px; cursor:pointer;">
                            <i class="fas fa-camera" style="color:var(--p);"></i>
                            <span style="font-weight:900; font-size:12px; opacity:0.85;">Add Image/Video</span>
                            <input id="postMediaInput" type="file" name="media" accept="image/*,video/*" style="display:none;" />
                        </label>
                    </div>

                    <div id="mediaPreviewMount" class="media-preview-mount" hidden></div>

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

        (function initPostComposerFix() {
            const form = document.getElementById('mainPostForm');
            const fileInput = document.getElementById('postMediaInput');
            const previewMount = document.getElementById('mediaPreviewMount');
            if (!form || !fileInput || !previewMount) return;

            let objectUrl = null;

            const clearPreview = () => {
                if (objectUrl) {
                    try { URL.revokeObjectURL(objectUrl); } catch (_) {}
                    objectUrl = null;
                }
                previewMount.innerHTML = '';
                previewMount.hidden = true;
                fileInput.value = '';
            };

            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                if (!file) {
                    clearPreview();
                    return;
                }

                if (objectUrl) {
                    try { URL.revokeObjectURL(objectUrl); } catch (_) {}
                    objectUrl = null;
                }

                objectUrl = URL.createObjectURL(file);
                const isVideo = (file.type || '').startsWith('video/');

                previewMount.hidden = false;
                previewMount.innerHTML = isVideo
                    ? '<div class="post-media-wrap">' +
                      '<video src="' + objectUrl + '" controls playsinline class="post-media-node"></video>' +
                      '<button type="button" class="media-preview-clear" aria-label="Remove media">✕</button>' +
                      '</div>'
                    : '<div class="post-media-wrap">' +
                      '<img src="' + objectUrl + '" alt="Preview" class="post-media-node" />' +
                      '<button type="button" class="media-preview-clear" aria-label="Remove media">✕</button>' +
                      '</div>';

                const clearBtn = previewMount.querySelector('.media-preview-clear');
                if (clearBtn) clearBtn.addEventListener('click', clearPreview);
            });

            // POST submission: ensure local preview is cleared and UI updates cleanly.
            form.addEventListener('submit', async (event) => {
                if (form.dataset.ajax !== '1') return;
                event.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) submitBtn.disabled = true;

                try {
                    const fd = new FormData(form);
                    const res = await fetch('/addpost', {
                        method: 'POST',
                        body: fd,
                        credentials: 'same-origin'
                    });

                    if (res.ok) {
                        const tx = document.getElementById('txBarEngine');
                        if (tx) tx.value = '';

                        clearPreview();

                        // Server currently redirects; if we got redirected, follow it.
                        if (res.redirected) {
                            window.location.href = res.url;
                        } else {
                            window.location.href = '/dashboard';
                        }
                        return;
                    }
                    alert('Transmission failed — matrix uplink rejected.');
                } catch (e) {
                    alert('Transmission uplink failed.');
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        })();

        async function vote(id, type) {
            const res = await fetch('/api/vote/' + id, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type}) });
            const data = await res.json();
            if(data.success) document.getElementById('v-' + id).innerText = data.newVotes;
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

// MEDIA upload (in-memory for fast preview; persisted via public/uploads)
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const safeExt = (path.extname(file.originalname || '') || '').toLowerCase() || '';
        const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + safeExt;
        cb(null, name);
    }
});
const upload = multer({ storage });

app.post('/addpost', isAuth, upload.single('media'), async (req, res) => {
    const author = req.session.user.username;
    const content = (req.body.content || '').trim();

    const mediaUrl = req.file ? ('/uploads/' + req.file.filename) : null;

    await new Post({
        author,
        content,
        media: mediaUrl
    }).save();

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
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XAVIROX | Login</title>
    <link rel="stylesheet" href="/style.css" />
    <style>
        /* Minimal utility layer so this page is self-operational without Tailwind build */
        .w-screen{width:100vw} .h-screen{min-height:100vh} .flex{display:flex}
        .items-center{align-items:center} .justify-center{justify-content:center} .overflow-hidden{overflow:hidden}
        .relative{position:relative} .absolute{position:absolute} .top-4{top:1rem} .right-4{right:1rem}
        .z-50{z-index:50} .text-emerald-400\/80{color:rgba(52,211,153,0.8)}
        .font-mono{font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}
        .text-\[11px\]{font-size:11px}

        /* Animated metric ticker pulse */
        @keyframes metricPulse { 0%,100%{opacity:.65; transform: translateZ(0)} 50%{opacity:1; transform: translateZ(0) scale(1.02)} }
        .metrics-pulse{ animation: metricPulse 1.7s ease-in-out infinite; }

        /* Theme toggle button */
        .theme-toggle-btn{
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 50;
            width: 44px;
            height: 44px;
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(0,0,0,0.35);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
            box-shadow: 0 0 20px rgba(168,85,247,0.18);
        }
        .theme-toggle-btn:hover{ transform: scale(1.05); box-shadow: 0 0 28px rgba(168,85,247,0.28); }
        .theme-toggle-btn:active{ transform: scale(0.99); }

        /* Cyber subtle link styling */
        a{ color: rgba(168,85,247,0.9); text-decoration:none; font-weight:800; }
        a:hover{ text-shadow: 0 0 18px rgba(168,85,247,0.35); }

        /* Glass glassmorphism card */
        .glass{
            backdrop-filter: blur(2xl);
        }

        /* Google button hover glow */
        .google-btn{
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, filter 0.25s ease;
        }
        .google-btn:hover{
            transform: scale(1.02);
            box-shadow: 0 0 24px rgba(168,85,247,0.35), 0 0 18px rgba(0,242,255,0.18);
            filter: saturate(1.15);
        }

        /* Inputs */
        .cyber-input{
            width: 100%;
            background: rgba(0,0,0,0.5);
            border: 1px solid rgba(39,39,42,1);
            color: rgb(161,161,170);
            border-radius: 12px;
            padding: 14px 16px;
            outline: none;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 12px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cyber-input:focus{
            border-color: rgba(168,85,247,0.8);
            box-shadow: 0 0 0 3px rgba(168,85,247,0.15);
        }

        /* Wide dark capsule google */
        .google-btn{
            width: 100%;
            background: rgb(9,9,11);
            border: 1px solid rgba(39,39,42,1);
            color: rgb(228,228,231);
            padding: 14px 16px;
            border-radius: 12px;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            display:flex;
            align-items:center;
            justify-content:center;
            gap: 12px;
            text-decoration:none;
            margin-top: 6px;
            box-shadow: 0 0 0 rgba(168,85,247,0.5);
        }

        .card-shadow{ box-shadow: 0 0 50px rgba(0,0,0,0.8); }
        .halo{ background: radial-gradient(circle_at_center,rgba(147,51,234,0.15)_0%,transparent_60%); }
    </style>
</head>
<body class="auth-workspace cosmic-theme-body">
    <div class="auth-ambient-halo"></div>

    <div class="theme-toggle-btn" id="cosmicThemeToggle" role="switch" aria-checked="false" aria-label="Toggle theme">
        <span id="themeIcon" style="font-size:16px; font-weight:900; color:#e4e4e7;">☾</span>
    </div>

    <div class="w-screen h-screen flex items-center justify-center overflow-hidden relative" style="background:#030305;">
        <div class="halo absolute inset-0" style="z-index:0"></div>

        <div style="position:relative; z-index:2; width:100%; max-width:28rem; padding: 24px; display:flex; align-items:center; justify-content:center;">
            <div class="backdrop-blur-2xl bg-zinc-900/40 border border-white/10 rounded-2xl p-8 w-full max-w-md card-shadow" style="width:100%; background: rgba(24,24,27,0.40); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; padding: 32px;">

                <div class="auth-card-header" style="text-align:center; margin-bottom: 10px;">
                    <div style="font-weight: 950; letter-spacing: 0.3em; color:#fff; text-transform:uppercase; font-size: 14px; opacity:0.9;">
                        XAVIROX LOGIN
                    </div>
                    <div style="height:10px"></div>
                </div>

                <div class="metrics-pulse font-mono text-emerald-400/80" style="font-size:11px; text-align:center; margin: 6px 0 18px 0;">
                    [ ⚡ 4,129 AGENTS SYNCED IN THE MATRIX ]
                </div>

                <form action="/login" method="POST">
                    <input class="cyber-input" type="text" name="username" placeholder="NEURAL ID" required />
                    <input class="cyber-input" type="password" name="password" placeholder="ACCESS KEY" required />

                    <button type="submit" class="cyber-input" style="background: rgba(168,85,247,0.18); border-color: rgba(168,85,247,0.6); color:#fff; margin-top:8px; cursor:pointer; transition: transform 0.25s ease, box-shadow 0.25s ease;" onmouseover="this.style.transform='scale(1.01)'; this.style.boxShadow='0 0 24px rgba(168,85,247,0.25)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
                        INITIALIZE CORE
                    </button>
                </form>

                <div class="auth-divider" style="margin: 18px 0 8px; opacity:0.55;">GOOGLE UPLINK</div>

                <a class="google-btn" href="/auth/google" aria-label="Login with Google">
                    <i class="fa-brands fa-google" style="font-size:18px; filter: drop-shadow(0 0 8px rgba(66,133,244,0.8));"></i>
                    CONTINUE WITH GOOGLE
                </a>

                <p style="font-size: 12px; opacity: 0.55; margin-top: 18px; text-align:center;">
                    New Entity? <a href="/signup">Sync with Nebula</a>
                </p>
            </div>
        </div>
    </div>

    <script>
        (function(){
            const btn = document.getElementById('cosmicThemeToggle');
            const icon = document.getElementById('themeIcon');
            // Lightweight toggle that only flips a class; your global theme runtime may exist elsewhere.
            const root = document.documentElement;
            const body = document.body;
            const current = localStorage.getItem('xavirox_login_theme') || 'dark';
            const setIcon = (t)=>{ icon.textContent = (t === 'dark') ? '☾' : '☀'; };
            const apply = (t)=>{
                const isDark = t === 'dark';
                btn.setAttribute('aria-checked', String(!isDark));
                root.classList.toggle('dark', isDark);
                body.classList.toggle('dark', isDark);
                setIcon(t);
            };
            apply(current);

            btn.addEventListener('click', ()=>{
                const next = (root.classList.contains('dark')) ? 'light' : 'dark';
                localStorage.setItem('xavirox_login_theme', next);
                apply(next);
            });
        })();
    </script>

</body>
</html>
    `);
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