import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Dialog,
    DialogContent,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    CallEnd,
    Videocam,
    VideocamOff,
    Mic,
    MicOff,
    ScreenShare,
    StopScreenShare,
} from '@mui/icons-material';
import { useVideoCall } from '../Context/VideoCallContext';
import ringer from '../../assets/Ringer.mp3';
import endCallSound from '../../assets/endCall.mp3';

const controlButtonStyle = {
    width: { xs: '48px', sm: '56px' },
    height: { xs: '48px', sm: '56px' },
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        transform: 'scale(1.1)',
    },
    '&:active': {
        transform: 'scale(0.95)',
    },
    '& .MuiSvgIcon-root': {
        fontSize: { xs: '24px', sm: '28px' }
    }
};

const VideoCallScreen = ({ remoteUser }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { localVideoRef, remoteVideoRef, setIsVideoCallActive } = useVideoCall();
    const ringerRef = useRef(new Audio(ringer));
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isSwapped, setIsSwapped] = useState(false);
    const [originalLocalStream, setOriginalLocalStream] = useState(null);

    const getPiPDimensions = () => {
        if (window.innerWidth < 600) {
            return { width: '120px', height: '150px' };
        }
        if (window.innerWidth < 960) {
            return { width: '180px', height: '220px' };
        }
        return { width: '250px', height: '300px' };
    };
    useEffect(() => {
        const ringer = ringerRef.current;
        ringer.loop = true;

        if (isConnecting) {
            const playRinger = async () => {
                try {
                    await ringer.play();
                } catch (error) {
                    console.error('Failed to play ringtone:', error);
                }
            };
            playRinger();
        } else {
            ringer.pause();
            ringer.currentTime = 0;
        }

        // Cleanup function
        return () => {
            ringer.pause();
            ringer.currentTime = 0;
        };
    }, [isConnecting]);

    useEffect(() => {
        const initializeMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setLocalStream(stream);
                setOriginalLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    await localVideoRef.current.play();
                }

                // setTimeout(() => setIsConnecting(false), 2000);
            } catch (error) {
                console.error('Media stream initialization failed:', error);
                setIsConnecting(false); 
                setIsLocalVideoLoading(false);
            }
        };

        initializeMediaStream();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const toggleCamera = useCallback(() => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
        }
    }, [localStream]);

    const toggleMicrophone = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    }, [localStream]);

    const swapStreams = () => {
        const tempLocalStream = localVideoRef.current.srcObject;
        const tempRemoteStream = remoteVideoRef.current.srcObject;

        // Swap the streams
        localVideoRef.current.srcObject = tempRemoteStream;
        remoteVideoRef.current.srcObject = tempLocalStream;

        // Always mute the video element that has your local stream
        if (isSwapped) {
            // If streams were swapped before, now local stream is back in local video
            localVideoRef.current.muted = true;
            remoteVideoRef.current.muted = false;
        } else {
            // If streams weren't swapped before, now local stream is in remote video
            localVideoRef.current.muted = false;
            remoteVideoRef.current.muted = true;
        }

        setIsSwapped(!isSwapped);
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream;
                }
                setIsScreenSharing(true);

                // Add event listener for when user stops sharing via browser controls
                screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                    stopScreenSharing();
                });
            } else {
                stopScreenSharing();
            }
        } catch (error) {
            console.error('Screen sharing error:', error);
        }
    };

    const stopScreenSharing = () => {
        if (localVideoRef.current) {
            // Stop all tracks from the screen sharing stream
            const currentStream = localVideoRef.current.srcObject;
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }

            // Restore original camera stream
            localVideoRef.current.srcObject = originalLocalStream;
        }
        setIsScreenSharing(false);
    };

    const endCall = useCallback(() => {
        const audio = new Audio(endCallSound); // Initialize the audio object
        audio.play().catch(error => {
            console.error('Error playing sound:', error); // Handle play errors
        });
        if (remoteStream) {
            remoteVideoRef.current.srcObject?.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject = null;
            setRemoteStream(null);
        }
        if (localStream) {
            localVideoRef.current.srcObject?.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
            setLocalStream(null);
        }

        setIsCameraOn(false);
        setIsMicOn(false);
        setIsScreenSharing(false);
        setIsVideoCallActive(false);
    }, [localStream, remoteStream]);

    return (
        <Dialog
            open={true}
            fullScreen
            sx={{
                '& .MuiDialog-paper': {
                    margin: 0,
                    backgroundColor: 'black'
                }
            }}
        >
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: 1, sm: 2, md: 3 },
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Main video container */}
                <Grid container sx={{ height: '100%', width: '100%', position: 'relative' }}>
                    <Grid item xs={12} sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {isConnecting ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                width: '100%',
                                height: '100%'
                            }}>
                                <CircularProgress color="primary" size={60} />
                                <Typography
                                    variant="h6"
                                    color="white"
                                    sx={{
                                        mt: 2,
                                        fontWeight: 500,
                                        textAlign: 'center'
                                    }}
                                >
                                    Connecting to {remoteUser.username}...
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
                                    objectFit: 'contain',
                                    backgroundColor: '#1a1a1a'
                                }}
                            />
                        )}
                    </Grid>
                </Grid>

                {/* Local video (PiP) */}
                <Paper
                    elevation={3}
                    onClick={swapStreams}
                    sx={{
                        position: 'absolute',
                        bottom: { xs: 80, sm: 16 },
                        right: 16,
                        ...getPiPDimensions(),
                        backgroundColor: '#1a1a1a',
                        zIndex: 20,
                        border: '2px solid rgba(255,255,255,0.2)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                            borderColor: 'rgba(255,255,255,0.4)',
                            transform: 'scale(1.02)'
                        }
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

                {/* Control panel */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: { xs: 3, sm: 4 },
                        padding: { xs: '16px', sm: '24px' },
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.7))',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <IconButton
                        color={isCameraOn ? 'primary' : 'error'}
                        onClick={toggleCamera}
                        sx={controlButtonStyle}
                    >
                        {isCameraOn ? <Videocam /> : <VideocamOff />}
                    </IconButton>

                    <IconButton
                        color={isMicOn ? 'primary' : 'error'}
                        onClick={toggleMicrophone}
                        sx={controlButtonStyle}
                    >
                        {isMicOn ? <Mic /> : <MicOff />}
                    </IconButton>

                    <IconButton
                        color={isScreenSharing ? 'primary' : 'inherit'}
                        onClick={toggleScreenShare}
                        sx={controlButtonStyle}
                    >
                        {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                    </IconButton>

                    <IconButton
                        onClick={endCall}
                        sx={{
                            ...controlButtonStyle,
                            backgroundColor: '#ff0000',
                            '&:hover': {
                                backgroundColor: '#cc0000',
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'white'
                            }
                        }}
                    >
                        <CallEnd />
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default VideoCallScreen;