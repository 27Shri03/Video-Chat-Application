import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loader = ({ display }) => {
    return (
        display && (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional background
                    zIndex: 9999, // Ensure it's on top of other elements
                }}
            >
                <CircularProgress />
            </Box>
        )
    );
};

export default Loader;