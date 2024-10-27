import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connectInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error: ", error.message);
    process.exit(1);
  }
};
