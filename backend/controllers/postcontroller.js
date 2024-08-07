const Notification = require("../models/notificationmodel");
const Post = require("../models/postmodel");
const User = require("../models/usermodel");
const cloudinary = require("cloudinary").v2;

module.exports.createPost = async(req, res)=>{
    try {
        console.log('Request Body:', req.body);
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"user not found"});

        if(!text && !img){
            return res.status(404).json({error:"Text or img is required"});
        }

        if(img){
            const uploadedresponse = await cloudinary.uploader.upload(img);
            img = uploadedresponse.secure_url;
        }

        const newPost = new Post({
            user:userId,
            text,
            img,
        })

        await newPost.save();
        res.status(200).json(newPost);

    } catch (error) {
        res.status(500).json({error:error.message});
        console.log(error)
    }
}

module.exports.deletePost = async(req,res)=>{
    try {
        const post = await  Post.findById(req.params.id);  //we use /:id so we use only id

        if(!post) return res.status(400).json({error:"post not found"});

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"you are not authorized to delete podt"});
        }

        if(post.img){
            const imgId =post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"deleteed succefuly"});

    } catch (error) {
        console.log("error in delete postcontroll",error);
        res.status(500).json({error:"Internal error"});
    }
}

module.exports.commentPost = async(req,res)=>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const user = req.user._id;

        if(!text) return res.status(400).json({error:"comment not found"});
        
        const post = await Post.findById(postId);

        if(!post) return res.status(400).json({error:"post not found"});
        
        const comment = {text,user};

        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);

    } catch (error) {
        console.log("Error in commentcontroller",error);
        res.status(500).json({error:"Internal error"});
    }
}

module.exports.likeunlikePost = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {id:postId} = req.params;

        const post = await Post.findById(postId);

        if(!post) return res.status(400).json({error:"Post Not found"});

        const userLikepost = await post.likes.includes(userId);
        
        if(userLikepost){
            await Post.findByIdAndUpdate(postId,{$pull:{likes: userId}});
            await User.findByIdAndUpdate(userId,{$pull:{likePosts:postId}});
            res.status(200).json({message:"unlike the post"});
        }
        else{
            post.likes.push(userId);
            await User.findByIdAndUpdate(userId,{$push:{likePosts:postId}});
            await post.save();

            const notification = new Notification({
                from:userId,
                to:post.user,
                type:"like",
            })
            await notification.save();
            
            res.status(200).json({message:"liked the post"});
        }

    } catch (error) {
        console.log("error in likecontroller ",error);
        res.status(500).json({error:"Intenal error"});
    }
}

module.exports.allpost = async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password",
        }).populate({
            path:"comments.user",
            select:"-password",
        });

        if(posts.length===0){
            res.status(200).json([])
        }

        res.status(200).json(posts);

    } catch (error) {
        console.log("error in all post controller",error);
        res.status(200).json({error:"internal error"});
    }
}

module.exports.getlikedposts = async (req,res)=>{
    const userId = req.params.id;
    
    try {
        const user = await User.findById(userId);
        
        if(!user) return res.status(400).json({error:"USer not found"});

        const likedpost = await Post.find({_id: {$in: user.likePosts}})
        .populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password",
        })

        res.status(200).json(likedpost);

    } catch (error) {
        console.log("error in all likedpost controller",error);
        res.status(200).json({error:"internal error"});
    }
}

module.exports.getFollowingposts = async(req,res)=>{
    try {
        const userId=req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"User not found"});

        const following = user.following;

        const feedpost = await Post.find({user: {$in: following}})
        .sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password",
        });

        res.status(200).json(feedpost);

    } catch (error) {
        console.log("Error in getfollowingposts",error);
        res.status(500).json({error:"Internal error"});
        
    }
}

module.exports.getUserPosts = async (req,res)=>{
    
    try {
        const {username} = req.params;
        
        const user = await User.findOne({username});

        if(!user) return res.json({error:"User not found"});

        const posts = await Post.find({user: user._id}).sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password",
        });

        res.status(200).json(posts);
        
    } catch (error) {
        console.log("Error in getuserpost",error);
        res.status(500).json({error:"internal error"});
    }
}