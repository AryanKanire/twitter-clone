const express = require("express");
const router = express.Router();

const {protectRoute} = require("../middelware/protectRoute");
const {getNotification , deleteNotification} = require("../controllers/getNotification");

router.get("/",protectRoute,getNotification);
router.delete("/delete",protectRoute,deleteNotification);

module.exports = router;