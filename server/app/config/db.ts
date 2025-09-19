import mongoose from "mongoose";
import dbName from "./constants";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URL! + "/" + dbName
    );
    console.log(`Connected to MongoDB: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
