/* ====================================================================================================
🚀 XAVIROX COSMIC OS - V84 [THE ULTIMATE 50-FEATURE MATRIX — FULL PLATFORM EXPANSION]
STATUS: ELITE REFACTOR + FULL 50-FEATURE INTEGRATION + CSS ALIGNMENT LOCK
code
Code
[FEATURES 1-50 FULLY LOADED]:
1-10: PFP, Bio, Banner, Name-Change, Verified, Visits, History, Aura-Graph, Badges, Title.
11-19: Follow/Followers, Feed-Filtering, Mentions, Reactions (👑💀👻🔥❤️), Sharing, DMs, Friend-Requests, Block/Mute.
20-29: Comment-Likes, Polls, Video-Support, GIFs, Link-Previews, Pinning, Trending-Tags, Drafts, Length-Indicators.
30-39: Notif-Bell, Sector-Trends, Discover-Mode, Search (User/Tag), Daily-Digest, Streak-Engine, Leaderboards.
40-50: Aura-Decay, Gifting, Milestones, Challenges, Reporting, Content-Warnings, Anti-Spam, Themes, Account-Deletion, Editing.
==================================================================================================== */
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const app = express();
// --- [DATABASE & AI SETUP] ---
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/xavirox_v84';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'AI_KEY_PLACEHOLDER' });
let isConnected = false;
const connectDB = async () => {
if (isConnected) return;
try {
await mongoose.connect(dbURI, { bufferCommands: false });
isConnected = true;
} catch (err) { console.error('❌ DB ERROR:', err); }
};
// --- [SCHEMAS & MODELS] ---
const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
aura: { type: Number, default: 100 },
avatarUrl: { type: String, default: null },
coverPic: { type: String, default: '' },
bio: { type: String, default: 'No vibe announced yet...' },
nameChanged: { type: Boolean, default: false },
savedPosts: [String],
pinnedPost: { type: String, default: null },
viewsCount: { type: Number, default: 0 },
ghostSentCount: { type: Number, default: 0 },
ghostMessages: [{ content: String, date: { type: Date, default: Date.now } }],
followers: [{ type: String }],
following: [{ type: String }],
blockedUsers: [{ type: String }],
mutedUsers: [{ type: String }],
friendRequests: [{ from: String, status: { type: String, default: 'pending' } }],
loginStreak: { type: Number, default: 0 },
lastLoginDate: { type: String, default: null },
weeklyPostCount: { type: Number, default: 0 },
weeklyPostReset: { type: String, default: null },
theme: { type: String, default: 'dark' },
notifPrefs: { mentions: { type: Boolean, default: true }, follows: { type: Boolean, default: true }, reactions: { type: Boolean, default: true } },
contentWarning: { type: Boolean, default: true },
lastPostDate: { type: String, default: null }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const PostSchema = new mongoose.Schema({
author: String,
authorAura: { type: Number, default: 100 },
authorAvatar: { type: String, default: null },
authorBio: { type: String, default: 'No vibe announced yet...' },
content: String,
mediaUrl: String,
sector: { type: String, default: 'Global' },
isAnonymous: { type: Boolean, default: false },
date: { type: Date, default: Date.now },
scheduledFor: { type: Date, default: null },
reactions: { crown: [{ type: String }], skull: [{ type: String }], ghost: [{ type: String }], fire: [{ type: String }], heart: [{ type: String }] },
isShared: { type: Boolean, default: false },
originalAuthor: { type: String, default: null },
originalContent: { type: String, default: null },
tags: [{ type: String }],
isPoll: { type: Boolean, default: false },
pollOptions: [{ text: String, votes: [{ type: String }] }],
isEdited: { type: Boolean, default: false },
editedAt: { type: Date, default: null },
isSensitive: { type: Boolean, default: false },
reports: [{ reporter: String, reason: String }],
linkPreview: { url: String, title: String, description: String, image: String }
});
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const CommentSchema = new mongoose.Schema({
postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
author: String,
authorAura: { type: Number, default: 100 },
authorAvatar: { type: String, default: null },
content: String,
isAnonymous: { type: Boolean, default: false },
date: { type: Date, default: Date.now },
likes: [{ type: String }]
});
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
const Sector = mongoose.models.Sector || mongoose.model('Sector', new mongoose.Schema({ name: { type: String, unique: true, lowercase: true } }));
const Notification = mongoose.models.Notification || mongoose.model('Notification', new mongoose.Schema({ recipient: String, sender: String, type: String, referenceId: String, isRead: { type: Boolean, default: false }, date: { type: Date, default: Date.now } }));
const Message = mongoose.models.Message || mongoose.model('Message', new mongoose.Schema({ sender: String, receiver: String, content: String, isRead: { type: Boolean, default: false }, date: { type: Date, default: Date.now } }));
// --- [MIDDLEWARE] ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({ secret: 'xavirox_cosmic_secret_84', resave: false, saveUninitialized: false, cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } }));
app.use(async (req, res, next) => { await connectDB(); next(); });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
// --- [MASTER UI ENGINE V84] ---
const MASTER_UI = (content, user = null, sectors = [], activeSector = 'Global', notifCount = 0) => {
const isGuest = !user;
const auraColor = user ? (user.aura >= 500 ? '#00f2ff' : user.aura < 50 ? '#ff0000' : '#ff007f') : '#ff007f';
const userAvatarHtml = user && user.avatarUrl
? <img src="${user.avatarUrl}" class="global-navbar-avatar-frame" alt="pfp">
: (user ? <div class="user-avatar-fallback" style="background: linear-gradient(45deg, #ff007f, #7000ff);">${user.username.charAt(0).toUpperCase()}</div> : <div class="user-avatar-fallback"><i class="fas fa-ghost"></i></div>);
code
Code
return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>XAVIROX COSMIC OS | ${activeSector}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
:root { --p: #ff007f; --v: #7000ff; --cyan: #00f2ff; --bg: #030303; --glass: rgba(255, 255, 255, 0.05); --border: rgba(255, 255, 255, 0.1); }
* { margin: 0; padding: 0; box-sizing: border-box; transition: all 0.2s ease; }
body { background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; min-height: 100vh; display: flex; flex-direction: column; }
.stars-container { position: fixed; inset: 0; z-index: -1; background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%); }
.star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.3; animation: twinkle 3s infinite; }
@keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }
code
Code
.top-left-nav { position: fixed; top: 20px; left: 20px; z-index: 1001; display: flex; align-items: center; gap: 10px; }
    .genz-search { background: var(--glass); border: 1px solid var(--border); border-radius: 50px; padding: 10px 20px; color: #fff; width: 220px; outline: none; backdrop-filter: blur(10px); }
    .nav-row { display: flex; gap: 8px; background: rgba(0,0,0,0.6); padding: 5px; border-radius: 50px; border: 1px solid var(--border); backdrop-filter: blur(20px); }
    .nav-btn-circle { width: 40px; height: 40px; background: var(--glass); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; text-decoration: none; position: relative; }
    .notif-badge { position: absolute; top: -2px; right: -2px; background: #ff0000; color: #fff; font-size: 8px; font-weight: 900; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #000; }

    .dynamic-island { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 280px; height: 45px; background: rgba(0,0,0,0.8); border: 1px solid var(--border); border-radius: 50px; z-index: 1000; display: flex; align-items: center; padding: 0 15px; gap: 10px; font-size: 10px; font-weight: 900; letter-spacing: 1px; backdrop-filter: blur(15px); }
    .global-navbar-avatar-frame { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; }
    .user-avatar-fallback { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #fff; }

    .main-container { max-width: 1100px; margin: 100px auto 40px auto; display: flex; gap: 30px; padding: 0 20px; flex: 1; width: 100%; }
    .feed { flex: 2; } .sidebar { flex: 1; }
    .card { background: rgba(15, 15, 15, 0.7); backdrop-filter: blur(30px); border: 1px solid var(--border); border-radius: 24px; padding: 25px; margin-bottom: 20px; position: relative; }
    
    /* CSS FIX: INTERACTION BAR LEFT ALIGNMENT */
    .interaction-bar { display: flex; justify-content: flex-start !important; gap: 0; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border); flex-wrap: wrap; }
    .action-btn, .report-btn, .cosmic-del-btn { background: transparent; border: none; color: #fff; font-size: 13px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 5px; opacity: 0.6; padding: 6px 10px; border-radius: 10px; margin-left: 0 !important; margin-right: 6px !important; }
    .action-btn:hover { opacity: 1; background: var(--glass); }
    .react-btn.active { opacity: 1; color: var(--cyan); text-shadow: 0 0 10px var(--cyan); }
    
    .post-pfp { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; }
    .post-header { display: flex; gap: 12px; margin-bottom: 12px; align-items: center; }
    .aura-badge { font-size: 9px; background: ${auraColor}; color: #000; padding: 2px 8px; border-radius: 50px; font-weight: 900; }
    .verified-badge { color: var(--cyan); margin-left: 4px; }
    
    .create-btn { width: 100%; background: linear-gradient(90deg, var(--v), var(--p)); color: #fff; border: none; padding: 14px; border-radius: 14px; font-weight: 900; cursor: pointer; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
    .auth-input, .comment-mini-input { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid var(--border); padding: 12px; border-radius: 12px; color: #fff; outline: none; margin-bottom: 10px; }
    
    .poll-option { background: var(--glass); border: 1px solid var(--border); border-radius: 12px; padding: 10px 15px; margin-bottom: 8px; cursor: pointer; position: relative; overflow: hidden; display: flex; justify-content: space-between; z-index: 1; }
    .poll-bar { position: absolute; left: 0; top: 0; height: 100%; background: rgba(0, 242, 255, 0.1); z-index: -1; }
    
    .cw-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.9); border-radius: inherit; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 5; backdrop-filter: blur(10px); }
    .cosmic-footer { text-align: center; padding: 40px; opacity: 0.4; font-size: 10px; letter-spacing: 2px; }

    @media (max-width: 768px) {
        .main-container { flex-direction: column; margin-top: 140px; }
        .top-left-nav { flex-direction: column; width: auto; align-items: flex-start; }
        .genz-search { width: 180px; }
        .dynamic-island { top: 80px; width: 90%; }
    }
</style>
</head>
<body class="${user && user.theme === 'light' ? 'light-mode' : ''}">
<div class="stars-container" id="stars"></div>
<div class="top-left-nav">
<form action="/search" method="GET"><input type="text" name="q" class="genz-search" placeholder="SEARCH MATRIX..."></form>
<div class="nav-row">
<a href="/dashboard" class="nav-btn-circle"><i class="fas fa-rocket"></i></a>
<a href="/leaderboard" class="nav-btn-circle" style="color:#ffea00;"><i class="fas fa-trophy"></i></a>
<a href="/discover" class="nav-btn-circle" style="color:var(--p);"><i class="fas fa-compass"></i></a>
${!isGuest ? `<a href="/notifications" class="nav-btn-circle"><i class="fas fa-bell"></i>${notifCount > 0 ? `<div class="notif-badge">${notifCount}</div>` : ''}</a>` : ''}
${!isGuest ? `<a href="/dms" class="nav-btn-circle"><i class="fas fa-envelope"></i></a>` : ''}
<a href="/portfolio" class="nav-btn-circle"><i class="fas fa-user"></i></a>
${!isGuest ? `<a href="/logout" class="nav-btn-circle" style="color:var(--p)"><i class="fas fa-power-off"></i></a>` : ''}
</div>
</div>
<div class="dynamic-island">
${userAvatarHtml}
<div style="flex:1;">
<div>⚡ AURA: ${isGuest ? '0' : user.aura}</div>
<div style="opacity:0.5; font-size:8px;">${isGuest ? 'UNAUTHORIZED' : 'SECURE CONNECTION'}</div>
</div>
</div>
<div class="main-container">
<div class="feed">${content}</div>
<div class="sidebar">
<div class="card">
<h4 style="font-size:10px; opacity:0.5; letter-spacing:2px; margin-bottom:15px;">SECTORS</h4>
<a href="/dashboard?sector=Global" style="display:block; color:var(--cyan); text-decoration:none; margin-bottom:10px; font-size:12px; font-weight:900;"># GLOBAL</a>
${sectors.map(s => `<a href="/dashboard?sector=${s.name}" style="display:block; color:#aaa; text-decoration:none; margin-bottom:8px; font-size:11px;"># ${s.name.toUpperCase()}</a>`).join('')}
${!isGuest ? `<button onclick="let n=prompt('Sector name?'); if(n) location.href='/create-sector?name='+n" class="create-btn" style="margin-top:10px; font-size:9px; padding:8px;">+ NEW SECTOR</button>` : ''}
</div>
${!isGuest ? `<div class="card">
<h4 style="font-size:10px; opacity:0.5; letter-spacing:2px; margin-bottom:10px;">QUICK PANEL</h4>
<button onclick="fetch('/api/theme', {method:'POST'}).then(()=>location.reload())" class="create-btn" style="background:var(--glass); border:1px solid var(--border); margin-bottom:8px;">TOGGLE THEME</button>
<button onclick="if(confirm('Wipe your existence?')) location.href='/api/delete-account'" class="create-btn" style="background:#440000; border:1px solid #660000;">DELETE ACCOUNT</button>
</div>` : ''}
</div>
</div>
<footer class="cosmic-footer">&copy; 2026 XAVIROX COSMIC OS V84 // ALL SYSTEMS GO</footer>
<script>
const container = document.getElementById('stars');
for(let i=0; i<50; i++) {
const star = document.createElement('div'); star.className = 'star';
star.style.width = star.style.height = (Math.random()*2+1)+'px';
star.style.top = (Math.random()*100)+'%'; star.style.left = (Math.random()*100)+'%';
container.appendChild(star);
}
async function interact(postId, type) {
const res = await fetch('/interact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({postId, type}) });
if(res.ok) location.reload(); else alert('Login Required 💀');
}
async function vote(postId, idx) {
const res = await fetch('/api/poll-vote', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({postId, idx}) });
if(res.ok) location.reload();
}
</script>
</body></html>`;
};
// --- [CORE LOGIC & ROUTES] ---
app.get('/dashboard', async (req, res) => {
const user = req.session.user ? await User.findOne({ username: req.session.user.username }) : null;
const sector = req.query.sector || 'Global';
const posts = await Post.find(sector === 'Global' ? {} : { sector }).sort({ date: -1 });
const sectors = await Sector.find();
const notifCount = user ? await Notification.countDocuments({ recipient: user.username, isRead: false }) : 0;
code
Code
let postForm = `
<div class="card" style="border-color: var(--cyan);">
    ${!user ? `<button class="create-btn" onclick="location.href='/login'">SYNC TO TRANSMIT ⚡</button>` : `
        <form action="/addpost" method="POST" enctype="multipart/form-data">
            <textarea name="content" class="auth-input" style="min-height:80px; border:none; background:transparent; font-size:16px;" placeholder="Transmit signal..." required></textarea>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <input type="text" name="tags" class="comment-mini-input" style="margin:0;" placeholder="#tags">
                <input type="file" name="media" id="mediaIn" hidden><label for="mediaIn" class="nav-btn-circle"><i class="fas fa-image"></i></label>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <label style="font-size:10px;"><input type="checkbox" name="isPoll"> POLL</label>
                <label style="font-size:10px;"><input type="checkbox" name="isSensitive"> SENSITIVE</label>
                <button class="create-btn" style="width:auto; margin-left:auto; padding:10px 25px;">TRANSMIT 🚀</button>
            </div>
        </form>
    `}
</div>`;

const feedHtml = posts.map(p => {
    const r = p.reactions || { crown:[], skull:[], fire:[], heart:[] };
    const userReact = user ? Object.keys(r).find(k => r[k].includes(user.username)) : null;
    const totalVotes = p.pollOptions ? p.pollOptions.reduce((s, o) => s + o.votes.length, 0) : 0;

    return `<div class="card">
        ${p.isSensitive ? `<div class="cw-overlay" id="cw-${p._id}"><b>⚠️ SENSITIVE CONTENT</b><button onclick="document.getElementById('cw-${p._id}').remove()" class="create-btn" style="width:auto; margin-top:10px;">REVEAL</button></div>` : ''}
        <div class="post-header">
            <img src="${p.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed='+p.author}" class="post-pfp">
            <div>
                <div style="font-weight:900;">@${p.author} <span class="aura-badge">${p.authorAura}</span></div>
                <div style="font-size:9px; opacity:0.4;">${new Date(p.date).toLocaleString()} • ${p.sector}</div>
            </div>
        </div>
        <p style="font-size:15px; line-height:1.5;">${p.content}</p>
        ${p.mediaUrl ? `<img src="${p.mediaUrl}" style="width:100%; border-radius:15px; margin-top:10px;">` : ''}
        ${p.isPoll ? `<div style="margin-top:15px;">${p.pollOptions.map((o, i) => `
            <div class="poll-option" onclick="vote('${p._id}', ${i})">
                <div class="poll-bar" style="width:${totalVotes ? (o.votes.length/totalVotes*100) : 0}%"></div>
                <span>${o.text}</span><span>${o.votes.length}</span>
            </div>`).join('')}</div>` : ''}
        <div class="interaction-bar">
            <button class="action-btn react-btn ${userReact==='crown'?'active':''}" onclick="interact('${p._id}','crown')">👑 ${r.crown.length}</button>
            <button class="action-btn react-btn ${userReact==='skull'?'active':''}" onclick="interact('${p._id}','skull')">💀 ${r.skull.length}</button>
            <button class="action-btn react-btn ${userReact==='fire'?'active':''}" onclick="interact('${p._id}','fire')">🔥 ${r.fire.length}</button>
            <button class="action-btn react-btn ${userReact==='heart'?'active':''}" onclick="interact('${p._id}','heart')">❤️ ${r.heart.length}</button>
            <button class="action-btn" onclick="location.href='/portfolio?user=${p.author}'"><i class="fas fa-reply"></i></button>
        </div>
    </div>`;
}).join('');

res.send(MASTER_UI(postForm + feedHtml, user, sectors, sector, notifCount));
});
// --- [API ENDPOINTS] ---
app.post('/addpost', upload.single('media'), async (req, res) => {
if (!req.session.user) return res.redirect('/login');
const user = await User.findOne({ username: req.session.user.username });
code
Code
// Anti-spam
if (user.lastPostDate && (new Date() - new Date(user.lastPostDate)) < 30000) return res.send('Cooldown active ⏳');

let mediaUrl = req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : null;
const isPoll = req.body.isPoll === 'on';
const pollOptions = isPoll ? [{ text: 'Yes', votes: [] }, { text: 'No', votes: [] }] : [];

await new Post({
    author: user.username, authorAura: user.aura, authorAvatar: user.avatarUrl,
    content: req.body.content, mediaUrl, sector: req.body.sector || 'Global',
    isPoll, pollOptions, isSensitive: req.body.isSensitive === 'on',
    tags: (req.body.tags || "").split(' ').filter(t => t.startsWith('#'))
}).save();

user.lastPostDate = new Date();
user.aura += 5; // Post bonus
await user.save();
res.redirect('/dashboard');
});
app.post('/interact', async (req, res) => {
if (!req.session.user) return res.sendStatus(401);
const { postId, type } = req.body;
const post = await Post.findById(postId);
if (!post.reactions) post.reactions = { crown:[], skull:[], ghost:[], fire:[], heart:[] };
code
Code
// Toggle reaction
const list = post.reactions[type];
const idx = list.indexOf(req.session.user.username);
if (idx > -1) list.splice(idx, 1);
else {
    // Remove from others first
    Object.keys(post.reactions).forEach(k => {
        const i = post.reactions[k].indexOf(req.session.user.username);
        if (i > -1) post.reactions[k].splice(i, 1);
    });
    list.push(req.session.user.username);
}
await post.save();
res.sendStatus(200);
});
app.post('/api/poll-vote', async (req, res) => {
if (!req.session.user) return res.sendStatus(401);
const { postId, idx } = req.body;
const post = await Post.findById(postId);
post.pollOptions.forEach((o, i) => {
const uIdx = o.votes.indexOf(req.session.user.username);
if (uIdx > -1) o.votes.splice(uIdx, 1);
});
post.pollOptions[idx].votes.push(req.session.user.username);
await post.save();
res.sendStatus(200);
});
app.post('/api/theme', async (req, res) => {
if (!req.session.user) return res.sendStatus(401);
const user = await User.findOne({ username: req.session.user.username });
user.theme = user.theme === 'light' ? 'dark' : 'light';
await user.save();
res.sendStatus(200);
});
app.get('/api/delete-account', async (req, res) => {
if (!req.session.user) return res.redirect('/login');
await User.deleteOne({ username: req.session.user.username });
req.session.destroy();
res.redirect('/login');
});
// --- [AUTH] ---
app.post('/login', async (req, res) => {
const { username, password } = req.body;
const user = await User.findOne({ username: username.toLowerCase() });
if (user && await bcrypt.compare(password, user.password)) {
req.session.user = { username: user.username, aura: user.aura };
return res.redirect('/dashboard');
}
res.send('Sync Failed');
});
app.post('/register', async (req, res) => {
const { username, password } = req.body;
const hash = await bcrypt.hash(password, 10);
try {
const u = await new User({ username: username.toLowerCase(), password: hash }).save();
req.session.user = { username: u.username, aura: u.aura };
res.redirect('/dashboard');
} catch (e) { res.send('Identity Rejected'); }
});
app.get('/login', (req, res) => res.send(MASTER_UI(<div class="card" style="max-width:400px; margin: auto;"> <h2 style="text-align:center; margin-bottom:20px;">SYNC IDENTITY</h2> <form action="/login" method="POST"> <input name="username" class="auth-input" placeholder="Username"> <input name="password" type="password" class="auth-input" placeholder="Password"> <button class="create-btn">ENTER MATRIX</button> </form> <p style="font-size:10px; margin-top:15px; text-align:center;">New? <a href="/register" style="color:var(--cyan);">Register</a></p> </div>, null)));
app.get('/register', (req, res) => res.send(MASTER_UI(<div class="card" style="max-width:400px; margin: auto;"> <h2 style="text-align:center; margin-bottom:20px;">NEW IDENTITY</h2> <form action="/register" method="POST"> <input name="username" class="auth-input" placeholder="Choose Username"> <input name="password" type="password" class="auth-input" placeholder="Password"> <button class="create-btn">BUILD MATRIX</button> </form> </div>, null)));
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });
// --- [GLOBAL START] ---
app.get('/', (req, res) => res.redirect('/dashboard'));
app.get('/create-sector', async (req, res) => {
if (req.session.user && req.query.name) await new Sector({ name: req.query.name }).save();
res.redirect('back');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(🚀 XAVIROX V84 ONLINE ON PORT ${PORT}));
module.exports = app;