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
        origin: "http://localhost:3000"
    },
});

//server is open for a connecton from here nd each socket gets a unique id called as socket id
io.on("connection", (socket)=> {
    console.log(socket.id," : Socket ID")
})

//server starts at the port serverPort
server.listen(serverPort, ()=>{
    console.log("Server Running at", serverPort);
})

