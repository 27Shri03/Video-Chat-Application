// LoginPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const LoginPage = ({ setAlertMessage, setDisplay, setSeverity }) => {
    const [isLogin, setIsLogin] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    localStorage.clear();
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 2
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={12}
                    sx={{
                        padding: isMobile ? 2 : 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                    }}
                >
                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        align="center"
                        gutterBottom
                        sx={{ mb: 4, fontWeight: 'bold' }}
                    >
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </Typography>

                    {isLogin ? (
                        <LoginForm
                            onToggleMode={() => setIsLogin(false)}
                            isMobile={isMobile}
                            setAlertMessage={setAlertMessage} setDisplay={setDisplay} setSeverity={setSeverity}
                        />
                    ) : (
                        <SignupForm
                            onToggleMode={() => setIsLogin(true)}
                            isMobile={isMobile}
                            setAlertMessage={setAlertMessage} setDisplay={setDisplay} setSeverity={setSeverity}
                        />
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;