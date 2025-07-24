import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import conversationsRoutes from './routes/conversations.js';
import usersRoutes from './routes/users.js';
import eventsRoutes from './routes/events.js';
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
    const server = app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    const io = new Server(server, {cookie:false});
    const users = {};
    const socketToRoom = {};
    io.on("connection", (socket) => {
      console.log("User connected");
      socket.on("join room",(roomId)=>{
        if(users[roomId]){
          users[roomId].push(socket.id);
        }else{
          users[roomId]=[socket.id];
        }
        socketToRoom[socket.id]=roomId;
        socket.join(roomId)
        const usersInThisRoom=users[roomId];
        socket.emit("all user",usersInThisRoom);
      });
      
    });
  })
  .catch((error) => console.error(error.message));