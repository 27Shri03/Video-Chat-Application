import { Box } from "@mui/material"
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import io from 'socket.io-client'
import { useEffect, useRef, useState } from "react";
const userName = 'User' + Math.floor(Math.random() * 100000);
let didIoffer = false;
let peerConnection = null;

export default function Chatapp() {
    let localstream = useRef(null);
    let remotestream = useRef(null);
    const socketRef = useRef(null);
    const [Offers, SetOffers] = useState([]);

    useEffect(() => {
        // You can add the username and password also in order to authenticate your socket.io server....
        const socket = io('http://192.168.0.103:5000', {
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
        socket.on('userLeft', (data) => {
            console.log("UserLeft");
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            remotestream.current.srcObject.getTracks().forEach(track => track.stop());
            remotestream.current.srcObject = null;
            localstream.current.srcObject.getTracks().forEach(track => track.stop());

            localstream.current.srcObject = null;


            socket.emit('terminateConnection', data);
        })
        socket.on('EndConnection', () => {
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            remotestream.current.srcObject.getTracks().forEach(track => track.stop());
            remotestream.current.srcObject = null;
            localstream.current.srcObject.getTracks().forEach(track => track.stop());
            localstream.current.srcObject = null;
            console.log("connectionClosed");
        })
    }, []);

    const disconnectCall = () => {
        const socket = socketRef.current;
        console.log("Request for disconnection...", socket.id);
        socket.emit('hangUp', userName);
    }

    const callNow = async () => {
        // As the offerer we are going to set the didIoffer as true..
        didIoffer = true;
        const socket = socketRef.current;
        await CreatePeer(socket);
        // We are going to set the ice candidates for the Master through this event listener...
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
        } catch (error) {
            console.log(error);
        }
    }

    const answerCall = async (offerObj) => {
        didIoffer = false;
        const socket = socketRef.current;
        await CreatePeer(socket, offerObj);
        const answer = await peerConnection.createAnswer({});
        await peerConnection.setLocalDescription(answer);
        offerObj.answer = answer;
        offerObj.answerUsername = userName;
        const OfferIcecandidates = await socket.emitWithAck('newAnswer', offerObj);
        OfferIcecandidates.forEach((c) => {
            console.log("Ice added client side");
            peerConnection.addIceCandidate(c);
        })
        console.log(OfferIcecandidates);
    }

    async function CreatePeer(socket, answerOffer) {
        try {
            //fetch User media
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            //Link the local stream to the local video player...
            localstream.current.srcObject = stream;
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
            let peer = new RTCPeerConnection(config);
            // Getting the tracks from the local stream such as audio or video traversing it and adding that track to the peerConnection...
            stream.getTracks().forEach(element => {
                peer.addTrack(element, stream);
            });
            //Sending the ice candidates to the signaling server
            peer.onicecandidate = (event) => {
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
            peer.ontrack = (event) => {
                event.streams[0].getTracks().forEach((element) => {
                    remotestream.current.srcObject.addTrack(element, remotestream);
                })
            }
            if (answerOffer) {
                /*
                This if statement is when a call is being answered
                On the client side we are going to set it's remoteDescription from the OfferObject recieved when answer button is pressed.  
                 */
                await peer.setRemoteDescription(answerOffer.offer);
            }
            peerConnection = peer;
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
                <video style={{ borderRadius: "5%" }} ref={localstream} autoPlay playsInline controls height="300px"></video>
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
                <Button size="lg" variant="solid" color="danger" onClick={disconnectCall}>
                    End Call
                </Button>
            </Stack>
            <Stack
                direction="column"
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