const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

/* ===============================
   GEMINI CHAT ROUTE
================================ */

const Food = require("../models/Food");

router.post("/ask", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Please provide a message." });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.json({ 
                reply: "⚠️ Gemini API Key is missing. Please ask the developer to add `GEMINI_API_KEY` to the `.env` file." 
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // FETCH LIVE FOOD DATA
        const availableFoods = await Food.find();
        
        let foodContext = "Currently available foods on the site:\n";
        if (availableFoods.length === 0) {
            foodContext += "- None at this time.\n";
        } else {
            availableFoods.forEach(f => {
                foodContext += `- ${f.foodName} (${f.foodType.toUpperCase()}) | Qty: ${f.quantity} | Price: ₹${f.price} | Pickup: ${f.pickupAddress}\n`;
            });
        }

        const prompt = `
You are the Slurpie Assistant, a friendly, warm, and helpful AI chatbot for a food surplus sharing platform called 'Slurpie'.
Your goal is to help users manage, find, and list leftover/surplus foods to reduce waste. Keep your answers relatively short, polite, and use emojis.

${foodContext}

User says: "${message}"
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ reply: responseText });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ reply: "Sorry, I'm having trouble connecting right now. Please try again later!" });
    }
});

module.exports = router;
