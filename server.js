const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// 1. DATABASE CONNECTION
// deployment ke waqt 'mongodb://...' ki jagah process.env.MONGO_URI use hoga
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/xavirox_core')
    .then(() => console.log('✅ NEURAL CORE CONNECTED'))
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

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 

// 3. APIs (VOTING & FEEDBACK)
app.post('/api/vote/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const user = "admin"; // Placeholder for current session
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

// 4. MAIN DASHBOARD UI
app.get('/dashboard', async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ date: -1 });
        const placeholders = [
            "Drop your forbidden opinion...",
            "Type before your brain changes its mind",
            "Start a war in the comments",
            "What's living rent free in your head?",
            "Post something dangerously relatable"
        ];
        const randomLine = placeholders[Math.floor(Math.random() * placeholders.length)];

        let postHTML = allPosts.map(p => `
            <div class="glass-card post" id="post-${p._id}">
                <div class="post-header">
                    <div class="avatar-glow">X</div>
                    <div class="post-meta">
                        <span class="author-name">Xavirox User <i class="fas fa-check-circle bluetick"></i></span>
                        <div class="post-time">${p.date.toLocaleTimeString()} | Node Stable</div>
                    </div>
                </div>
                <div class="post-body">${p.content}</div>
                <div class="post-actions">
                    <div class="luxury-action-group">
                        <button class="lux-btn upvote" onclick="handleVote('${p._id}', 'up')"><i class="fas fa-caret-up"></i> <span class="v-count">${p.votes}</span></button>
                        <div class="divider"></div>
                        <button class="lux-btn downvote" onclick="handleVote('${p._id}', 'down')"><i class="fas fa-caret-down"></i></button>
                    </div>
                    <button class="lux-btn-single share" onclick="copyLink('${p._id}')"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>`).join('');

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    :root { --glow: #ff007f; --cyan: #00ffff; --purple: #7b61ff; --bg: #05050a; }
                    body { margin: 0; background: var(--bg); color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }
                    
                    /* Background Universe */
                    .universe { position: fixed; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 50% 50%, #1a0b2e 0%, #05050a 100%); }
                    .star { position: absolute; background: white; border-radius: 50%; animation: twinkle var(--d) infinite ease-in-out; }
                    @keyframes twinkle { 
                        0%, 100% { opacity: 0.2; transform: scale(1); } 
                        50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 10px var(--cyan); } 
                    }

                    .navbar { 
                        width: 100%; height: 75px; background: rgba(0,0,0,0.8); backdrop-filter: blur(30px); 
                        border-bottom: 1px solid rgba(0,255,255,0.1); display: flex; align-items: center; 
                        justify-content: space-between; padding: 0 40px; position: fixed; top: 0; z-index: 1000; box-sizing: border-box; 
                    }

                    .main-layout { display: grid; grid-template-columns: 280px 1fr 320px; gap: 25px; padding: 100px 30px 20px; max-width: 1600px; margin: auto; }
                    
                    /* Card Styles */
                    .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 30px; padding: 25px; backdrop-filter: blur(25px); transition: 0.3s ease; }
                    .glass-card:hover { border-color: rgba(0, 255, 255, 0.3); transform: translateY(-3px); }

                    /* Typing Box */
                    textarea { width: 100%; height: 110px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: #fff; padding: 20px; font-size: 16px; outline: none; resize: none; box-sizing: border-box; }
                    .transmit-btn { background: linear-gradient(45deg, var(--glow), var(--purple)); border: none; color: #fff; padding: 12px 35px; border-radius: 18px; cursor: pointer; font-weight: 900; box-shadow: 0 0 20px rgba(255,0,127,0.4); transition: 0.3s; }
                    .transmit-btn:hover { box-shadow: 0 0 40px var(--glow); transform: scale(1.05); }

                    /* Post Elements */
                    .post { margin-bottom: 25px; border-left: 4px solid transparent; }
                    .post:hover { border-left-color: var(--cyan); }
                    .avatar-glow { width: 50px; height: 50px; border-radius: 15px; background: linear-gradient(45deg, var(--glow), var(--purple)); display: flex; align-items: center; justify-content: center; font-weight: bold; }
                    .bluetick { color: var(--cyan); margin-left: 5px; filter: drop-shadow(0 0 5px var(--cyan)); }
                    
                    /* Buttons */
                    .luxury-action-group { display: flex; background: rgba(255,255,255,0.07); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
                    .lux-btn { background: none; border: none; color: #aaa; padding: 12px 20px; cursor: pointer; }
                    .lux-btn:hover { color: var(--cyan); background: rgba(0,255,255,0.1); }
                    .lux-btn-single { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; color: #aaa; padding: 12px 22px; cursor: pointer; transition: 0.2s; }
                    .lux-btn-single:hover { color: var(--glow); border-color: var(--glow); }

                    /* Feedback Pulse */
                    .pulse { width: 8px; height: 8px; background: #00ff00; border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px #00ff00; animation: blink-pulse 2s infinite; }
                    @keyframes blink-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                </style>
            </head>
            <body>
                <div class="universe" id="universe"></div>
                <nav class="navbar">
                    <div style="font-size: 28px; font-weight: 900; color: var(--cyan); letter-spacing: 5px;">XAVIROX</div>
                    <button style="background:none; border:1px solid var(--glow); color:var(--glow); padding:10px 25px; border-radius:15px; cursor:pointer;" onclick="window.location='/logout'">DISCONNECT</button>
                </nav>

                <div class="main-layout">
                    <div class="sidebar-menu glass-card" style="height: fit-content;">
                        <div class="nav-item active" style="color:var(--cyan); margin-bottom:15px;"><i class="fas fa-brain"></i> Neural Feed</div>
                        <div class="nav-item" style="opacity:0.6;"><i class="fas fa-fire"></i> Trending</div>
                    </div>

                    <div class="feed-container">
                        <div class="input-area glass-card" style="margin-bottom: 30px;">
                            <form action="/addpost" method="POST">
                                <textarea name="content" placeholder="${randomLine}" required></textarea>
                                <div style="display:flex; justify-content:flex-end; margin-top:15px;">
                                    <button type="submit" class="transmit-btn">TRANSMIT</button>
                                </div>
                            </form>
                        </div>
                        <div id="posts-container">${postHTML}</div>
                    </div>

                    <div class="sidebar-menu glass-card" style="height: fit-content;">
                        <h3 style="color:var(--glow); font-size:12px; letter-spacing:2px;">FEEDBACK HUB</h3>
                        <textarea id="fbContent" style="height:60px; font-size:12px; padding:10px; margin-top:10px;" placeholder="Message to creator..."></textarea>
                        <button onclick="sendFeedback()" class="transmit-btn" style="float:none; width:100%; margin-top:10px; padding:8px;">SEND SIGNAL</button>
                        <p style="font-size:10px; opacity:0.5; margin-top:15px;"><span class="pulse"></span> Neural Link Stable</p>
                    </div>
                </div>

                <script>
                    // Star Field Gen
                    const field = document.getElementById('universe');
                    for (let i = 0; i < 130; i++) {
                        const s = document.createElement('div');
                        s.className = 'star';
                        s.style.left = Math.random() * 100 + '%';
                        s.style.top = Math.random() * 100 + '%';
                        s.style.width = s.style.height = (Math.random() * 3) + 'px';
                        s.style.setProperty('--d', (Math.random() * 4 + 2) + 's');
                        field.appendChild(s);
                    }

                    async function handleVote(postId, type) {
                        const res = await fetch('/api/vote/' + postId, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type })
                        });
                        const data = await res.json();
                        if(data.success) { 
                            document.querySelector('#post-'+postId+' .v-count').innerText = data.newVotes; 
                        } else { 
                            alert(data.message); 
                        }
                    }

                    async function sendFeedback() {
                        const fb = document.getElementById('fbContent').value;
                        if(!fb) return;
                        const res = await fetch('/api/feedback', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ feedback: fb })
                        });
                        if(res.ok) { 
                            alert("Signal Transmitted!"); 
                            document.getElementById('fbContent').value = ""; 
                        }
                    }

                    function copyLink(id) {
                        navigator.clipboard.writeText(window.location.origin + '/post/' + id);
                        alert('Neural link copied!');
                    }
                </script>
            </body>
            </html>
        `);
    } catch (err) { res.status(500).send("Core Error: " + err); }
});

app.post('/addpost', async (req, res) => {
    const newPost = new Post({ content: req.body.content });
    await newPost.save();
    res.redirect('/dashboard');
});

app.get('/logout', (req, res) => res.send("<script>alert('Disconnected'); window.location='/dashboard';</script>"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 XAVIROX CORE LIVE ON PORT ${PORT}`));