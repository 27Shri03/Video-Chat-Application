const express = require('express');
require('dotenv').config();
const cors = require('cors'); // Import the cors package
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const URL = process.env.VITE_FRONTEND_URL;
const io = socketio(server, {
    cors: {
        origin: [URL],
        methods: ["GET", "POST"]
    }
});

// Use cors middleware
app.use(cors());

server.listen(PORT);
// Create an offer Array 

let Offers = [
    /* 
    OfferUsername
    offer
    OfferIcecandidates
    AnswerUsername
    Answer
    AnswerIceCandidates
    */
]

let ConnectedSockets = [
    // UserName , socketid
]

io.on('connection', (socket) => {
    const Username = socket.handshake.auth.userName;
    ConnectedSockets.push({
        socketId: socket.id,
        Username
    })
    if (Offers.length) {
        let newOffers = Offers.filter((o) => o.transmit !== false);
        socket.emit('availiableOffers', newOffers);
    }
    socket.on('disconnect', () => {
        console.log("Socket just disconnected....");
        const disconnectedSocketid = socket.id;
        const disconnectedSocket = ConnectedSockets.find((c) => c.socketId === disconnectedSocketid);
        ConnectedSockets = ConnectedSockets.filter((c) => c !== disconnectedSocket);
        console.log(disconnectedSocket.Username);
        Offers = Offers.filter((o) => o.offerUsername !== disconnectedSocket.Username && o.answerUsername !== disconnectedSocket.Username);
        console.log(Offers);
        const temp = Offers.filter((o) => o.transmit !== false);
        io.emit('availiableOffers',temp);
    })

    socket.on('newOffer', (newOffer) => {
        Offers.push({
            offerUsername: Username,
            offer: newOffer,
            offerIceCandidates: [],
            answerUsername: null,
            answer: null,
            answerIceCandidates: [],
            transmit: true
        })
        socket.broadcast.emit('newOfferawaiting', Offers.slice(-1));
    })

    socket.on('newAnswer', (offerObj, ackFunction) => {
        const OffererSocket = ConnectedSockets.find((s) => s.Username === offerObj.offerUsername);
        let temp = Offers.filter((o) => o.offerUsername !== offerObj.offerUsername && o.transmit !== false);
        socket.broadcast.emit('availiableOffers', temp);
        const OffererId = OffererSocket.socketId;
        let OffertoUpdate = Offers.find(s => s.offerUsername === offerObj.offerUsername);
        ackFunction(OffertoUpdate.offerIceCandidates);
        OffertoUpdate.answer = offerObj.answer;
        OffertoUpdate.transmit = false;
        OffertoUpdate.answerUsername = offerObj.answerUsername;
        socket.to(OffererId).emit('answerResponse', OffertoUpdate);
    })

    socket.on('SendingiceCandidatetoSignalingserver', (IceCandidate) => {
        const { iceCandidate, DidIoffer, iceUserName, Offerer } = IceCandidate;
        if (DidIoffer) {
            const offerer = Offers.find(s => s.offerUsername === iceUserName);
            // if(!offerer){
            //     return;
            // }
            offerer.offerIceCandidates.push(iceCandidate);
            if (offerer.answerUsername) {
                console.log("tranfeering some iCCCee");
                const answerSocket = ConnectedSockets.find(s => s.Username === offerer.answerUsername);
                socket.to(answerSocket.socketId).emit('recievedIceCandidates', iceCandidate);
            }
            else {
                console.log("Call haven't pickup up yet");
            }
        }
        else {
            const answerer = Offers.find(s => s.offerUsername === Offerer.offerUsername);
            answerer.answerIceCandidates.push(iceCandidate);
            console.log(answerer.offerUsername);
            if (answerer) {
                console.log("answerer is here..");
                const offerer = ConnectedSockets.find(s => s.Username === answerer.offerUsername);
                if (offerer) {
                    console.log("some iceeeeetoooo");
                    socket.to(offerer.socketId).emit('recievedIceCandidates', iceCandidate);
                }
                else {
                    console.log("Error in sending the Ice Candidates to the Offerer");
                }
            }
            else {
                console.log("No answerer found!!!");
            }
        }
    })

    socket.on('hangUp', async (frontendUsername) => {
        console.log("hang up processsing in server....");
        console.log("Username : ", frontendUsername);
        // console.log(Offers);
        const offer = Offers.find(o => o.offerUsername === frontendUsername || o.answerUsername === frontendUsername);
        // console.log(offer);
        const SendsocketMaster = ConnectedSockets.filter(s => s.Username === offer.offerUsername);
        const SendsocketClient = ConnectedSockets.filter(s => s.Username === offer.answerUsername);
        console.log("SendSocketClient", SendsocketClient);
        console.log("SendSocketMaster", SendsocketMaster);
        Offers = Offers.filter((o) => o !== offer);
        console.log(Offers);
        if (frontendUsername === offer.offerUsername) {
            console.log(`Sending from : ${offer.offerUsername} to : ${offer.answerUsername}`);
            socket.to(SendsocketClient[0].socketId).emit('userLeft', { frontendUsername, socketId: SendsocketMaster[0].socketId, offer });
        }
        else {
            console.log(`Sending from : ${offer.answerUsername} to : ${offer.offerUsername}`);
            socket.to(SendsocketMaster[0].socketId).emit('userLeft', { frontendUsername, socketId: SendsocketClient[0].socketId, offer });
        }
        console.log("hang up in server completed...");
    });
    socket.on('terminateConnection', (data) => {
        console.log("Termination process started....");
        socket.to(data.socketId).emit('EndConnection', data);
        console.log("Termination process Ended....");
    })
})