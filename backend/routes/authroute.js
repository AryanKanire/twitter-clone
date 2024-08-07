const express = require("express");
const { signup, login, logout,  getMe } = require("../controllers/authcontroller");
const router = express.Router();
const {protectRoute} = require("../middelware/protectRoute")

router.get("/me",protectRoute, getMe);

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

module.exports = router;