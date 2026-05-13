const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// --- 1. DATABASE CONNECTION ---
// Naya Password update kar diya gaya hai
const dbURI = "mongodb+srv://xavirox_boss:BDqrTgZZq2MFmoP3@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout fix
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
    votes: { type: Number, default: 0 },
    votedBy: [String],
    date: { type: Date, default: Date.now }
}));

// --- 3. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'xavirox_secret_key', 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false } // Vercel HTTPs ke liye baad mein true kar sakte hain
}));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- 4. ROUTES (GET) ---

// HOME ROUTE
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Login Page
app.get('/login', (req, res) => {
    res.send(`
    <body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="border:1px solid #ff007f; padding:40px; border-radius:20px; text-align:center;">
            <h2>XAVIROX LOGIN</h2>
            <form action="/login" method="POST">
                <input name="username" placeholder="Username" style="display:block; margin:10px auto; padding:10px;" required>
                <input name="password" type="password" placeholder="Password" style="display:block; margin:10px auto; padding:10px;" required>
                <button type="submit" style="background:#ff007f; color:white; border:none; padding:10px 20px; cursor:pointer;">ENTER</button>
            </form>
            <p>New? <a href="/signup" style="color:#ff007f;">Create Identity</a></p>
        </div>
    </body>`);
});

// Signup Page
app.get('/signup', (req, res) => {
    res.send(`
    <body style="background:#000; display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; color:white;">
        <div style="border:1px solid #ff007f; padding:40px; border-radius:20px; text-align:center;">
            <h2>NEW IDENTITY</h2>
            <form action="/signup" method="POST">
                <input name="username" placeholder="Choose Username" style="display:block; margin:10px auto; padding:10px;" required>
                <input name="password" type="password" placeholder="Set Password" style="display:block; margin:10px auto; padding:10px;" required>
                <button type="submit" style="background:white; color:black; border:none; padding:10px 20px; cursor:pointer; font-weight:bold;">SYNC</button>
            </form>
            <p>Already synced? <a href="/login" style="color:#ff007f;">Login</a></p>
        </div>
    </body>`);
});

// Dashboard
app.get('/dashboard', isAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.send(`
            <body style="background:#000; color:white; font-family:sans-serif; padding:50px;">
                <h1>Welcome @${user.username}</h1>
                <div style="border:1px solid #ff007f; padding:20px; border-radius:15px; width:300px;">
                    <h3>Command Center</h3>
                    <p>Support: xavirox.co@gmail.com</p>
                    <form action="/send-feedback" method="POST">
                        <textarea name="msg" placeholder="Feedback..." style="width:100%; height:80px;"></textarea><br>
                        <button type="submit" style="background:#ff007f; color:white; border:none; padding:10px 20px; margin-top:10px;">Send</button>
                    </form>
                </div>
                <br><a href="/logout" style="color:#ff007f;">Logout</a>
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
        if (exists) return res.send("<script>alert('Taken!'); window.location='/signup';</script>");
        const hashed = await bcrypt.hash(password, 10);
        await new User({ username: username.toLowerCase(), password: hashed }).save();
        res.send("<script>alert('Account Created!'); window.location='/login';</script>");
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
    await User.findOneAndUpdate({ username: 'xavi' }, { 
        $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
    });
    res.send("<script>alert('Sent!'); window.location='/dashboard';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

// --- 6. EXPORT ---
module.exports = app;