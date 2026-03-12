require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");   // NEW

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/address", addressRoutes);   // NEW


/* TEST ROUTE */

app.get("/", (req,res)=>{
  res.send("Server running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log("Server started on port " + PORT);
});