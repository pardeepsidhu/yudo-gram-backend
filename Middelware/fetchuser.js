
const jwt= require("jsonwebtoken")
const jwt_secret="THISISADEMOWEBSITE"
const User = require("../models/User")

const fetchuser =async(req,res,next)=>{
    let token = req.header('auth-token')
    if(!token){
        return res.send("auth token not received")
    }
    try{
        let user = jwt.verify(token,jwt_secret)
        req.user= await User.findById(user.user.id).select("-password")
        next()
    }
    catch(errors){
        return res.status(500).send({errors:errors})
    }
}

module.exports = fetchuser;