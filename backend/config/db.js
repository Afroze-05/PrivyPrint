const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(" Connecting to Database...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Database Connected: ${conn.connection.host}`); //tells about the cluster , localhost
  } catch (error) {
    console.error("Database Error:", error.message);
    process.exit(1); //server la band karnar
  }
};

module.exports = connectDB;
