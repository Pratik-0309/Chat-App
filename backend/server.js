import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// store online users
export const userSocketMap = {}; // {userId: socketId}

// socket.io connection Handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("New User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected clients
  io.emit("get-online-users", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("get-online-users", Object.keys(userSocketMap));
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173, https://chat-app-nine-zeta-45.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

connectDB();

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

// Export server for vercel
export default server;
