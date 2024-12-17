import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Dialog,
    DialogContent
} from '@mui/material';
import {
    CallEnd,
    Videocam,
    VideocamOff,
    Mic,
    MicOff,
    CameraAlt
} from '@mui/icons-material';

import { useVideoCall } from '../Context/VideoCallContext';

const VideoCallScreen = ({ remoteUser }) => {
    // Refs for video elements
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // State management
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isRemoteFocused, setIsRemoteFocused] = useState(true);

    // Request video permissions and setup local stream
    useEffect(() => {
        const getMediaPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setLocalStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play().catch(error => {
                        console.error('Error playing local video:', error);
                    });
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
                // Handle permission denial
            }
        };

        getMediaPermissions();

        // Cleanup function
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Toggle camera
    const toggleCamera = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
        }
    };

    // Toggle microphone
    const toggleMicrophone = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    // Switch video focus
    const toggleVideoFocus = () => {
        setIsRemoteFocused(!isRemoteFocused);
    };

    // End call function (placeholder)
    const shutdownMediaStream = useCallback(() => {
        if (localStream) {
            // Stop all tracks
            localStream.getTracks().forEach(track => {
                track.stop();
            });

            // Clear video source
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
            }

            // Set local stream to null
            setLocalStream(null);
            setIsCameraOn(false);
            setIsMicOn(false);
        }
    }, [localStream]);

    // End call function 
    const endCall = useCallback(() => {
        // Shutdown media stream
        shutdownMediaStream();
    }, [shutdownMediaStream]);

    return (
        <Dialog
            open={true}
            fullScreen
            sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'black'
            }}
        >
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'black',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Main Video Container */}
                <Grid
                    container
                    sx={{
                        height: '100%',
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {/* Connecting or Remote Video Area */}
                    <Grid
                        item
                        xs={12}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {isConnecting ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    width: '100%',
                                    height: '100%'
                                }}
                            >
                                <CircularProgress color="primary" />
                                <Typography variant="h6" color="white" sx={{ mt: 2 }}>
                                    Connecting...
                                </Typography>
                            </Box>
                        ) : (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                muted={false}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        )}
                    </Grid>
                </Grid>

                {/* Local Video (Picture in Picture) */}
                <Paper
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        width: '250px',
                        height: '300px',
                        backgroundColor: 'black',
                        zIndex: 20,
                        border: '2px solid white'
                    }}
                >
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </Paper>

                {/* Call Controls */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: 2,
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                >
                    <IconButton
                        color={isCameraOn ? 'primary' : 'error'}
                        onClick={toggleCamera}
                    >
                        {isCameraOn ? <Videocam /> : <VideocamOff />}
                    </IconButton>

                    <IconButton
                        color={isMicOn ? 'primary' : 'error'}
                        onClick={toggleMicrophone}
                    >
                        {isMicOn ? <Mic /> : <MicOff />}
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={endCall}
                    >
                        <CallEnd />
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default VideoCallScreen;