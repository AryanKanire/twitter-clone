const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cloudnary = require("cloudinary").v2;
const path = require("path");

const authRoutes = require("./routes/authroute");
const userRoutes = require(path.resolve(__dirname, './routes/userRoute'));
const postRoutes = require("./routes/postRoute");
const notificationRoute = require("./routes/notificationRoute");

const connectMongodb = require("./db/connectMongoDB");

dotenv.config();

cloudnary.config({
    cloud_name : process.env.CLOUDNARY_CLOUD_NAME,
    api_key : process.env.CLOUDNARY_API_KEY,
    api_secret : process.env.CLOUDNARY_API_SECRECT
});

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({limit:"1000kb"})); //to parse req.body
app.use(express.urlencoded({extended:true})); //to parse data from urlencoded

app.use(cookieParser()); //it is used to parse cookie token

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/post",postRoutes);
app.use("/api/notification",notificationRoute);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../frontend/dist","index.html"))
    })
}


app.listen(port,()=>{
    console.log("Server is listing on 5000");
    connectMongodb();
});