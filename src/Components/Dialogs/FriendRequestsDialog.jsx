import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Box,
    IconButton
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { acceptFriendRequest, rejectFriendRequest } from '../../Services/auth.service.js';
import { useUserData } from '../Context/UserData.context.jsx';

export const FriendRequestsDialog = ({ open, onClose, requests, setAlertMessage, setDisplay, setSeverity, setLoading }) => {
    const { addFriend, removeFriendRequest } = useUserData();
    const handleAcceptRequest = async (username) => {
        try {
            setLoading(true);
            const response = await acceptFriendRequest(username, addFriend);
            setAlertMessage(response.message);
            setSeverity('success');
            setDisplay(true);
            setLoading(false);

        } catch (error) {
            setAlertMessage(error.message);
            setSeverity('error');
            setDisplay(true);
            setLoading(false);
        }
    }
    const handleRejectRequest = async (username) => {
        try {
            setLoading(true);
            const response = await rejectFriendRequest(username, removeFriendRequest);
            setAlertMessage(response.message);
            setSeverity('success');
            setDisplay(true);
            setLoading(false);
        } catch (error) {
            setAlertMessage(error.message);
            setSeverity('error');
            setDisplay(true);
            setLoading(false);
        }

    }
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Friend Requests</DialogTitle>
            <DialogContent>
                <List>
                    {requests?.map((request, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <Box>
                                    <IconButton onClick={() => handleAcceptRequest(request.user.username)} color="success">
                                        <Check />
                                    </IconButton>
                                    <IconButton onClick={() => handleRejectRequest(request.user.username)} color="error">
                                        <Close />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={request.user.photo}>
                                    {request.user.username[0].toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={request.user.username}
                                secondary={new Date(request.createdAt).toLocaleDateString()}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};
