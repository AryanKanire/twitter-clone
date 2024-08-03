const mongoose = require("mongoose");

const connectMongodb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected ${conn.connection.host}`)
    }catch(err){
        console.log("Error connecting mongodb",err);
        process.emit(1);
    }
}

module.exports = connectMongodb;