import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from '@mui/material';

export const AddFriendDialog = ({ open, onClose, username, onUsernameChange, onSubmit }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                variant="outlined"
                value={username}
                onChange={onUsernameChange}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={onSubmit}>Send Request</Button>
        </DialogActions>
    </Dialog>
);