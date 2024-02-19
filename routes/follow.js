const express = require("express")
const router = express.Router()
const User=require("../models/User")
const fetchuser = require("../Middelware/fetchuser")
const Notification = require("../models/Notification")


router.put("/follow",fetchuser,async(req,res)=>{
    try{
    let user = await User.findOne({_id:req.user._id});
    if(user.following.includes(req.body.id)){
        let result1 = await User.findByIdAndUpdate(req.body.id,{$pull:{followers:req.user._id}})
        let result2 = await User.findByIdAndUpdate(req.user._id,{$pull:{following:req.body.id}})
        res.send({result:"unfollowed"})
    }
    else{
        let result1 = await User.findByIdAndUpdate(req.body.id,{$push:{followers:req.user._id}})
        let result2 = await User.findByIdAndUpdate(req.user._id,{$push:{following:req.body.id}})
        let notification = new Notification({userId:req.body.id,sender:req.user._id,profile:req.user.profile,name:req.user.name,username:req.user.username,notification:`${req.user.username} started following you`})
        let note=await notification.save()
        res.send({result:"followed"})
    }
    }
    catch(errors){
        console.log(errors)
        return res.status(500).send({errors:"some server error appeared"})
    }
})

router.get('/getfollowers',fetchuser,async(req,res)=>{
try{
   let result= await User.find({following:req.user._id}).select("-password")
   res.send(result)
}
catch(errors){
    console.log(errors)
    return res.status(500).send({errors:"some server error appeared"})
}
})

router.get('/getfollowing',fetchuser,async(req,res)=>{
    try{
       let result= await User.find({followers:req.user._id}).select("-password")
       res.send(result)
    }
    catch(errors){
        console.log(errors)
        return res.status(500).send({errors:"some server error appeared"})
    }
    })

    // get followers of other users
    router.get('/getfollowers/:id',async(req,res)=>{
        try{
           let result= await User.find({following:req.params.id}).select("-password")
           res.send(result)
        }
        catch(errors){
            console.log(errors)
            return res.status(500).send({errors:"some server error appeared"})
        }
        })

        // get following of other users

        router.get('/getfollowing/:id',async(req,res)=>{
            try{
               let result= await User.find({followers:req.params.id}).select("-password")
               res.send(result)
            }
            catch(errors){
                console.log(errors)
                return res.status(500).send({errors:"some server error appeared"})
            }
            })
    
module.exports = router;