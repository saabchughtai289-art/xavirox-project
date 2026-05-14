/* ====================================================================================================
    🚀 XAVIROX COSMIC OS - VERSION 40.0 [EMERGENCY BYPASS]
    REMOVED: connect-mongo (Temporary) to fix 500 Execution Error
==================================================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

// --- [DB CACHE FIX] ---
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(dbURI, { bufferCommands: false });
        isConnected = true;
        console.log("DB Linked");
    } catch (e) { console.error("DB Error", e); }
};

// --- [SCHEMAS] ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aura: { type: Number, default: 100 }
}));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
    author: String,
    content: String,
    mediaUrl: String,
    sector: { type: String, default: 'Global' },
    date: { type: Date, default: Date.now }
}));

// --- [MIDDLEWARE] ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// BYPASSING CONNECT-MONGO FOR STABILITY
app.use(session({ 
    secret: 'xavirox_secret_2026', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } 
}));

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

const upload = multer({ storage: multer.memoryStorage() });

// --- [ROUTES] ---
app.get('/dashboard', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 }).limit(20);
    const user = req.session.user || null;
    
    // UI Render (Minimal for Debugging)
    res.send(`
        <body style="background:#000; color:#00f2ff; font-family:sans-serif; padding:50px;">
            <h1>🚀 XAVIROX COSMIC OS V40</h1>
            <p>Status: <span style="color:lime">TITAN STABLE</span></p>
            <hr>
            ${user ? `<h3>Welcome, @${user.username}</h3><a href="/logout" style="color:red">LOGOUT</a>` : `<a href="/login" style="color:white">SYNC IDENTITY</a>`}
            <div style="margin-top:20px;">
                ${posts.map(p => `<div style="border:1px solid #222; padding:15px; margin-bottom:10px; border-radius:10px;"><b>@${p.author}</b>: ${p.content}</div>`).join('')}
            </div>
        </body>
    `);
});

app.get('/login', (req, res) => {
    res.send(`<body style="background:#000; color:#fff; text-align:center; padding:100px;">
        <form action="/login" method="POST">
            <input name="username" placeholder="ID" required><br><br>
            <input name="password" type="password" placeholder="KEY" required><br><br>
            <button type="submit">SYNC</button>
        </form>
    </body>`);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
        const hashed = await bcrypt.hash(password, 10);
        user = await new User({ username: username.toLowerCase(), password: hashed }).save();
    }
    if (await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else res.send("Access Denied.");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/dashboard'); });
app.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = app;