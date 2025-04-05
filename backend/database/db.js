import mongoose from "mongoose";
import { defaultAdmin } from "../controllers/adminControllers.js";

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            dbName : "farm",
        });

        console.log("connected")
        await defaultAdmin();

    }catch(error){
        console.log(error)
    }
};

export default connectDb;


