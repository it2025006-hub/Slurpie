const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


/* AUTH MIDDLEWARE */

function auth(req,res,next){

const token = req.headers.authorization?.split(" ")[1];

if(!token){
return res.status(401).json({message:"No token"});
}

try{

const decoded = jwt.verify(token, process.env.JWT_SECRET);

req.userId = decoded.id;

next();

}catch(err){

return res.status(401).json({message:"Invalid token"});
}

}


/* UPDATE PROFILE (USERNAME ONLY) */

router.put("/update-profile", auth, async(req,res)=>{

try{

const {name} = req.body;

const user = await User.findById(req.userId);

if(!user){
return res.status(404).json({message:"User not found"});
}

user.name = name;

await user.save();

res.json({message:"Profile updated successfully"});

}catch(err){

console.log(err);

res.status(500).json({message:"Server error"});

}

});


/* CHANGE PASSWORD */

router.put("/change-password", auth, async(req,res)=>{

try{

const {currentPassword,newPassword} = req.body;

const user = await User.findById(req.userId);

const isMatch = await bcrypt.compare(currentPassword,user.password);

if(!isMatch){
return res.status(400).json({message:"Current password incorrect"});
}

const salt = await bcrypt.genSalt(10);

user.password = await bcrypt.hash(newPassword,salt);

await user.save();

res.json({message:"Password updated successfully"});

}catch(err){

console.log(err);

res.status(500).json({message:"Server error"});

}

});


/* UPDATE AVATAR */

router.put("/update-avatar", auth, async(req,res)=>{

try{

const {avatar} = req.body;

const user = await User.findById(req.userId);

user.avatar = avatar;

await user.save();

res.json({message:"Avatar updated successfully"});

}catch(err){

console.log(err);

res.status(500).json({message:"Server error"});

}

});


module.exports = router;