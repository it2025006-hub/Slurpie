const express = require("express")
const router = express.Router()

const Food = require("../models/Food")
const authMiddleware = require("../middleware/authMiddleware")

/* ===============================
   ADD FOOD
================================ */

router.post("/add", authMiddleware, async (req,res)=>{

try{

const {foodName,foodType,foodCategory,quantity,itemWeight,expireDays,expireHours,price,contactNumber,pickupAddress,foodImage,latitude,longitude} = req.body

const newFood = new Food({
userId: req.user.id,
foodName,
foodType,
foodCategory,
quantity,
itemWeight,
expireDays,
expireHours,
price,
contactNumber,
pickupAddress,
foodImage,
latitude,
longitude
})

await newFood.save()

res.json({message:"Food posted successfully"})

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


/* ===============================
   GET USER'S FOODS (MY LISTINGS)
================================ */

router.get("/my", authMiddleware, async (req,res)=>{

try{

const foods = await Food.find({userId: req.user.id}).sort({createdAt:-1})

res.json(foods)

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


/* ===============================
   GET ALL FOODS
================================ */

router.get("/all", async (req,res)=>{

try{

const foods = await Food.find().sort({createdAt:-1})

res.json(foods)

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


module.exports = router
