const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // Don't exit the process, allow retry on next request
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};

module.exports = connectDB;
