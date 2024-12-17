async function createPeer(didIoffer, socket, localStream, remoteStream, userData, peerConnection, answerOffer) {
    try {
        // Implement GUM function
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current.srcObject = stream;
        remoteStream.current.srcObject = new MediaStream();
        const config = {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
            ],
        };
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
                    iceUserID: userData.userId,
                    DidIoffer: didIoffer,
                });
            }
        };
        //Check for remote stream add it to our remotestream
        peer.ontrack = (event) => {
            event.streams[0].getTracks().forEach((element) => {
                remoteStream.current.srcObject.addTrack(element, remoteStream);
            })
        }
        if (answerOffer) {
            /*
            This if statement is when a call is being answered
            On the client side we are going to set it's remoteDescription from the OfferObject recieved when answer button is pressed.  
             */
            console.log("Inside answer Offer : ", answerOffer);
            await peer.setRemoteDescription(answerOffer.offer);
        }
        peerConnection.current = peer;
    } catch (error) {
        console.log("Error in createPeer : ", error.message);
    }
}

export const createOffer = async (friend, userData, didIoffer, peerConnection, socketRef, localStream, remoteStream) => {
    try {
        const socket = socketRef.current;
        let offer = {
            offerUsername: userData.username,
            offerUserId: userData.userId,
            offer: null,
            offerIceCandidates: [],
            answerUsername: friend.username,
            answerUserId: friend.UID,
            answer: null,
            answerIceCandidates: []
        }
        // I have pressed the callNow button so yes I am offering
        didIoffer.current = true;
        await createPeer(didIoffer, socket, localStream, remoteStream, userData, peerConnection);
        socket.on('receivedIceCandidates', (iceCandidate) => {
            console.log("ice added Creater side...");
            console.log(iceCandidate);
            peerConnection.current.addIceCandidate(iceCandidate);
        })
        const finalOffer = await peerConnection.current.createOffer();
        peerConnection.current.setLocalDescription(finalOffer);
        offer.offer = finalOffer;
        socket.emit('newOffer', offer);
        socket.on('answerResponse', (answerRes) => {
            console.log(answerRes);
            peerConnection.current.setRemoteDescription(answerRes.answer);
        })
    } catch (error) {
        console.log("error in createOffer : ", error.message);
    }
}

export const answerCall = async (offerObj, didIoffer, socketRef, peerConnection) => {
    didIoffer = false;
    const socket = socketRef.current;
    await createPeer(socket, offerObj);
    const answer = await peerConnection.current.createAnswer({});
    await peerConnection.current.setLocalDescription(answer);
    offerObj.answer = answer;
    const OfferIcecandidates = await socket.emitWithAck('newAnswer', offerObj);
    OfferIcecandidates.forEach((c) => {
        console.log("Ice added acceptor side");
        peerConnection.current.addIceCandidate(c);
    })
}

export const joinCall = async()=>{

}

export const endCall = async()=>{
    
}