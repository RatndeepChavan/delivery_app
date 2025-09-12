import { connect } from "mongoose";

import { DB_CONN_STRING } from "./env.js";


/**
 * * 📦 connectDB
 * ? Establishes a connection to MongoDB using Mongoose.
 * 
 * ! Make sure the environment variable `DB_CONN_STRING` is set.
 * 
 * ✅ On success: logs "MongoDB connected".
 * ❌ On failure: logs the error and terminates the process.
 */
export const connectDB = async (): Promise<void> => {
     // Check if DB connection string is provided in env
    if (!DB_CONN_STRING) {
        console.error("❌ MongoDB connection string is not defined.");
        process.exit(1);
    } else {
        // Try establishing connection with MongoDB
        try {
            await connect(DB_CONN_STRING);
            console.log("✅ MongoDB connected");
        } catch (err) {
            console.error("❌ MongoDB connection error:", err);
            process.exit(1);
        }
    }
};
