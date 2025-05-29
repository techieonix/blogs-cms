import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/blogs-cms",
      {
        dbName: "blogs-cms",
      }
    );
    console.log("Database connected successfully:", connection.name);
    console.log("Database host:", connection.host);
    
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
