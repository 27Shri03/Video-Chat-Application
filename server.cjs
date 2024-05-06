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
        socketId: socket.id,
        Username
    })
    // if(Offers.length){
    //     socket.emit('availiableOffers' , Offers);
    // }
    socket.on('newOffer', (newOffer) => {
        Offers.push({
            offerUsername: Username,
            offer: newOffer,
            offerIceCandidates: [],
            answerUsername: null,
            answer: null,
            answerIceCandidates: []
        })
        socket.broadcast.emit('newOfferawaiting', Offers.slice(-1));
    })

    socket.on('newAnswer', (offerObj, ackFunction) => {
        const OffererSocket = ConnectedSockets.find((s) => s.Username === offerObj.offerUsername);
        const OffererId = OffererSocket.socketId;
        const OffertoUpdate = Offers.find(s => s.offerUsername === offerObj.offerUsername);
        ackFunction(OffertoUpdate.offerIceCandidates);
        OffertoUpdate.answer = offerObj.answer;
        OffertoUpdate.answerUsername = offerObj.Username;
        socket.to(OffererId).emit('answerResponse', OffertoUpdate);
    })

    socket.on('SendingiceCandidatetoSignalingserver', (IceCandidate) => {
        const { iceCandidate, DidIoffer, iceUserName , Offerer } = IceCandidate;
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
            else{
                console.log("No answerer found!!!");
            }
        }
    })
})