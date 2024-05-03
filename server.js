const fs = require('fs');
const express = require('express');
const https = require('https');
app = express();
const socketio = require('socket.io');

const key = fs.readFileSync('cert.key');
const cert = fs.readFileSync('cert.crt');

const expressServer = https.createServer({key,cert} , app);

const io = socketio(expressServer , {
    cors:{
        origin : ["http://localhost:5173",
            "https://192.168.0.102",
        ],
        methods: ["GET","POST"]
    }
});
expressServer.listen(5000);

io.on('connection',()=>{
    console.log("connected to socket.io successfully");
})