const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        // If local mongodb isn't available and we're testing without env, use memory server
        if (process.env.USE_IN_MEMORY_DB === 'true') {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            console.log("USING IN-MEMORY MONGODB FOR TESTING");
        }

        if (!uri) throw new Error("No MONGODB_URI provided in .env");

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.log('Will attempt to retry in 5 seconds to prevent fatal crash if desired...');
        // process.exit(1); -> Graceful fallback requirement: Do not exit immediately if you want graceful failure
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;
