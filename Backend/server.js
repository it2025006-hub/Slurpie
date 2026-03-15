require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Import your existing routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// 1. Connect to MongoDB 
connectDB();

app.use(cors());
app.use(express.json());

// 2. Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. AI Chat Route
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are the Slurpie Assistant for a surplus food app in West Bengal. Help users donate or find food. Keep it friendly and concise." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'm ready to help the Slurpie community reduce food waste. 🍞" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ reply: "Sorry, I'm having trouble thinking right now. 🍞" });
  }
});

// 4. Existing Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Slurpie Server is running and connected to MongoDB.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port"+ PORT);
});