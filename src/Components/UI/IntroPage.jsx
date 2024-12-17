import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VideocamIcon from '@mui/icons-material/Videocam';
import {PageTransition} from '../styles/pageTransition.jsx';

const FloatingShape = ({ gradient, size, top, left, duration, rotation = false }) => (
    <Box
        className="animate-bounce"
        sx={{
            position: 'absolute',
            width: size,
            height: size,
            background: gradient,
            borderRadius: rotation ? '20%' : '50%',
            opacity: 0.6,
            filter: 'blur(2px)',
            animation: `${rotation ? 'floatAndRotate' : 'float'} ${duration}s ease-in-out infinite`,
            top,
            left,
            zIndex: 1,
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
    />
);

const IntroPage = () => {
    const [showButton, setShowButton] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const navigate = useNavigate();

    const handleNavigation = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/login');
        }, 400); // Match this with the transition duration
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <PageTransition isActive={isTransitioning} />
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Animated Background Shapes */}
                <FloatingShape
                    gradient="linear-gradient(45deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))"
                    size="150px"
                    top="10%"
                    left="10%"
                    duration="8"
                    rotation
                />
                <FloatingShape
                    gradient="linear-gradient(-45deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5))"
                    size="120px"
                    top="70%"
                    left="15%"
                    duration="10"
                />
                <FloatingShape
                    gradient="radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.4))"
                    size="180px"
                    top="20%"
                    left="80%"
                    duration="9"
                    rotation
                />
                <FloatingShape
                    gradient="linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3))"
                    size="100px"
                    top="60%"
                    left="75%"
                    duration="7"
                />

                {/* Additional decorative shapes */}
                <FloatingShape
                    gradient="linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))"
                    size="90px"
                    top="40%"
                    left="45%"
                    duration="11"
                />
                <FloatingShape
                    gradient="radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0.3))"
                    size="130px"
                    top="85%"
                    left="40%"
                    duration="9"
                    rotation
                />

                {/* Content Container with backdrop blur */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        padding: { xs: '20px', sm: '40px' },
                        borderRadius: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        maxWidth: '800px',
                        margin: '0 20px',
                    }}
                >
                    {/* Video Icon with Animation */}
                    <Box
                        className="animate-bounce"
                        sx={{
                            mb: 4,
                            animation: 'pulse 2s infinite',
                        }}
                    >
                        <VideocamIcon
                            sx={{
                                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                                color: 'white',
                            }}
                        />
                    </Box>

                    {/* Main Content */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            mb: 2,
                            px: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        }}
                    >
                        Welcome to VEERA
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                            color: 'rgba(255,255,255,0.9)',
                            textAlign: 'center',
                            mb: 6,
                            px: 3,
                        }}
                    >
                        Connect, Collaborate, Communicate
                    </Typography>

                    <Fade in={showButton}>
                        <Button
                            onClick={handleNavigation}
                            sx={{
                                backgroundColor: 'white',
                                color: '#6366f1',
                                padding: { xs: '10px 30px', sm: '12px 40px' },
                                fontSize: { xs: '1rem', sm: '1.2rem' },
                                borderRadius: '30px',
                                textTransform: 'none',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 8px rgba(0,0,0,0.2)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Get Started
                        </Button>
                    </Fade>
                </Box>

                {/* Add global keyframes for animations */}
                <style>
                    {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes floatAndRotate {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
            100% { transform: translateY(0px) rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
                </style>
            </Box>
        </>
    );
};

export default IntroPage;