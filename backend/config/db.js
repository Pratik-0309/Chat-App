import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGODB_URI}/SnapTalk`)
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((error) => {
        console.log("Error:", error);
        process.exit(1);
      });
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
};

export default connectDB;
