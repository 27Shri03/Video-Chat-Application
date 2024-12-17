import React, { createContext, useContext, useState } from 'react';

const VideoCallContext = createContext();

export const useVideoCall = () => useContext(VideoCallContext);

export default function VideoCallProvider({ children, value }) {
    return (
        <VideoCallContext.Provider value={value}>
            {children}
        </VideoCallContext.Provider>
    );
}