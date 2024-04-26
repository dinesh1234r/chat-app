const express=require("express")
const mongoose=require("mongoose")
const app=express()
const cors=require("cors")
const userEntry=require('./routes/userEntry')
const socket=require('socket.io')
const {Server}=require('socket.io')
const http=require('http')
require('dotenv').config();
const url = process.env.USER_DB;

mongoose.connect(url)

const con=mongoose.connection

app.use(express.json())
app.use(cors())

con.on("open",()=>{
    console.log("DB connected")
})

app.use('/',userEntry)


const server = app.listen(9000, () =>
  console.log(`Server started on ${9000}`)
);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
