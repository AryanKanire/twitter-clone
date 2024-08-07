const bcrypt = require("bcryptjs");
const cloudnary = require("cloudinary").v2;

const Notification = require("../models/notificationmodel");
const User = require("../models/usermodel");

module.exports.getUserprofile = async(req,res)=>{
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");

        if(!user) return res.status(404).json({error:"user not found"});

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error:"Internal error"});
        console.log("error in getuserprofile", error.message);
    }
}

module.exports.followunfollow = async(req,res)=>{
    try {
        const {id} = req.params;
        
        const userTomodify = await User.findById(id);
        const currUser = await User.findById(req.user._id);

        if(id == req.user._id.toString()){
            return res.status(400).json({error:"you can't follow youself"});
        }

        if(!userTomodify || !currUser) return res.status(400).json({error:"user not found"});

        const isfollowing = currUser.following.includes(id);

        if(isfollowing){
            await User.findByIdAndUpdate(id,{$pull:{followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following: id}});
            res.status(200).json({message:"User unfollow succefuly"})
        }
        else{
            await User.findByIdAndUpdate(id,{$push:{followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following: id}});

            const newNotification = new Notification({
                type:"follow",
                from:req.user._id,
                to:userTomodify._id,
            })

            await newNotification.save();

            res.status(200).json({message:"User follow succefuly"})
        }
        
    } catch (error) {
        res.status(500).json({error:"Internal error"});
        console.log("erro in getuserprofile", error.message);
    }
}

module.exports.getSuggesteduser = async(req,res)=>{
    try {
        const userId = req.user._id;
        const userFollowedByme = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne:userId}
                }
            },
            {$sample:{size:10}},
        ])

        const filteredUser = users.filter(user=>!userFollowedByme.following.includes(user._id));
        const suggestedUser = filteredUser.slice(0,4);

        suggestedUser.forEach(user=>user.password=null);

        res.status(200).json(suggestedUser);

    } catch (error) {
        res.status(500).json({error:"Internal error"});
        console.log("erro in getSuggesteduser", error.message);
    }   
}

module.exports.updateUser = async(req,res)=>{
    const {username,fullName,email,currPassword,newPassword,bio,link} = req.body;
    let {profileImg , coverImg} = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"User not found"});

        if((!newPassword && currPassword) || (!currPassword && newPassword)){
            return res.status(404).json({error:"Please provide both curr and new password"});
        }

        if(currPassword && newPassword){
            const isMatch = await bcrypt.compare(currPassword,user.password);
            if(!isMatch)  {
                return res.status(404).json({error:"Incorrect PAssword"});
            }

            if(newPassword.length <6)  {
                return res.status(400).json({error:"password lenght must br greater than 6"});
            }

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(newPassword,salt);

        }

        if(profileImg){
            if(user.profileImg){
                await cloudnary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedresponse = await cloudnary.uploader.upload(profileImg);
            profileImg = uploadedresponse.secure_url;
        }

        if(coverImg){
            if(user.coverImg){
                await cloudnary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            const uploadedresponse = await cloudnary.uploader.upload(coverImg);
            coverImg = uploadedresponse.secure_url;
        }
        
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password=null;  // it will not update becase we are not saving it;

        return res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error:"Internal error"});
        console.log("error in updateuser", error.message);
    }
}