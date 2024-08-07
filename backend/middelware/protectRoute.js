const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");

module.exports.protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt; 
        if(!token){
            return res.status(400).json({error:"Invaild Token"});
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);   //it gives use decoded token 

        if(!decode){
            return res.status(400).json({error:"Invaild Token"});
        }

        const user = await User.findById(decode.userId).select("-password");   //in token we used userId so we use it here.
        
        if(!user){
            return res.status(400).json({error:"user not found"});
        }

        req.user = user;  //to use data of user in further process after authtication. 
        next();

    } catch (error) {
        console.log("Error in protection middelware", error.message);
        return res.status(500).json({error:"Internal Server Error"});
    }
};