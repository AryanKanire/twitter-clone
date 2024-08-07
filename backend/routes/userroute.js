const express = require("express");
const router = express.Router();
const {protectRoute} = require("../middelware/protectRoute");
const {getUserprofile , followunfollow , getSuggesteduser , updateUser} = require("../controllers/usercontroller");


router.get("/profile/:username",protectRoute,getUserprofile);
router.get("/suggested",protectRoute,getSuggesteduser);
router.post("/follow/:id",protectRoute,followunfollow);
router.post("/update",protectRoute,updateUser)

module.exports = router;