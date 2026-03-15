const mongoose = require("mongoose")

const FoodSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

foodName:{
type:String,
required:true
},

foodType:{
type:String,
required:true
},

foodCategory:{
type:String,
required:true
},

quantity:{
type:String,
required:true
},

itemWeight:{
type:String,
required:true
},

expireDays:{
type:Number,
default:0
},

expireHours:{
type:Number,
default:0
},

price:{
type:String,
required:true
},

contactNumber:{
type:String,
required:true
},

pickupAddress:{
type:String,
required:true
},

foodImage:{
type:String
},

latitude:{
type:Number
},

longitude:{
type:Number
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Food", FoodSchema)
