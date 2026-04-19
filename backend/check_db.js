const mongoose = require("mongoose");
const Log = require("./models/Log");
const Document = require("./models/Document");

// Check database connection
mongoose
  .connect("mongodb://localhost:27017/privyprint")
  .then(async () => {
    console.log(
      "Connected to https://chatgpt.com/c/69dc98f2-dcdc-83e8-9303-7bda131181faMongoDB",
    );

    // Check total documents
    const totalDocs = await Document.countDocuments();
    console.log("Total documents:", totalDocs);

    // Check total logs
    const totalLogs = await Log.countDocuments();
    console.log("Total print logs:", totalLogs);

    // Check completed documents
    const completedDocs = await Document.countDocuments({
      status: "completed",
    });
    console.log("Completed documents:", completedDocs);

    // Get recent logs
    const recentLogs = await Log.find().sort({ time: -1 }).limit(5);
    console.log("Recent logs:", recentLogs.length);
    recentLogs.forEach((log) => {
      console.log(
        `  - ${log.time}: token=${log.token}, type=${log.printType}, price=${log.price}`,
      );
    });

    // Get recent documents
    const recentDocs = await Document.find().sort({ createdAt: -1 }).limit(5);
    console.log("Recent documents:", recentDocs.length);
    recentDocs.forEach((doc) => {
      console.log(
        `  - ${doc.createdAt}: token=${doc.token}, status=${doc.status}, type=${doc.type}, price=${doc.price}`,
      );
    });

    process.exit(0);
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
