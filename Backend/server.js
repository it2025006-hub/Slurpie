require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const foodRoutes = require("./routes/foodRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/chat", chatRoutes);


/* TEST ROUTE */

app.get("/", (req,res)=>{
  res.send("Server running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log("Server started on port " + PORT);
});