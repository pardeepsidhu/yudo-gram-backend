const express = require("express")
const router = express.Router()
const {body, validationResult } = require("express-validator")
const User = require("../models/User")
const jwt= require("jsonwebtoken")
const jwt_secret="THISISADEMOWEBSITE"
const bcrypt = require("bcrypt")
const fetchuser = require("../Middelware/fetchuser")


// creating a new user
router.post("/register",async (req,res)=>{
   try{
    // console.log(req.body)
   let {name,username,email,password,profile,bio}=req.body
   let user = await User.findOne({email:email})
   let user2 = await User.findOne({username})
    if(user){
        return res.send({error:"user exists with same email"})
    }
    if(user2){
        return res.send({error:"username unavalible"})
    }
    let salt =await bcrypt.genSalt(10)
    secPassword =await bcrypt.hash(password,salt)
    user = new User({name,email,username,password:secPassword,bio,profile})
    user = await user.save()
    let payload ={
        user:{
            id:user._id
        }
    }
    let result = jwt.sign(payload,jwt_secret)
    res.send({token:result})
}
catch(errors){
    console.log(errors)
    return res.status(500).send({errors:"some server error appeared"})
}
})

// login existing user
router.post("/login",async(req,res)=>{
    try{
    let {email,password}=req.body
    let user = await User.findOne({email})
    if(!user){
        return res.send({result:"incorrect details"})
    }
    let passwordMatch =await bcrypt.compare(password,user.password)
    if(!passwordMatch){
        return res.send({result:"incorrect details"})
    }
    let payload ={
        user:{
            id:user._id
        }
    }
    let result = jwt.sign(payload,jwt_secret)
    res.send({token:result})
}
catch(error){
    console.log(error)
    res.status(500).send({error:"internal error"})
}
})


// profile
router.get("/profile",fetchuser,async(req,res)=>{
   try{
    res.send(req.user)
   }
   catch(error){
    console.log(error)
    res.status(500).send({error:"internal error"})
}
})

// find username
router.post("/getusername",async(req,res)=>{
    try{
    let user =await User.findOne({username:req.body.username})
    if(user){
        res.send({result:"unavalible"})
    }
    else{
        res.send({result:"avalible"})
    }
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
})

// get annomous user
router.get("/getuser/:id",async(req,res)=>{
    try{
    let user =await User.findOne({_id:req.params.id}).select("-password")
    if(user){
        res.send(user);
    }
    else{
        res.send({error:"no user found"})
    }
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
})

router.get("/search/:key",async(req,res)=>{
try{
    let result=await User.find({"$or":[{name:req.params.key},{username:req.params.key}]})
    res.send(result)
}
catch(error){
    console.log(error)
    res.status(500).send({error:"internal error"})
}
})

router.get("/users",async(req,res)=>{
    try{
        let result=await User.find()
        res.send(result)
    }
    catch(error){
        console.log(error)
        res.status(500).send({error:"internal error"})
    }
    })
module.exports= router;