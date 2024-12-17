import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

export const EmptyStateMessage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                mt: 4,
                position: 'relative',
            }}
        >
            <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{
                    color: 'text.primary',
                    mb: 1,
                    fontWeight: 'normal',
                    textAlign: 'center',
                    px: 2,
                }}
            >
                No friends added yet
            </Typography>

            <Typography
                sx={{
                    color: 'text.secondary',
                    mb: 3,
                    textAlign: 'center',
                    px: 2,
                    fontSize: isMobile ? '0.875rem' : '1rem',
                }}
            >
                Tap on the add friend icon to connect with others
            </Typography>
        </Box>
    );
};

export default EmptyStateMessage;