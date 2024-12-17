import React from 'react';
import { Toolbar, IconButton, Badge, Avatar, Box, Typography, Fade } from '@mui/material';
import { PersonAdd, Notifications } from '@mui/icons-material';
import { GradientAppBar } from '../styles/StyledComponents';

export const Header = ({
    userData,
    onOpenFriendRequests,
    onOpenAddFriend,
    onOpenProfileUpload
}) => (
    <GradientAppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                VEERA
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Fade in timeout={800}>
                    <IconButton color="inherit" onClick={onOpenFriendRequests}>
                        <Badge badgeContent={userData?.friendRequests?.length || 0} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                </Fade>

                <Fade in timeout={1000}>
                    <IconButton color="inherit" onClick={onOpenAddFriend}>
                        <PersonAdd />
                    </IconButton>
                </Fade>

                <Fade in timeout={1200}>
                    <IconButton onClick={onOpenProfileUpload}>
                        <Avatar
                            src={userData?.photo}
                            sx={{ width: 40, height: 40, border: '2px solid white' }}
                        >
                            {userData?.username?.[0]?.toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Fade>
            </Box>
        </Toolbar>
    </GradientAppBar>
);