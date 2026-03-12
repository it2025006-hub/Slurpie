const express = require("express")
const router = express.Router()

const Address = require("../models/Address")
const authMiddleware = require("../middleware/authMiddleware")


/* ===============================
   SAVE ADDRESS
================================ */

router.post("/add", authMiddleware, async (req,res)=>{

try{

const {address,city,pincode,label,latitude,longitude} = req.body

const newAddress = new Address({

userId:req.user.id,
address,
city,
pincode,
label,
latitude,
longitude,
defaultAddress:false

})

await newAddress.save()

res.json({message:"Address saved successfully"})

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


/* ===============================
   GET USER ADDRESSES
================================ */

router.get("/my", authMiddleware, async (req,res)=>{

try{

const addresses = await Address.find({userId:req.user.id})

res.json(addresses)

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


/* ===============================
   DELETE ADDRESS
================================ */

router.delete("/:id", authMiddleware, async (req,res)=>{

try{

const address = await Address.findByIdAndDelete(req.params.id)

if(!address){
return res.status(404).json({message:"Address not found"})
}

res.json({message:"Address deleted successfully"})

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


/* ===============================
   SET DEFAULT ADDRESS
================================ */

router.put("/set-default/:id", authMiddleware, async (req,res)=>{

try{

/* remove previous default address */

await Address.updateMany(
{ userId:req.user.id },
{ defaultAddress:false }
)

/* set selected address as default */

const updatedAddress = await Address.findByIdAndUpdate(
req.params.id,
{ defaultAddress:true },
{ new:true }
)

if(!updatedAddress){
return res.status(404).json({message:"Address not found"})
}

res.json({
message:"Default address updated",
address:updatedAddress
})

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})


module.exports = router