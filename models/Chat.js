const mongoose =require("mongoose")
const chatSchema = new mongoose.Schema({
    to:String,
    from:String,
    date:{
        type:Date,
        default:Date.now
    },
    seen:{
        type:Boolean,
        default:false
    },
    message:String
})

module.exports = mongoose.model("chat",chatSchema)