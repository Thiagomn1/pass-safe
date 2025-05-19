import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI!, {
      dbName: "pwmanager",
    });

    return mongoose.connection.db;
  } catch (err: unknown) {
    let errorMessage = "An unknown error occurred";

    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    } else if (typeof err === "object" && err !== null) {
      errorMessage = JSON.stringify(err);
    }
    console.error(errorMessage);
    process.exit(1);
  }
};

export default connectDB;
