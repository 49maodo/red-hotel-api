const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URi);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Stop the app if there's a connection error
    }
};

module.exports = connectDB;