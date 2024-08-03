const express = require("express");
const authRoutes = require("./routes/authroute");
const dotenv = require("dotenv");
const connectMongodb = require("./db/connectMongoDB");

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use("/api/auth",authRoutes);

app.listen(port,()=>{
    console.log("Server is listing on 3000");
    connectMongodb();
});