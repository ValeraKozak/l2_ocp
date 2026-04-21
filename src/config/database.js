import mongoose from "mongoose";

const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bicycle_store_lab2";

export async function connectDatabase() {
  await mongoose.connect(connectionString);
  console.log(`MongoDB connected: ${connectionString}`);
}
