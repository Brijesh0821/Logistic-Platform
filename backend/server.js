require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user");
const shippingRoutes = require("./routes/shipping");
const bookingRoutes = require("./routes/booking");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/chat", chatRoutes);

connectDB();

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

app.get("/", (req, res) => {
  res.send("Server Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
