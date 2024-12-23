import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import io from 'socket.io-client';
import { useUserData } from './UserData.context';

export const SocketContext = createContext(null);
export const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const { userData, addFriendRequest, addFriend } = useUserData();
    const socketRef = useRef(null);
    const [Offer, setOffer] = useState(null);


    useEffect(() => {
        // const newSocket = io(`https://redchat.azurewebsites.net?userId=${userData.userId}&username=${userData.username}`);
        const newSocket = io(`http://localhost:8080?userId=${userData.userId}&username=${userData.username}`);
        socketRef.current = newSocket;
        newSocket.on('connect', () => {
            console.log('Connected to socket server');

        });
        newSocket.on('success', (data) => {
            console.log(`Success LOG : ${data.message}`);
        })

        newSocket.on('error', (data) => {
            console.log(`Error LOG : ${data.message}`);
        })

        newSocket.on('receiveFriendRequest', (data) => {
            console.log("FriendRequestReceived");
            addFriendRequest(data);
        })

        newSocket.on('acceptedFriendRequest', (data) => {
            console.log("requestacceptedbyFriend");
            addFriend(data);
        })

        newSocket.on('incomingCall', (offer) => {
            setOffer(offer);
            console.log("OfferCame : ", offer);
        })

        // newSocket.on('answerResponse' , (data)=>{


        // })

        return () => {
            console.log("disconnected from Socket");
            newSocket.disconnect();
        };
    }, []);

    const sendData = (newData) => {
        socket.emit('update', newData);
    };

    return (
        <SocketContext.Provider value={{ sendData, Offer, socketRef}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;