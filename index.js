const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// --- 1. DATABASE CONNECTION ---
const dbURI = "mongodb+srv://xavirox_boss:noESvAPXb6tGrvqi@cluster0.myxiyfk.mongodb.net/xavirox_db?retryWrites=true&w=majority";
mongoose.connect(dbURI).then(() => console.log("Connected to MongoDB"));

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
app.use(session({ secret: 'xavirox_secret_key', resave: false, saveUninitialized: true }));

const isAuth = (req, res, next) => req.session.user ? next() : res.redirect('/login');

// --- 4. ROUTES ---

// Dashboard (Aapka poora UI yahan hai)
app.get('/dashboard', isAuth, async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    const user = await User.findById(req.session.user._id);
    const isOwner = user.username === 'xavi';

    // Kal wala Full UI HTML yahan paste hoga (Gmail aur Feedback box ke sath)
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>XAVIROX CORE</title></head>
        <body style="background:#000; color:white; font-family:sans-serif; padding:50px;">
            <h1>Welcome @${user.username}</h1>
            <p>XAVIROX Control Center is Online.</p>
            <div style="border:1px solid #ff007f; padding:20px; border-radius:15px; width:300px;">
                <h3>Command Center</h3>
                <p>Queries: xavirox.co@gmail.com</p>
                <form action="/send-feedback" method="POST">
                    <textarea name="msg" placeholder="Feedback..."></textarea>
                    <button type="submit">Send</button>
                </form>
            </div>
            <br><a href="/logout" style="color:#ff007f;">Logout</a>
        </body>
        </html>
    `);
});

// Signup Route (Fixed)
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await User.findOne({ username: username.toLowerCase() });
        if (exists) return res.send("<script>alert('Username already taken!'); window.location='/signup';</script>");
        
        const hashed = await bcrypt.hash(password, 10);
        await new User({ username: username.toLowerCase(), password: hashed }).save();
        res.send("<script>alert('Account Created! Now Login.'); window.location='/login';</script>");
    } catch(e) { res.send("Error: " + e.message); }
});

// Login Route
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else { res.send("<script>alert('Invalid Login!'); window.location='/login';</script>"); }
});

// Feedback Route
app.post('/send-feedback', isAuth, async (req, res) => {
    await User.findOneAndUpdate({ username: 'xavi' }, { 
        $push: { adminMessages: { from: req.session.user.username, text: req.body.msg } } 
    });
    res.send("<script>alert('Feedback Sent!'); window.location='/dashboard';</script>");
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

// --- 5. EXPORT FOR VERCEL ---
module.exports = app;
app.listen(3000);