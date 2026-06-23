import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";
import { app } from "../src/app.js";

const connectDB = async() => {
    try { 
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n✅ MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
        app.on("error", (error) => {
            console.log(`ERROR while making connection instance!!! :: ${error}`);
        })
    } catch (error) {
        console.error("Error connect to DATABASE :: ", error);
        process.exit(1)
    }
}

export default connectDB;