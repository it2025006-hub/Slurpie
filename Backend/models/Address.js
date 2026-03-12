const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

address:{
type:String
},

city:{
type:String
},

pincode:{
type:String
},

label:{
type:String
},

latitude:{           // ADD THIS
type:Number
},

longitude:{          // ADD THIS
type:Number
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Address", AddressSchema)