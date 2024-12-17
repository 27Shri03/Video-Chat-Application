import React, { useState } from 'react';
import { useUserData } from '../Context/UserData.context';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Container,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Box,
  Fade,
  Grow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PersonAdd,
  Notifications,
  VideocamOutlined,
  Check,
  Close,
  Upload,
  Group,
  LogoutOutlined
} from '@mui/icons-material';

// Custom styled components
const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6E8EFB 0%, #7C3AED 100%)',
  boxShadow: 'none',
}));

const FriendCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)',
    '& .video-icon': {
      color: '#7C3AED',
      transform: 'scale(1.1)',
    }
  }
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const BackgroundCircle = styled('div')(({ size, color, top, left, blur }) => ({
  position: 'fixed',
  width: size,
  height: size,
  borderRadius: '50%',
  background: color,
  filter: `blur(${blur}px)`,
  opacity: 0.4,
  top,
  left,
  zIndex: 0,
}));

const ProfileDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(2),
  }
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  textTransform: 'none',
  gap: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
  }
}));
import { useNavigate } from 'react-router';

const Home = () => {
  const { userData , islogin } = useUserData();
  const [openFriendRequests, setOpenFriendRequests] = useState(false);
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [openProfileUpload, setOpenProfileUpload] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    islogin.current = false;
    console.log('Logging out...');
    navigate('/login');
  };


  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <BackgroundCircle
        size="400px"
        color="#6E8EFB"
        top="-100px"
        left="-100px"
        blur={80}
      />
      <BackgroundCircle
        size="300px"
        color="#7C3AED"
        top="30%"
        left="60%"
        blur={60}
      />
      <BackgroundCircle
        size="250px"
        color="#8B5CF6"
        top="70%"
        left="20%"
        blur={70}
      />

      {/* Decorative Grid Pattern */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <GradientAppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              VEERA
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Fade in timeout={800}>
                <IconButton
                  color="inherit"
                  onClick={() => setOpenFriendRequests(true)}
                >
                  <Badge
                    badgeContent={userData?.friendRequests?.length || 0}
                    color="error"
                  >
                    <Notifications />
                  </Badge>
                </IconButton>
              </Fade>

              <Fade in timeout={1000}>
                <IconButton
                  color="inherit"
                  onClick={() => setOpenAddFriend(true)}
                >
                  <PersonAdd />
                </IconButton>
              </Fade>

              <Fade in timeout={1200}>
                <IconButton onClick={() => setOpenProfileUpload(true)}>
                  <Avatar
                    src={userData?.photo}
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid white'
                    }}
                  >
                    {userData?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Fade>
            </Box>
          </Toolbar>
        </GradientAppBar>

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

          <Grid container spacing={3}>
            {userData?.friends?.map((friend, index) => (
              <Grow
                in
                timeout={500 + (index * 100)}
                key={friend.UID}
              >
                <Grid item xs={12} sm={6} md={4}>
                  <FriendCard elevation={0}>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                    >
                      <Avatar
                        src={friend.photo}
                        sx={{ width: 48, height: 48 }}
                      >
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
                    >
                      <VideocamOutlined />
                    </IconButton>
                  </FriendCard>
                </Grid>
              </Grow>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Friend Requests Dialog */}
      <Dialog
        open={openFriendRequests}
        onClose={() => setOpenFriendRequests(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Friend Requests</DialogTitle>
        <DialogContent>
          <List>
            {userData?.friendRequests?.map((request, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Box>
                    <IconButton color="success">
                      <Check />
                    </IconButton>
                    <IconButton color="error">
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

      {/* Add Friend Dialog */}
      <Dialog
        open={openAddFriend}
        onClose={() => setOpenAddFriend(false)}
      >
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={newFriendUsername}
            onChange={(e) => setNewFriendUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddFriend(false)}>Cancel</Button>
          <Button variant="contained">Send Request</Button>
        </DialogActions>
      </Dialog>

      {/* Profile Upload Dialog */}
      <Dialog
        open={openProfileUpload}
        onClose={() => setOpenProfileUpload(false)}
      >
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 3
            }}
          >
            <Avatar
              src={userData?.photo}
              sx={{ width: 120, height: 120 }}
            >
              {userData?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
            >
              Choose Photo
              <input
                type="file"
                hidden
                accept="image/*"
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileUpload(false)}>Cancel</Button>
          <Button variant="contained">Update Photo</Button>
        </DialogActions>
      </Dialog>
      <ProfileDialog
        open={openProfileUpload}
        onClose={() => setOpenProfileUpload(false)}
        maxWidth="xs"
        fullWidth
      >
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}
          >
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
              <input
                type="file"
                hidden
                accept="image/*"
              />
            </ProfileButton>

            <ProfileButton
              variant="text"
              onClick={handleLogout}
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
      </ProfileDialog>
    </Box>
  );
};

export default Home;