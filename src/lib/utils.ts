const mongoose = require("mongoose");

const connection = { isConnected: false };

export const cloudinary = require("cloudinary").v2;

export const connectToDb = async () => {
  try {
    if (connection.isConnected) {
      console.log("Using the existing connection");
      return;
    }

    await mongoose.connect(process.env.MONGO);

    connection.isConnected = mongoose.connection.readyState;
  } catch (error) {
    console.log(error);
    throw new Error("There is a new error");
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
