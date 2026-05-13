const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// --- 1. DATABASE CONNECTION ---
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 5000 
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB Connection Error: ", err));

// --- 2. MODELS ---
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, lowercase: true },
    password: { type: String },
    portfolioUrl: { type: String, default: 'https://xavirox.com' },
    adminMessages: [{ from: String, text: String, at: { type: Date, default: Date.now } }]
}));

const Post = mongoose.model('Post', new mongoose.Schema({
    author: String,
    content: String,
    date: { type: Date, default: Date.now }
}));

// --- 3. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'xavirox_secret_key', 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- 4. ROUTES (GET) ---

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(`
    <body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="border:1px solid #ff007f; padding:40px; border-radius:20px; text-align:center; box-shadow: 0 0 15px #ff007f;">
            <h2 style="letter-spacing:3px;">XAVIROX LOGIN</h2>
            <form action="/login" method="POST">
                <input name="username" placeholder="Username" style="display:block; margin:10px auto; padding:10px; background:#111; border:1px solid #444; color:white;" required>
                <input name="password" type="password" placeholder="Password" style="display:block; margin:10px auto; padding:10px; background:#111; border:1px solid #444; color:white;" required>
                <button type="submit" style="background:#ff007f; color:white; border:none; padding:10px 20px; cursor:pointer; font-weight:bold; width:100%;">ACCESS SYSTEM</button>
            </form>
            <p style="font-size:12px; margin-top:15px;">New Identity? <a href="/signup" style="color:#ff007f; text-decoration:none;">Create Here</a></p>
        </div>
    </body>`);
});

app.get('/signup', (req, res) => {
    res.send(`
    <body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="border:1px solid #00ffcc; padding:40px; border-radius:20px; text-align:center; box-shadow: 0 0 15px #00ffcc;">
            <h2 style="letter-spacing:3px; color:#00ffcc;">REGISTER</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Username" style="display:block; margin:10px auto; padding:10px; background:#111; border:1px solid #444; color:white;" required>
                <input name="password" type="password" placeholder="Password" style="display:block; margin:10px auto; padding:10px; background:#111; border:1px solid #444; color:white;" required>
                <button type="submit" style="background:#00ffcc; color:black; border:none; padding:10px 20px; cursor:pointer; font-weight:bold; width:100%;">SYNC DATA</button>
            </form>
            <p style="font-size:12px; margin-top:15px;"><a href="/login" style="color:#00ffcc; text-decoration:none;">Return to Login</a></p>
        </div>
    </body>`);
});

// Dashboard (Posts + Inbox)
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const posts = await Post.find().sort({ date: -1 });
        const isOwner = user.username === 'xavi'; 
        
        let adminContent = "";
        if (isOwner) {
            adminContent = `
                <div style="margin-top:40px; border-top:2px solid #ff007f; padding-top:20px;">
                    <h3 style="color:#ff007f;">[ ADMIN INBOX ]</h3>
                    ${user.adminMessages && user.adminMessages.length > 0 ? 
                        user.adminMessages.slice().reverse().map(m => `
                            <div style="background:#111; padding:15px; margin-bottom:10px; border-left:4px solid #ff007f;">
                                <strong style="color:#00ffcc;">From: @${m.from}</strong><br>
                                <p>${m.text}</p>
                            </div>
                        `).join('') : '<p style="color:#555;">No transmissions.</p>'}
                </div>`;
        }

        const postsHTML = posts.map(p => `
            <div style="border:1px solid #333; padding:15px; margin-bottom:15px; border-radius:10px; background:#0a0a0a;">
                <strong style="color:#00ffcc;">@${p.author}</strong> 
                <small style="color:#555; float:right;">${new Date(p.date).toLocaleTimeString()}</small>
                <p style="margin:10px 0;">${p.content}</p>
            </div>
        `).join('');

        res.send(`
            <body style="background:#000; color:white; font-family:'Courier New', monospace; padding:40px;">
                <div style="max-width:900px; margin:auto;">
                    <h1 style="text-shadow: 0 0 10px #ff007f;">XAVIROX CORE @${user.username.toUpperCase()}</h1>
                    
                    <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:40px;">
                        <div style="border:1px solid #00ffcc; padding:20px; border-radius:10px; flex:1; min-width:300px; background:rgba(0,255,204,0.02);">
                            <h3 style="color:#00ffcc; margin-top:0;">BROADCAST</h3>
                            <form action="/post" method="POST">
                                <textarea name="content" placeholder="Broadcast to community..." style="width:100%; height:60px; background:#111; border:1px solid #333; color:white; padding:10px;" required></textarea>
                                <button type="submit" style="background:#00ffcc; color:black; border:none; padding:10px 20px; margin-top:10px; cursor:pointer; font-weight:bold;">SEND</button>
                            </form>
                        </div>

                        <div style="border:1px solid #ff007f; padding:20px; border-radius:10px; width:300px;">
                            <h3 style="color:#ff007f; margin-top:0;">CONTACT ADMIN</h3>
                            <form action="/send-feedback" method="POST">
                                <input name="msg" placeholder="Secure message..." style="width:100%; background:#111; border:1px solid #333; color:white; padding:8px;">
                                <button type="submit" style="background:#ff007f; color:white; border:none; padding:8px; margin-top:10px; cursor:pointer; width:100%;">TRANSMIT</button>
                            </form>
                        </div>
                    </div>

                    <h3 style="border-bottom:1px solid #333; padding-bottom:10px; color:#00ffcc;">COMMUNITY FEED</h3>
                    <div style="margin-top:20px;">
                        ${postsHTML || '<p style="color:#555;">No posts yet.</p>'}
                    </div>

                    ${adminContent}

                    <br><br>
                    <a href="/logout" style="color:#ff007f; text-decoration:none;">[ TERMINATE SESSION ]</a>
                </div>
            </body>
        `);
    } catch (err) { res.redirect('/logout'); }
});

// --- 5. ROUTES (POST) ---

app.post('/post', isAuth, async (req, res) => {
    try {
        await new Post({ author: req.session.user.username, content: req.body.content }).save();
        res.redirect('/dashboard');
    } catch(e) { res.send("Post Failed."); }
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await User.findOne({ username: username.toLowerCase() });
        if (exists) return res.send("<script>alert('Taken!'); window.location='/signup';</script>");
        const hashed = await bcrypt.hash(password, 10);
        await new User({ username: username.toLowerCase(), password: hashed }).save();
        res.send("<script>alert('Sync Complete!'); window.location='/login';</script>");
    } catch(e) { res.send("DB Error: " + e.message); }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username.toLowerCase() });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            res.redirect('/dashboard');
        } else { res.send("<script>alert('Invalid!'); window.location='/login';</script>"); }
    } catch(e) { res.send("Login Error: " + e.message); }
});

app.post('/send-feedback', isAuth, async (req, res) => {
    try {
        await User.findOneAndUpdate({ username: 'xavi' }, { 
            $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
        });
        res.send("<script>alert('Sent!'); window.location='/dashboard';</script>");
    } catch(e) { res.send("Failed."); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

module.exports = app;