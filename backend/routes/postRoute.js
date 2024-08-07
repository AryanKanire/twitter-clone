const express = require("express");
const {protectRoute} = require("../middelware/protectRoute");
const {createPost,deletePost,commentPost,likeunlikePost,allpost,getlikedposts,getFollowingposts,getUserPosts} = require("../controllers/postcontroller");

const router = express.Router();

router.get("/all",protectRoute,allpost);
router.get("/following",protectRoute,getFollowingposts);
router.get("/likes/:id",protectRoute,getlikedposts);
router.get("/user/:username",protectRoute,getUserPosts);
router.post("/create",protectRoute,createPost);
router.post("/like/:id",protectRoute,likeunlikePost);
router.post("/comment/:id",protectRoute,commentPost);
router.delete("/:id",protectRoute,deletePost);


module.exports = router;