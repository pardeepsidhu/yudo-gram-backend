const mongoose = require("mongoose")

const notificationSchema=new mongoose.Schema({
    userId:String,
    username:String,
    name:String,
    notification:String,
    profile:String,
    sender:String,
    seen:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("notification",notificationSchema)