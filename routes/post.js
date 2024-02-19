const express = require("express")
const router = express.Router()
const fetchuser = require("../Middelware/fetchuser")
const Post = require("../models/Post")
const User = require("../models/User")
const Notification = require("../models/Notification")

router.post("/add",fetchuser,async(req,res)=>{
try{
     let {title,description,url} = req.body;
     let post = new Post({title,description,url,user:req.user,userId:req.user._id})
     let result =await post.save()
     res.send(result)
}
catch(error){
    console.log(error)
    res.status(500).send({error:"internal error"})
}
})

router.get("/getall",async(req,res)=>{
    try{
        let result=await Post.find().sort({date:-1})
        res.send(result)
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
})

router.put("/like",fetchuser,async(req,res)=>{
    try
     {   
    let post = await Post.findOne({_id:req.body.id})
    if(post.likes.includes(req.user._id)){
        let result = await Post.findByIdAndUpdate(req.body.id,{$pull:{likes:req.user._id}})
        res.send("unliked")
    }
    else{
   let result = await Post.findByIdAndUpdate(req.body.id,{$push:{likes:req.user._id}})
   if(req.user._id !== post.userId){
   let notification = new Notification({userId:post.user._id,profile:req.user.profile,name:req.user.name,sender:req.user._id,username:req.user.username,sender:req.user._id,notification:`${req.user.username} Liked Your Video ${post.title}`})
   let note=await notification.save()
   }
   res.send("liked")
    }
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
})


router.get("/getuserpost",fetchuser,async(req,res)=>{
    try{
    let result = await Post.find({userId:req.user._id}).sort({date:-1})
    res.send(result)
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
})


router.delete("/delete",async(req,res)=>{
    try{
    let result = await Post.deleteOne({_id:req.body._id})
    res.send({result:"deleted"})
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
})

// get post of other users
router.get("/getpostbyid/:id",async(req,res)=>{
    try{
    let user = await User.findOne({_id:req.params.id}).select("-password")
    let result = await Post.find({userId:user._id}).sort({date:-1})
    res.send(result)
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
})


module.exports = router;