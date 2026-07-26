import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.DB_NAME,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database Connection Failed");

    process.exit(1);
  }
};