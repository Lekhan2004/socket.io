const express = require('express')
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io")
app.use(cors());

//http server created and app is served to it
const server = http.createServer(app);
const serverPort = 1838

const io = new Server(server, {
    cors:{
        methods:["GET", "POST"],
        origin: ["http://localhost:5173","http://localhost:3000"]
    },
});

//server is open for a connecton from here nd each socket gets a unique id called as socket id
io.on("connection", (socket)=> {
    console.log(socket.id," : Socket ID")

    socket.on('join-room',(data)=>{
        socket.join(data)
        console.log(data,"room data when joined")

    })
    socket.on('send-message', (data) => {
        const { room, message } = data;
        console.log(`Message received in room ${room}: ${message}`);
        socket.to(room).emit("receive-message", message);
    });

    // socket.on('disconnect',()=>{
    //     console.log(`user with ${socket.id} disconnected`)
    // })
})

//server starts at the port serverPort
server.listen(serverPort, ()=>{
    console.log("Server Running at", serverPort);
})

