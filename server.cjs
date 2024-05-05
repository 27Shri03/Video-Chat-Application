const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: ["http://localhost:5173",
        ],
        methods: ["GET", "POST"]
    }
});
server.listen(5000);
// Create an offer Array 

const Offers = [
    /* 
    OfferUsername
    offer
    OfferIcecandidates
    AnswerUsername
    Answer
    AnswerIceCandidates
    */
]

const ConnectedSockets = [
    // UserName , socketid
]

io.on('connection', (socket) => {
    const Username = socket.handshake.auth.userName;
    ConnectedSockets.push({
        socketId : socket.id,
        Username
    })
    // if(Offers.length){
    //     socket.emit('availiableOffers' , Offers);
    // }
    socket.on('newOffer' , (newOffer)=>{
        Offers.push({
            offerUsername : Username,
            offer : newOffer,
            offerIceCandidates : [],
            answerUsername : null,
            answer : null ,
            answerIceCandidates : []
        })
        socket.broadcast.emit('newOfferawaiting' , Offers.slice(-1));
    })
})

