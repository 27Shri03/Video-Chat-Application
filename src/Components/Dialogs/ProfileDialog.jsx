import React from 'react';
import {
    DialogTitle,
    DialogContent,
    Box,
    Avatar,
    Typography
} from '@mui/material';
import { Upload, LogoutOutlined } from '@mui/icons-material';
import { ProfileDialog as StyledProfileDialog, ProfileButton } from '../styles/StyledComponents.jsx';

export const ProfileDialog = ({ open, onClose, userData, onLogout }) => (
    <StyledProfileDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
        }}>
            Profile Settings
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                mb: 3
            }}>
                <Avatar
                    src={userData?.photo}
                    sx={{
                        width: 120,
                        height: 120,
                        border: '4px solid',
                        borderColor: 'primary.main',
                    }}
                >
                    {userData?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {userData?.username}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ProfileButton
                    variant="text"
                    component="label"
                    startIcon={<Upload sx={{ color: '#6B7280' }} />}
                >
                    Update Profile Photo
                    <input type="file" hidden accept="image/*" />
                </ProfileButton>

                <ProfileButton
                    variant="text"
                    onClick={onLogout}
                    startIcon={<LogoutOutlined sx={{ color: '#EF4444' }} />}
                    sx={{
                        color: '#EF4444',
                        '&:hover': {
                            backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        }
                    }}
                >
                    Logout
                </ProfileButton>
            </Box>
        </DialogContent>
    </StyledProfileDialog>
);
