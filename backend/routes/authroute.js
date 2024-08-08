const express = require("express");
const router = express.Router();

const {protectRoute} = require("../middelware/protectRoute");
const { signup, login, logout,  getMe } = require("../controllers/authcontroller");

router.get("/me",protectRoute, getMe);

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

module.exports = router;