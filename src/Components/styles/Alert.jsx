import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';

const CustomAlert = ({ open, severity, message, onClose }) => {
    const [showAlert, setShowAlert] = useState(open);
    const theme = useTheme();

    // Media queries for different screen sizes
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        if (open) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                onClose(); // Callback to reset the open state from the parent component
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    return (
        <Snackbar
            open={showAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
                width: '100%',
                maxWidth: isMobile ? '90%' : isTablet ? '80%' : '600px', // Adjust width for mobile and tablet
                margin: '0 auto',
                padding: theme.spacing(1),
            }}
        >
            <Alert
                severity={severity}
                variant="filled"
                onClose={() => setShowAlert(false)}
                sx={{
                    width: '100%',
                    fontSize: isMobile ? '0.9rem' : '1rem', // Adjust font size for smaller screens
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomAlert;
