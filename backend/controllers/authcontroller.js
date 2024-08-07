const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const {generateTokenAndSetcookie} = require("../lib/utils/generateToken")

module.exports.signup = async(req,res)=>{
    try{
        const {fullName,username,email,password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invild email format"});
        }
        const existinguser = await User.findOne({username});
        if(existinguser){
            return res.status(400).json({error:"User already taken"});
        }
        const existingemail = await User.findOne({email});
        if(existingemail){
            return res.status(400).json({error:"Email already taken"});
        }

        if(password.length < 6){
            return res.status(400).json({error:"Password must not small than 6 charater"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password,salt);

        const newuser = new User({
            fullName,
            username,
            password:hashpassword,
            email,
        })

        if(newuser){
            generateTokenAndSetcookie(newuser._id,res);
            await newuser.save();
            res.status(201).json({
                _id:newuser._id,
                fullName:newuser.fullName,
                username:newuser.username,
                email:newuser.email,
                following:newuser.following,
                followers:newuser.followers,
                profileImg:newuser.profileImg,
                coverImg:newuser.coverImg,
            });
        }
        else{
            
            res.status(400).json({error:"Invaild data"});
        }

    } catch(err){
        console.log("Error in signup controller",err.message);
        res.status(500).json({error:"Internal Error"});
    }
}

module.exports.login = async(req,res)=>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordcorrect = await bcrypt.compare(password,user?.password || "");
        
        if(!user || !isPasswordcorrect){
            return res.status(400).json({error:"wrong password or username"});
        }

        generateTokenAndSetcookie(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            following:user.following,
            followers:user.followers,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
        });


    } catch(err){
        console.log("Error in login controller",err.message);
        res.status(500).json({error:"Internal Error"});
    }
}

module.exports.logout = async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out succefully"})
    } catch(err){
        console.log("Error in logout controller",err.message);
        res.status(500).json({error:"Internal Error"});
    }
}

module.exports.getMe = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch(err){
        console.log("Error in getme controller",err.message);
        res.status(500).json({error:"Internal Error"});
    }
}