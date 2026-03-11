const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


/* SIGNUP */

router.post("/signup", async (req,res)=>{

  try{

    const {name,phone,email,password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
      return res.status(400).json({message:"User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
      name,
      phone,
      email,
      password:hashedPassword
    });

    await newUser.save();

    res.json({message:"User created"});

  }catch(err){
    res.status(500).json({message:"Server error"});
  }

});


/* LOGIN */

router.post("/login", async (req,res)=>{

  try{

    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const token = jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"1d"}
    );

    res.json({
      token,
      message:"Login successful"
    });

  }catch(err){
    res.status(500).json({message:"Server error"});
  }

});


/* GET CURRENT USER (NEW ROUTE ADDED) */

router.get("/me", async (req,res)=>{

  try{

    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
      return res.status(401).json({message:"No token"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);

  }catch(err){
    res.status(401).json({message:"Invalid token"});
  }

});


module.exports = router;