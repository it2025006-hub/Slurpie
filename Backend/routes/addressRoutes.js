const express = require("express")
const router = express.Router()

const Address = require("../models/Address")
const authMiddleware = require("../middleware/authMiddleware")


/* SAVE ADDRESS */

router.post("/add", authMiddleware, async (req,res)=>{

try{

const {address,city,pincode,label,latitude,longitude} = req.body

const newAddress = new Address({

userId:req.user.id,
address,
city,
pincode,
label,
latitude,      // NEW
longitude      // NEW

})

await newAddress.save()

res.json({message:"Address saved successfully"})

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})



/* GET USER ADDRESSES */

router.get("/my", authMiddleware, async (req,res)=>{

try{

const addresses = await Address.find({userId:req.user.id})

res.json(addresses)

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


module.exports = router