import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export async function connectToDB() {
  if (isConnected) return; // If already connected, no need to reconnect

  try {
    await mongoose.connect(process.env.MONGODB_URI!); // No additional options needed
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection error");
  }
}
