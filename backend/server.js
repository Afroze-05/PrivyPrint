const path = require("path");
const express = require("express"); //created a basic server
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const alertRoutes = require("./routes/alertRoutes");
const statsRoutes = require("./routes/statsRoutes");
const logsRoutes = require("./routes/logsRoutes");
const testRoutes = require("./routes/testRoutes");
const testTokenRoutes = require("./routes/testTokenRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const printRoutes = require("./routes/printRoute");


const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://privyprint-frontend.onrender.com",
    ],
    credentials: true,
  },
});
app.set("io", io);

app.use(
  //.use() is a middleware function that adds functionality to the Express app. In this case, it's adding CORS (Cross-Origin Resource Sharing) support to the server. CORS is a security feature implemented by web browsers that restricts web pages from making requests to a different domain than the one that served the web page. By using the cors middleware, you can specify which domains are allowed to access your server's resources, as well as other options like allowed headers and methods.
  cors({
    origin: [
      //origin specifies which domains are allowed to access the server's resources. In this case, it's allowing requests from localhost on ports 5173, 5174, and 5175, which are commonly used for development servers.
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://privyprint-frontend.onrender.com", // ✅ ADD THIS
    ],
    credentials: true, //ye allow karega ki client side se cookies aur authentication headers bheje ja sake, jo ki zaruri hai agar aapka server authentication ya session management use karta hai.
    allowedHeaders: ["Content-Type", "Authorization"], //json data aur authentication tokens ko bhejne ke liye zaruri headers ko specify karta hai. Content-Type header batata hai ki request body ka format kya hai (e.g., application/json), aur Authorization header authentication credentials ko carry karta hai (e.g., Bearer tokens).
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json({ limit: "2mb" })); //it allows the server to incoming JSON requests and limits the size of the request body to 2 megabytes. This is a security measure to prevent abuse by limiting the amount of data that can be sent in a single request.
app.use(express.urlencoded({ extended: true })); //when we fill a form its url will be enncoded with data ,ye form ke data ko read karta hain , it converts fom data into json format and extended means it will hadle complex data

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader("Cache-Control", "public, max-age=3600");
    next();
  },
  express.static(path.join(__dirname, "uploads")),
);

app.post("/api/direct-test", (req, res) => {
  console.log(" direct-test route called");
  res.json({ message: "Direct test works" });
});

app.post("/api/test-route", (req, res) => {
  console.log("test-route called");
  res.json({ message: "API working" });
});

app.get("/api/rate-test", (req, res) => {
  console.log("rate-test route called");
  console.log(" rate-test query:", req.query);
  res.json({ message: "Rate test working", query: req.query });
});

console.log("Registering routes...");
try {
  app.use("/api/auth", authRoutes);
  app.use("/api", documentRoutes);
  app.use("/api", alertRoutes);
  app.use("/api", statsRoutes);
  app.use("/api", logsRoutes);
  app.use("/api/test", testRoutes);
  app.use("/api/debug", testTokenRoutes);

  // app.use("/api/debug", debugRoutes);
  app.use("/api", adminRoutes);
  app.use("/api/rate", ratingRoutes);
  app.use("/api", printRoutes); // voice print — single registration here
  console.log(" All routes registered");
} catch (error) {
  console.error(" Error loading routes:", error);

}

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: "Internal server error.", error: err.message });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle user authentication
  socket.on("authenticate", async (data) => {
    try {
      const { userId, role, token } = data;

      if (!userId || !role || !token) {
        socket.emit("authentication_error", { message: "Missing authentication data" });
        return;
      }

      // Join user-specific room for data isolation
      const userRoom = `user_${userId}`;
      socket.join(userRoom);

      // Join role-based room for role-specific updates
      const roleRoom = role === "admin" ? "admin_room" : "customer_room";
      socket.join(roleRoom);

      // Store user data in socket session
      socket.userId = userId;
      socket.role = role;
      socket.userRoom = userRoom;

      console.log(`User ${userId} (${role}) authenticated and joined room: ${userRoom}`);

      socket.emit("authenticated", {
        success: true,
        userId,
        role,
        room: userRoom,
      });
    } catch (error) {
      console.error("Socket authentication error:", error);
      socket.emit("authentication_error", { message: "Authentication failed" });
    }
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    if (socket.userRoom) {
      console.log(`User ${socket.userId} left room: ${socket.userRoom}`);
    }
  });
});

// Helper function to emit events to specific users
const emitToUser = (userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data);
};

// Helper function to emit events to all users in a role
const emitToRole = (role, event, data) => {
  const room = role === "admin" ? "admin_room" : "customer_room";
  io.to(room).emit(event, data);
};

// Make emit functions available globally for controllers
global.emitToUser = emitToUser;
global.emitToRole = emitToRole;
global.io = io;

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`SecurePrint backend listening on port ${PORT}`);
    console.log(`Socket.io server running on port ${PORT}`);
  });
})();
