
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path:'../.env'});

const connectDB = async () => {
    
   const mongoDbUrl = process.env.MONGO_DB_URL;
    try{
       await mongoose.connect(mongoDbUrl)
    }catch(error){
     console.log(`MongoDB connection failed: `,error);
     process.exit(1);
    }
}

export default connectDB;