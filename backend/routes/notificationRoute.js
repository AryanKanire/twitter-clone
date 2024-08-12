const express = require("express");
const router = express.Router();

const {protectRoute} = require("../middelware/protectRoute");
const {getNotification , deleteNotification , deleteonenoti} = require("../controllers/getNotification");

router.get("/",protectRoute,getNotification);
router.delete("/delete",protectRoute,deleteNotification);
// router.delete("/delete/:id",protectRoute,deleteonenoti);

module.exports = router;