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

const ConnectedSockets = [
    // UserName , socketid
]

let ConfirmationMaster = false;
let ConfirmationClient = false;

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
        let OffertoUpdate = Offers.find(s => s.offerUsername === offerObj.offerUsername);
        ackFunction(OffertoUpdate.offerIceCandidates);
        OffertoUpdate.answer = offerObj.answer;
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
        if (frontendUsername === offer.offerUsername) {
            console.log(`Sending from : ${offer.offerUsername} to : ${offer.answerUsername}` );
            socket.to(SendsocketClient[0].socketId).emit('userLeft', { frontendUsername, socketId: SendsocketMaster[0].socketId });
        }
        else {
            console.log(`Sending from : ${offer.answerUsername} to : ${offer.offerUsername}` );
            socket.to(SendsocketMaster[0].socketId).emit('userLeft', { frontendUsername, socketId: SendsocketClient[0].socketId });
        }
        console.log("hang up in server completed...");

    });
    socket.on('terminateConnection', (data) => {
        console.log("Termination process started....");
        socket.to(data.socketId).emit('EndConnection');
        console.log("Termination process Ended....");
    })


})