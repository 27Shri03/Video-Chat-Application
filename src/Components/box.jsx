import { Box } from "@mui/material"
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import io from 'socket.io-client'
import { useEffect, useRef, useState } from "react";
const userName = 'User' + Math.floor(Math.random() * 100000);
let didIoffer = false;

export default function Chatapp() {
    const localstream = useRef(null);
    const remotestream = useRef(null);
    const socketRef = useRef(null);
    const [Offers, SetOffers] = useState([]);

    useEffect(() => {
        // You can add the username and password also in order to authenticate your socket.io server....
        const socket = io('http://192.168.0.105:5000', {
            auth: {
                userName: userName,
            }
        });
        socketRef.current = socket;
        // Listen for available offers
        socket.on('newOfferawaiting', (offer) => {
            console.log("Newoffer!");
            SetOffers((prev) => [...prev, offer[0]]);
        });
        // socket.on('availiableOffers', (offer) => {
        //     console.log("Newoffer!");
        //     SetOffers(offer);
        // });
    }, []);

    const callNow = async () => {
        didIoffer = true;
        const socket = socketRef.current;
        const peerConnection = await CreatePeer(socket);
        socket.on('recievedIceCandidates', (iceCandidate) => {
            console.log("ice added Master side...");
            console.log(iceCandidate);
            peerConnection.addIceCandidate(iceCandidate);
        })
        try {
            //create an offer
            const offer = await peerConnection.createOffer();
            peerConnection.setLocalDescription(offer);
            // Sending the offer to the signaling server.
            await socket.emit('newOffer', offer);
            socket.on('answerResponse', (answerRes) => {
                console.log(answerRes);
                peerConnection.setRemoteDescription(answerRes.answer);
            })
            // SetOffer(false);
        } catch (error) {
            console.log(error);
        }
    }

    const answerCall = async (offerObj) => {
        const socket = socketRef.current;
        const peerConnection = await CreatePeer(socket, offerObj);
        const answer = await peerConnection.createAnswer({});
        await peerConnection.setLocalDescription(answer);
        offerObj.answer = answer;
        const OfferIcecandidates = await socket.emitWithAck('newAnswer', offerObj);
        OfferIcecandidates.forEach((c) => {
            console.log("Ice added client side");
            peerConnection.addIceCandidate(c);
        })
        // socket.on('recievedIceCandidates', (iceCandidate) => {
        //     console.log("Ice added answer side");
        //     peerConnection.addIceCandidate(iceCandidate)
        // })
        console.log(OfferIcecandidates);
    }

    async function CreatePeer(socket, answerOffer) {
        try {
            //fetch User media
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            //Link the local stream to the local video player...
            localstream.current.srcObject = stream;
            localstream.current = stream;
            // link the remote stream
            remotestream.current.srcObject = new MediaStream();
            //Create Stun servers
            const config = {
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                ],
            };
            //create a peer connection
            const peerConnection = new RTCPeerConnection(config);
            // Getting the tracks from the local stream such as audio or video traversing it and adding that track to the peerConnection...
            localstream.current.getTracks().forEach(element => {
                peerConnection.addTrack(element, localstream.current);
            });
            //Sending the ice candidates to the signaling server
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log(event.candidate);
                    socket.emit("SendingiceCandidatetoSignalingserver", {
                        iceCandidate: event.candidate,
                        iceUserName: userName,
                        DidIoffer: didIoffer,
                        Offerer: answerOffer
                    });
                }
            };
            //Check for remote stream add it to our remotestream
            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((element) => {
                    remotestream.current.srcObject.addTrack(element, remotestream);
                })
            }
            if (answerOffer) {
                await peerConnection.setRemoteDescription(answerOffer.offer);
            }
            return peerConnection;
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Box sx={{ width: "max-content", margin: "0 auto", marginTop: "1%", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "column" }}>
            <h1 style={{ fontFamily: "poppins", fontSize: "50px", color: "#003135", textDecoration: "underline", textUnderlineOffset: "10px" }}>
                Video chat application
            </h1>
            <div style={{ fontFamily: "poppins", fontSize: "50px", color: "#003135", fontWeight: "bolder" }}>
                Welcome <h3 style={{ display: "inline", color: "red" }}>{userName}</h3>
            </div>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "110%" }}>
                <video style={{ borderRadius: "5%" }} ref={localstream} autoPlay playsInline muted controls height="300px"></video>
                <video style={{ borderRadius: "5%" }} ref={remotestream} autoPlay playsInline controls height="300px"></video>
            </Box>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                marginTop={3}
            >
                <Button size="lg" variant="solid" color="success" onClick={callNow}>
                    Call
                </Button>
                <Button size="lg" variant="solid" color="danger" >
                    End Call
                </Button>
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                marginTop={3}
            >
                {console.log(Offers)}
                {Offers.length > 0 && Offers.map((o, index) => (
                    <Button key={index} size="lg" variant="solid" color="primary" onClick={() => answerCall(o)}>
                        Call from {o.offerUsername}!!
                    </Button>
                ))}
            </Stack>
        </Box>
    )
}