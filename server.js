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

// 4. MAIN DASHBOARD UI (Mobile Optimized)
app.get('/dashboard', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).send("<h1 style='color:white; background:#05050a; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif;'>📡 Connecting to Neural Link... Refresh in 5s</h1>");
        }

        const allPosts = await Post.find().sort({ date: -1 });
        const placeholders = ["Broadcast to the network...", "Drop a forbidden opinion...", "Type your thoughts..."];
        const randomLine = placeholders[Math.floor(Math.random() * placeholders.length)];

        let postHTML = allPosts.map(p => `
            <div class="glass-card post" id="post-${p._id}">
                <div class="post-header">
                    <div class="avatar-glow">X</div>
                    <div class="post-meta">
                        <span class="author-name">Xavirox User <i class="fas fa-check-circle bluetick"></i></span>
                        <div class="post-time">${new Date(p.date).toLocaleTimeString()}</div>
                    </div>
                </div>
                <div class="post-body">${p.content}</div>
                <div class="post-actions">
                    <div class="luxury-action-group">
                        <button class="lux-btn" onclick="handleVote('${p._id}', 'up')"><i class="fas fa-caret-up"></i> <span class="v-count">${p.votes}</span></button>
                        <div class="divider"></div>
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
                    .star { position: absolute; background: white; border-radius: 50%; animation: twinkle var(--d) infinite ease-in-out; }
                    @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 10px var(--cyan); } }
                    
                    .navbar { width: 100%; height: 65px; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,255,255,0.1); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; position: fixed; top: 0; z-index: 1000; box-sizing: border-box; }
                    .logo { font-size: 22px; font-weight: 900; color: var(--cyan); letter-spacing: 3px; }

                    .main-layout { display: grid; grid-template-columns: 280px 1fr 320px; gap: 20px; padding: 85px 20px