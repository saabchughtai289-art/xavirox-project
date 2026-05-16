// api/message.js - Send Anonymous Message with AI Check & Sector Tag
import connectDB from '../lib/mongodb';
import Message from '../models/Message';
import User from '../models/User';
import { GoogleGenAI } from '@google/genai'; // Latest Gemini SDK

// Gemini AI Initialize karein (Make sure aapki .env me GEMINI_API_KEY mojood ho)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
    // Sirf POST requests allow hain message bhejne ke liye
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await connectDB();

    // 1. URL se target user ka username nikalen (e.g., /api/message?targetUsername=ali)
    const { targetUsername } = req.query; 
    const { messageContent, sector } = req.body;

    if (!targetUsername) {
        return res.status(400).json({ error: 'Target user definition missing!' });
    }

    if (!messageContent || messageContent.trim() === "") {
        return res.status(400).json({ error: 'Khaali message space me nahi bheja ja sakta!' });
    }

    try {
        // 2. Check karein ke jis ko message bhej rahe hain, woh user exist karta hai ya nahi
        const userExists = await User.findOne({ username: targetUsername.toLowerCase() });
        if (!userExists) {
            return res.status(404).json({ error: "Is planet par yeh user mojood nahi hai!" });
        }

        // 3. 🔥 GEMINI AI SECURITY GATEKEEPER 
        // AI check karega ke message safe hai ya cyberbullying hai
        const prompt = `You are a text moderation system for an anonymous messaging app. 
        Analyze the following message for extreme hate speech, severe cyberbullying, or highly inappropriate content. 
        If it is safe, reply with exactly the word "SAFE". 
        If it contains severe abuse, bullying, or hate speech, reply with exactly the word "UNSAFE".
        
        Message to analyze: "${messageContent}"`;

        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const moderationResult = aiResponse.text.trim().toUpperCase();

        // Agar AI ne unsafe bola, toh database tak baat jayegi hi nahi!
        if (moderationResult.includes("UNSAFE")) {
            return res.status(400).json({ 
                error: "Message blocked! Humari cosmic security ne isme toxic words detect kiye hain." 
            });
        }

        // 4. Message ko database me save karein (Sector filter ke sath)
        const newMessage = new Message({
            receiverId: userExists._id,
            content: messageContent.trim(),
            sector: sector || 'General' // Agar user sector select nahi karega toh 'General' chala jayega
        });

        await newMessage.save();

        return res.status(200).json({ 
            success: true, 
            message: "Ghost message sent floating into space successfully!" 
        });

    } catch (error) {
        console.error("Message send karne me error:", error);
        return res.status(500).json({ error: "Cosmic Error! Message raste me kho gaya." });
    }
}