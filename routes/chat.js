const express= require("express")
const router=express.Router()
const fetchuser = require("../Middelware/fetchuser")
const Chat = require("../models/Chat")
const User = require("../models/User")

router.post("/send/:id",fetchuser,async(req,res)=>{
    try{
    let user2=await User.findOne({_id:req.params.id})
    let chat = new Chat({from:req.user._id,to:user2._id,message:req.body.message})
    let chatlist =await User.findOne({$and:[{_id:req.user._id},{chatlist:req.params.id}]})
    console.log(chatlist)
    if(!chatlist){
        chatlist =await User.updateOne({_id:req.user._id},{$push:{chatlist:req.params.id}})
        chatlist =await User.updateOne({_id:req.params.id},{$push:{chatlist:req.user._id}})
    }
    chat= await chat.save()
    res.send(chat)
    }
    catch(errors){
        console.log(errors)
        return res.status(500).send({errors:"some server error appeared"})
    }
})

router.get('/get',fetchuser,async(req,res)=>{
try{
let result= await Chat.find({"$or":[{to:req.user._id},{from:req.user._id}]}).sort({date:-1})
res.send(result)
}
catch(errors){
    console.log(errors)
    return res.status(500).send({errors:"some server error appeared"})
}
})


router.get('/get/:id',fetchuser,async(req,res)=>{
    try{
    let result= await Chat.find({$or:[{$and:[{to:req.user._id},{from:req.params.id}]},{$and:[{from:req.user._id},{to:req.params.id}]}]}).sort({date:1})
    let seen = await Chat.updateMany({$and:[{from:req.params.id},{to:req.user._id}]},{seen:true});
    res.send(result)
    }
    catch(errors){
        console.log(errors)
        return res.status(500).send({errors:"some server error appeared"})
    }
    })

    router.get('/list',fetchuser,async(req,res)=>{
        try{
        let result= await User.find({chatlist:req.user._id})
        res.send(result)
        }
        catch(errors){
            console.log(errors)
            return res.status(500).send({errors:"some server error appeared"})
        }
        })

        router.get('/unseen/:id',fetchuser,async(req,res)=>{
            try{
            let result = await Chat.find({$and:[{from:req.params.id},{to:req.user._id},{seen:false}]});
            res.send(result)
            }
            catch(errors){
                console.log(errors)
                return res.status(500).send({errors:"some server error appeared"})
            }
            })

            router.get('/unseen',fetchuser,async(req,res)=>{
                try{
                let result = await Chat.find({$and:[{to:req.user._id},{seen:false}]});
                res.send(result)
                }
                catch(errors){
                    console.log(errors)
                    return res.status(500).send({errors:"some server error appeared"})
                }
                })

                router.delete("/delete/:id",fetchuser,async(req,res)=>{
                    try{
                    let result=await Chat.deleteOne({_id:req.params.id,from:req.user._id})
                    console.log(result)
                    res.send(result)
                    }
                    catch(errors){
                        console.log(errors)
                        return res.status(500).send({errors:"some server error appeared"})
                    }
                })
module.exports=router;