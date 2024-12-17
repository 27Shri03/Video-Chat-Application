import React from 'react';
import { Box } from '@mui/material';
import { BackgroundCircle } from '../styles/StyledComponents';

export const Background = () => (
    <>
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
    </>
);