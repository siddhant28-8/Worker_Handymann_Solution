// db.js
const mongoose = require("mongoose");

let isConnected=false;

const connectDB = async () => {
    if(isConnected){
        return; //reuse existing connection as vercel uses make many instances
    }

    if(!process.env.MONGODB_URI){
        throw new Error("Missing MongoDB connection string (MONGODB_URI)");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB Connected ");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err; // Exit the process if database connection fails
    }
};

module.exports = connectDB;

