const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cloudnary = require("cloudinary").v2;

const authRoutes = require("./routes/authroute");
const userRoutes = require("./routes/userRoute");
const postRoutes = require("./routes/postRoute");

const connectMongodb = require("./db/connectMongoDB");

dotenv.config();

cloudnary.config({
    cloud_name : process.env.CLOUDNARY_CLOUD_NAME,
    api_key : process.env.CLOUDNARY_API_KEY,
    api_secret : process.env.CLOUDNARY_API_SECRECT
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); //to parse req.body
app.use(express.urlencoded({extended:true})); //to parse data from urlencoded

app.use(cookieParser()); //it is used to parse cookie token

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/post",postRoutes);


app.listen(port,()=>{
    console.log("Server is listing on 3000");
    connectMongodb();
});