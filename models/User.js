const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
email:{
    type:String,
    required:true
},
username:String,
password:String,
bio:{
    type:String,
    default:"Hello There I Am Using Yudo Chat"
},
name:String,
privete:{
    type:Boolean,
    default:false
},
profile:String,
followers:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
following:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
chatlist:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
})

module.exports = mongoose.model('user',userSchema)