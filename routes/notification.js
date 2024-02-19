const express =require("express");
const fetchuser = require("../Middelware/fetchuser");
const Notification = require("../models/Notification");
const router = express.Router()

router.get("/getnotifications",fetchuser,async(req,res)=>{
    try{
        let notifications =await Notification.updateMany({$and:[{userId:req.user._id},{seen:false}]},{seen:true})
        let demo =await Notification.find({userId:req.user._id}).sort({date:-1})
        res.send(demo)
    }
    catch(errors){
        console.log(errors)
        return res.status(500).send({errors:"some server error appeared"})
    }
})

router.get("/unseen",fetchuser,async(req,res)=>{
    try{
        let result =await Notification.find({$and:[{userId:req.user._id},{seen:false}]})
        res.send(result)
    }
    catch(errors){
        console.log(errors)
        return res.status(500).send({errors:"some server error appeared"})
    }
})

module.exports = router;