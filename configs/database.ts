import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Database is already connected.");
      return;
    }

    console.log("Connecting to the database...");

    const { connection } = await mongoose.connect(process.env.MONGO_URL!, { dbName: "blogs-cms" });
    console.log("Database connected successfully:", connection.name);

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};