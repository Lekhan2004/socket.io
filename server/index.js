const express = require('express');
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(express.json());

// Ports
const serverPort = 1838;
const expressPort = 5000;

// Create HTTP and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

// MongoDB URL and connection
const url = "mongodb+srv://luckylekhan25:lekhan123@cluster0.12tcr9y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Set up MongoDB connection
mongoClient.connect(url)
    .then(client => {
        const chatdb = client.db('chatdb');
        const userscollection = chatdb.collection('userscollection');
        
        // Make the collection available in the app
        app.set('userscollection', userscollection);
        console.log("Connected to MongoDB Atlas");
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    });

// Set up user-related routes
const usersApp = require('./APIs/users');
app.use('/users-api', usersApp);

app.get('/', (req, res) => {
    res.send('Hello from the REST API');
});

// Express Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).send({ message: "error", payload: err });
});

// Start REST API server
app.listen(expressPort, () => {
    console.log(`REST API server running at http://localhost:${expressPort}\n`);
});

// Socket.IO connection and event handling
io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on('send-message', (data) => {
        const { room, message } = data;
        console.log(`Message in room ${room}: ${message}`);
        socket.to(room).emit("receive-message", message);
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
});

// Start Socket.IO server
server.listen(serverPort, () => {
    console.log(`Socket.IO server running at http://localhost:${serverPort}`);
});
