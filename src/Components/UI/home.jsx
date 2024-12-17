import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '../Context/UserData.context';
import { Container, Grid, Typography, Box, Grow } from '@mui/material';
import { Group } from '@mui/icons-material';
import { Background } from '../styles/Background.jsx';
import { Header } from '../styles/Header.jsx';
import { FriendCard } from '../styles/FriendCard.jsx';
import { FriendRequestsDialog } from '../Dialogs/FriendRequestsDialog.jsx';
import { AddFriendDialog } from '../Dialogs/AddFriendDialog.jsx';
import { ProfileDialog } from '../Dialogs/ProfileDialog.jsx';
import { sendFriendRequest } from '../../Services/auth.service.js';
import Loader from '../styles/loader.jsx';
import EmptyStateMessage from '../styles/emptyStateComponent.jsx';

const Home = ({ setAlertMessage, setDisplay, setSeverity }) => {
    const { userData, islogin } = useUserData();
    const [openFriendRequests, setOpenFriendRequests] = useState(false);
    const [openAddFriend, setOpenAddFriend] = useState(false);
    const [openProfileUpload, setOpenProfileUpload] = useState(false);
    const [newFriendUsername, setNewFriendUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        islogin.current = false;
        console.log('Logging out...');
        navigate('/login');
    };

    const handlesendRequest = async () => {
        try {
            setLoading(true);
            const response = await sendFriendRequest(newFriendUsername);
            setSeverity('success');
            setAlertMessage(response.message);
            setDisplay(true);
            setOpenAddFriend(false);
            setLoading(false);
        } catch (error) {
            setSeverity('error');
            setAlertMessage(error.message);
            setDisplay(true);
            setLoading(false);
        }

    }

    return (
        <>
            <Loader display={loading} />
            <Box sx={{
                flexGrow: 1,
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Background />

                <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Header
                        userData={userData}
                        onOpenFriendRequests={() => setOpenFriendRequests(true)}
                        onOpenAddFriend={() => setOpenAddFriend(true)}
                        onOpenProfileUpload={() => setOpenProfileUpload(true)}
                    />

                    <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 4,
                                fontWeight: 600,
                                color: '#1F2937',
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: 0,
                                    width: '60px',
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #6E8EFB, #7C3AED)',
                                    borderRadius: '4px',
                                }
                            }}
                        >
                            <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Friends
                        </Typography>

                        {(!userData?.friends || userData.friends.length === 0) ? (
                            <EmptyStateMessage />
                        ) : (
                            <Grid container spacing={3}>
                                {userData.friends.map((friend, index) => (
                                    <Grow in timeout={500 + (index * 100)} key={friend.UID}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <FriendCard friend={friend} />
                                        </Grid>
                                    </Grow>
                                ))}
                            </Grid>
                        )}
                    </Container>
                </Box>

                <FriendRequestsDialog
                    open={openFriendRequests}
                    onClose={() => setOpenFriendRequests(false)}
                    requests={userData?.friendRequests}
                    setAlertMessage={setAlertMessage} setDisplay={setDisplay} setSeverity={setSeverity} setLoading={setLoading}
                />

                <AddFriendDialog
                    open={openAddFriend}
                    onClose={() => setOpenAddFriend(false)}
                    username={newFriendUsername}
                    onUsernameChange={(e) => setNewFriendUsername(e.target.value)}
                    onSubmit={handlesendRequest}
                />

                <ProfileDialog
                    open={openProfileUpload}
                    onClose={() => setOpenProfileUpload(false)}
                    userData={userData}
                    onLogout={handleLogout}
                />
            </Box>
        </>

    );
};

export default Home;