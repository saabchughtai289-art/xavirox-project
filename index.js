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

// Login Page
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

// Signup Page
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

// Dashboard (With Admin Inbox)
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const isOwner = user.username === 'xavi'; 
        
        let adminContent = "";
        if (isOwner) {
            adminContent = `
                <div style="margin-top:40px; border-top:1px solid #333; padding-top:20px;">
                    <h3 style="color:#ff007f;">ADMIN INBOX</h3>
                    ${user.adminMessages && user.adminMessages.length > 0 ? 
                        user.adminMessages.slice().reverse().map(m => `
                            <div style="background:rgba(255,255,255,0.05); padding:15px; margin-bottom:10px; border-left:4px solid #ff007f; border-radius:5px;">
                                <strong style="color:#00ffcc;">From: @${m.from}</strong><br>
                                <p style="margin:5px 0;">${m.text}</p>
                                <small style="color:#555;">${new Date(m.at).toLocaleString()}</small>
                            </div>
                        `).join('') : '<p style="color:#555;">No incoming transmissions.</p>'}
                </div>
            `;
        }

        res.send(`
            <body style="background:#000; color:white; font-family:'Courier New', monospace; padding:40px;">
                <div style="max-width:900px; margin:auto;">
                    <h1 style="text-shadow: 0 0 10px #ff007f;">WELCOME @${user.username.toUpperCase()}</h1>
                    <p style="color:#00ff00;">[ STATUS: ONLINE ]</p>
                    <hr style="border-color:#222;">

                    <div style="display:flex; gap:20px; flex-wrap:wrap; margin-top:20px;">
                        <div style="border:1px solid #ff007f; padding:20px; border-radius:10px; width:350px; background:rgba(255,0,127,0.02);">
                            <h3 style="margin-top:0;">COMMAND CENTER</h3>
                            <form action="/send-feedback" method="POST">
                                <textarea name="msg" placeholder="Send secure feedback to XAVI..." style="width:100%; height:80px; background:#111; border:1px solid #333; color:white; padding:5px;"></textarea><br>
                                <button type="submit" style="background:#ff007f; color:white; border:none; padding:10px; margin-top:10px; cursor:pointer; width:100%;">TRANSMIT DATA</button>
                            </form>
                        </div>

                        <div style="border:1px solid #444; padding:20px; border-radius:10px; width:300px;">
                            <h3>SYSTEM INFO</h3>
                            <p style="font-size:14px;">Authority: ${isOwner ? '<span style="color:#ff007f;">ROOT</span>' : 'Standard User'}</p>
                            <p style="font-size:14px;">Server: Vercel Node Runtime</p>
                            <p style="font-size:14px;">Support: xavirox.co@gmail.com</p>
                        </div>
                    </div>

                    ${adminContent}

                    <br><br>
                    <a href="/logout" style="color:#ff007f; text-decoration:none; font-weight:bold;">[ TERMINATE SESSION ]</a>
                </div>
            </body>
        `);
    } catch (err) {
        res.redirect('/logout');
    }
});

// --- 5. ROUTES (POST) ---

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await User.findOne({ username: username.toLowerCase() });
        if (exists) return res.send("<script>alert('Identity already exists!'); window.location='/signup';</script>");
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
        } else { res.send("<script>alert('Access Denied!'); window.location='/login';</script>"); }
    } catch(e) { res.send("Login Error: " + e.message); }
});

app.post('/send-feedback', isAuth, async (req, res) => {
    try {
        await User.findOneAndUpdate({ username: 'xavi' }, { 
            $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
        });
        res.send("<script>alert('Data Transmitted!'); window.location='/dashboard';</script>");
    } catch(e) { res.send("Transmission Failed."); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

module.exports = app;