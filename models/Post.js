const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    url:String,
    title:String,
    userId:String,
    description:String,
    date:{
        type:Date,
        default:Date.now
    },
    user:{
        type:Object
    },
    likes:[{type:mongoose.Schema.Types.ObjectId  ,ref:"User"}]
})

module.exports = mongoose.model("post",postSchema);