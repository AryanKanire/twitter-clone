const Notification = require("../models/notificationmodel");

module.exports.getNotification = async (req,res)=>{
    try {
        const userId = req.user._id;

        const notification = await Notification.find({to:userId})
        .populate({
            path:"from",
            select:"username profileImg"
        })

        await Notification.updateMany({to:userId},{read:true});

        res.status(200).json(notification);
    } catch (error) {
        console.log("error in notification route",error);
        res.status(500).json({error:"Intrnal error"});
    }
}

module.exports.deleteNotification = async (req,res)=>{
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to:userId});

        res.status(200).json({message:"Notification delete"});
    } catch (error) {
        console.log("error in delete route",error);
        res.status(500).json({error:"Intrnal error"});
    }
}