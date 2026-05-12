const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// 1. DATABASE CONNECTION
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000
})
.then(() => console.log('✅ XAVIROX NEURAL CORE CONNECTED (CLOUD)'))
.catch(err => console.error('❌ CONNECTION FAILED:', err));

// 2. DATA SCHEMAS
const Post = mongoose.model('Post', new mongoose.Schema({
    author: { type: String, default: 'r/Xavirox_Official' },
    content: String,
    votes: { type: Number, default: 0 },
    votedBy: { type: Array, default: [] }, 
    date: { type: Date, default: Date.now }
}));

const Feedback = mongoose.model('Feedback', new mongoose.Schema({
    msg: String,
    date: { type: Date, default: Date.now }
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 

// Redirect Root to Dashboard
app.get('/', (req, res) => res.redirect('/dashboard'));

// 3. APIs
app.post('/api/vote/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = "admin"; 
        if (post.votedBy.includes(user)) return res.json({ success: false, message: "Signal already locked!" });
        post.votes += (req.body.type === 'up' ? 1 : -1);
        post.votedBy.push(user);
        await post.save();
        res.json({ success: true, newVotes: post.votes });
    } catch (err) { res.status(500).json({ success: false }); }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const newFB = new Feedback({ msg: req.body.feedback });
        await newFB.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
});

// 4. MAIN DASHBOARD UI (Mobile Optimized Merge)
app.get('/dashboard', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).send("<h1 style='color:white; background:#05050a; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif;'>📡 Connecting...</h1>");
        }

        const allPosts = await Post.find().sort({ date: -1 });
        const placeholders = ["Broadcast to the network...", "Drop a forbidden opinion...", "Type your thoughts..."];
        const randomLine = placeholders[Math.floor(Math.random() * placeholders.length)];

        let postHTML = allPosts.map(p => `
            <div class="glass-card post" id="post-${p._id}">
                <div class="post-header">
                    <div class="avatar-glow">X</div>
                    <div class="post-meta">
                        <span class="author-name" style="color:var(--cyan); font-weight:bold;">Xavirox User <i class="fas fa-check-circle bluetick"></i></span>
                        <div class="post-time" style="font-size:10px; opacity:0.5;">${new Date(p.date).toLocaleTimeString()}</div>
                    </div>
                </div>
                <div class="post-body" style="margin: 15px 0; line-height:1.5;">${p.content}</div>
                <div class="post-actions" style="display:flex; gap:10px;">
                    <div class="luxury-action-group">
                        <button class="lux-btn" onclick="handleVote('${p._id}', 'up')"><i class="fas fa-caret-up"></i> <span class="v-count">${p.votes}</span></button>
                        <button class="lux-btn" onclick="handleVote('${p._id}', 'down')"><i class="fas fa-caret-down"></i></button>
                    </div>
                    <button class="lux-btn-single" onclick="copyLink('${p._id}')"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>`).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    :root { --glow: #ff007f; --cyan: #00ffff; --purple: #7b61ff; --bg: #05050a; }
                    body { margin: 0; background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
                    .universe { position: fixed; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a0b2e 0%, #05050a 100%); }
                    
                    .navbar { width: 100%; height: 65px; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; position: fixed; top: 0; z-index: 1000; box-sizing: border-box; }
                    .logo { font-size: 22px; font-weight: 900; color: var(--cyan); letter-spacing: 3px; }

                    .main-layout { display: grid; grid-template-columns: 280px 1fr 320px; gap: 20px; padding: 85px 20px 20px; max-width: 1400px; margin: auto; }
                    
                    .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 20px; backdrop-filter: blur(20px); }
                    
                    @media (max-width: 1100px) { .main-layout { grid-template-columns: 250px 1fr; } .right-sidebar { display: none; } }
                    @media (max-width: 768px) { 
                        .main-layout { display: block; padding: 80px 15px 100px; } 
                        .left-sidebar { display: none; }
                    }

                    textarea { width: 100%; height: 100px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; color: #fff; padding: 15px; font-size: 15px; outline: none; resize: none; box-sizing: border-box; }
                    .transmit-btn { background: linear-gradient(45deg, var(--glow), var(--purple)); border: none; color: #fff; padding: 12px; border-radius: 15px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; box-shadow: 0 0 15px rgba(255,0,127,0.3); }
                    
                    .post-header { display: flex; align-items: center; }
                    .avatar-glow { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(45deg, var(--glow), var(--purple)); display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; }
                    
                    .luxury-action-group { display: flex; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
                    .lux-btn { background: none; border: none; color: #aaa; padding: 10px 15px; cursor: pointer; }
                    .lux-btn-single { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #aaa; padding: 10px 18px; cursor: pointer; }

                    .mobile-nav { display: none; position: fixed; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); border-top: 1px solid rgba(255,255,255,0.1); padding: 15px 0; justify-content: space-around; z-index: 1000; }
                    @media (max-width: 768px) { .mobile-nav { display: flex; } }
                </style>
            </head>
            <body>
                <div class="universe"></div>
                <nav class="navbar"><div class="logo">XAVIROX</div></nav>

                <div class="main-layout">
                    <div class="left-sidebar glass-card">
                        <div style="color:var(--cyan); margin-bottom:15px;"><i class="fas fa-brain"></i> Neural Feed</div>
                        <div style="opacity:0.5;"><i class="fas fa-fire"></i> Trending</div>
                    </div>

                    <div class="feed-container">
                        <div class="input-area glass-card" style="margin-bottom: 20px;">
                            <form action="/addpost" method="POST">
                                <textarea name="content" placeholder="${randomLine}" required></textarea>
                                <button type="submit" class="transmit-btn">TRANSMIT SIGNAL</button>
                            </form>
                        </div>
                        <div id="posts-container">${postHTML}</div>
                    </div>

                    <div class="right-sidebar glass-card" style="height:fit-content;">
                        <h3 style="color:var(--glow); font-size:12px;">FEEDBACK</h3>
                        <textarea id="fbContent" style="height:60px;" placeholder="Message..."></textarea>
                        <button onclick="sendFeedback()" class="transmit-btn">SEND</button>
                    </div>
                </div>

                <div class="mobile-nav">
                    <i class="fas fa-home" style="color:var(--cyan)"></i>
                    <i class="fas fa-search"></i>
                    <i class="fas fa-plus-circle" onclick="window.scrollTo(0,0)"></i>
                    <i class="fas fa-bell"></i>
                    <i class="fas fa-user"></i>
                </div>

                <script>
                    async function handleVote(postId, type) {
                        const res = await fetch('/api/vote/' + postId, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type })
                        });
                        const data = await res.json();
                        if(data.success) { document.querySelector('#post-'+postId+' .v-count').innerText = data.newVotes; }
                    }

                    async function sendFeedback() {
                        const fb = document.getElementById('fbContent').value;
                        if(!fb) return;
                        const res = await fetch('/api/feedback', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ feedback: fb })
                        });
                        if(res.ok) { alert("Signal Sent!"); document.getElementById('fbContent').value = ""; }
                    }

                    function copyLink(id) {
                        navigator.clipboard.writeText(window.location.origin + '/post/' + id);
                        alert('Link Copied!');
                    }
                </script>
            </body>
            </html>
        `);
    } catch (err) { res.status(500).send("Core Error"); }
});

app.post('/addpost', async (req, res) => {
    try {
        const newPost = new Post({ content: req.body.content });
        await newPost.save();
        res.redirect('/dashboard');
    } catch (err) { res.status(500).send("Error"); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 XAVIROX LIVE ON PORT ${PORT}`));