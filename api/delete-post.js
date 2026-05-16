// api/delete-post.js - Post Delete Karne Ka Route
import connectDB from '../lib/mongodb';
import Message from '../models/Message';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    // Sirf DELETE request allow karni hai
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await connectDB();

    try {
        // 1. Header se token nikalen check karne ke liye ke user logged in hai ya nahi
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Aap logged in nahi hain!' });
        }

        // 2. Token decode karke user ki ID nikalen
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { postId } = req.body; // Frontend se post ki ID aayegi

        if (!postId) {
            return res.status(400).json({ error: 'Post ID bhejni lazmi hai.' });
        }

        // 3. Database me post dhoonden
        const message = await Message.findById(postId);
        if (!message) {
            return res.status(404).json({ error: 'Post pehle hi delete ho chuki hai.' });
        }

        // 4. SECURITY CHECK: Kya yeh post isi user ke dashboard ki hai?
        if (message.receiverId.toString() !== decoded.userId) {
            return res.status(403).json({ error: 'Aap kisi aur ka message delete nahi kar sakte!' });
        }

        // 5. Agar check pass ho jaye, toh delete kar do
        await Message.findByIdAndDelete(postId);
        
        return res.status(200).json({ success: true, message: 'Post vaporized into cosmic dust!' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}