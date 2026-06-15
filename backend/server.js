require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user");
const shippingRoutes = require("./routes/shipping");
const bookingRoutes = require("./routes/booking");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chatRoutes");
const analyticsRoutes = require("./routes/analytics");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: "8mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-booking", (bookingId) => {
    socket.join(bookingId);
  });

  socket.on("send-location", ({ bookingId, lat, lng }) => {
    io.to(bookingId).emit("receive-location", { lat, lng });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "running",
    mongoConnected: connectDB.state.connected,
    mongoError: connectDB.state.connected ? null : connectDB.state.lastError,
    authStorage: connectDB.state.connected ? "mongo" : "local",
  });
});

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === "GET" && req.accepts("html") && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(frontendDist, "index.html"));
    }
    return next();
  });
} else {
  app.get("/", (_req, res) => res.send("Server Running"));
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.warn("MongoDB is unavailable. Auth will use local dev storage until MongoDB reconnects.");
  }

  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();
