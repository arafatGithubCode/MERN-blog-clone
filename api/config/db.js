import mongoose from "mongoose";

import config from "./config.js";

const dbUrl = config.db.url;

const connectDB = async () => {
  try {
    mongoose.connect(dbUrl);
    console.log("MONGO is connected!");
  } catch (error) {
    console.log("MONGO is not connected!");
    console.log(error.message);
    process.exit(1);
  }
};
export default connectDB;
