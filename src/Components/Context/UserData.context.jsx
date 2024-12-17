// userData.context.jsx
import React, { createContext, useContext, useState, useRef } from 'react';

const UserDataContext = createContext(null);
export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
    const islogin = useRef(false);
    const [userData, setUserData] = useState(() => {
        const storedUserData = localStorage.getItem('userData');
        return storedUserData ? JSON.parse(storedUserData) : null;
    });

    function setLocalStorageData() {
        localStorage.setItem('userData', userData);
    }
    const updateUserData = (data) => {
        islogin.current = true;
        setUserData(data);
        localStorage.setItem('userData', JSON.stringify(data));
    };

    const addFriend = (data) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            friends: [...prevUserData.friends, data],
            friendRequests: prevUserData.friendRequests.filter(
                (request) => request.user.username !== data.username
            )
        }));
        setLocalStorageData();
    }

    const removeFriendRequest = (username) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            friendRequests: prevUserData.friendRequests.filter(
                (request) => request.user.username !== username
            )
        }));
        setLocalStorageData();
    };

    const addFriendRequest = (request) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            friendRequests: [...prevUserData.friendRequests, request]
        }));
        setLocalStorageData();
    }

    return (
        <UserDataContext.Provider value={{ userData, updateUserData, islogin, addFriend, removeFriendRequest, addFriendRequest }}>
            {children}
        </UserDataContext.Provider>
    );
};
