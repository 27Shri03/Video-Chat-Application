import React from 'react';
import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { VideocamOutlined } from '@mui/icons-material';
import { FriendCard as StyledFriendCard, StyledBadge } from './StyledComponents';
import { createOffer } from '../../Services/WebRtc.service.js';
import { useUserData } from '../Context/UserData.context.jsx';
import { useVideoCall } from '../Context/VideoCallContext.jsx';

export const FriendCard = ({ friend }) => {
    const { userData } = useUserData();
    const { setIsVideoCallActive, setRemoteUser } = useVideoCall();

    const handleVideoCall = async () => {
        try {
            // Set remote user for video call
            setRemoteUser(friend);

            // Create WebRTC offer
            // await createOffer(friend, userData);

            // Activate video call screen
            setIsVideoCallActive(true);
        } catch (error) {
            console.error('Video call initiation failed:', error);
        }
    };

    return (
        <StyledFriendCard elevation={0}>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar src={friend.photo} sx={{ width: 48, height: 48 }}>
                    {friend.username[0].toUpperCase()}
                </Avatar>
            </StyledBadge>

            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {friend.username}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                        component="span"
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            display: 'inline-block'
                        }}
                    />
                    Online
                </Typography>
            </Box>

            <IconButton
                className="video-icon"
                sx={{
                    color: '#6B7280',
                    transition: 'all 0.2s ease'
                }}
                onClick={handleVideoCall}
            >
                <VideocamOutlined />
            </IconButton>
        </StyledFriendCard>
    );
}