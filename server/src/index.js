import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import conversationsRoutes from "./routes/conversations.js";
import usersRoutes from "./routes/users.js";
import eventsRoutes from "./routes/events.js";
import Server from "socket.io";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello to Teams Clone API");
});
app.use("/auth", authRoutes);
app.use("/conversations", conversationsRoutes);
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    const server = app.listen(PORT, () =>
      console.log(`Server running on port: ${PORT}`)
    );
    const io = new Server(server, { cookie: false });
    const users = {};
    const socketToRoom = {};
    io.on("connection", (socket) => {
      console.log("User connected");
      socket.on("join room", (roomId) => {
        if (users[roomId]) {
          users[roomId].push(socket.id);
        } else {
          users[roomId] = [socket.id];
        }
        socketToRoom[socket.id] = roomId;
        socket.join(roomId);
        const usersInThisRoom = users[roomId].filter((id) => id !== socket.id);
        socket.emit("all user", usersInThisRoom);
      });

      socket.on("playVideo", () => {
        socket.broadcast.to(socketToRoom[socket.id]).emit("playVideo");
      });
      socket.on("pauseVideo", () => {
        socket.broadcast.to(socketToRoom[socket.id]).emit("pauseVideo");
      });

      socket.on("stopVideo", () => {
        socket.broadcast.to(socketToRoom[socket.id]).emit("stopVideo");
      });

      socket.on("chat message", (finalMessage) => {
        socket.broadcast
          .to(socketToRoom[socket.id])
          .emit("chat message", finalMessage);
      });

      socket.on("mouse", (data) => {
        socket.broadcast.to(socketToRoom[socket.id]).emit("mouse", data);
      });

      socket.on("erase", () => {
        socket.broadcast.to(socketToRoom[socket.id]).emit("erase");
      });

      socket.on("disconnect", () => {
        const roomId = socketToRoom[socket.id];
        let usersInThisRoom = users[roomId];
        if (usersInThisRoom) {
          usersInThisRoom = usersInThisRoom.filter(
            (users) => users.id !== socket.id
          );
          users[roomId] = usersInThisRoom;
        }
        socket.broadcast.emit("user left", socket.id);
      });
    });
  })
  .catch((error) => console.error(error.message));
