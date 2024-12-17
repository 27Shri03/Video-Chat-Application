import { Box } from "@mui/material";

export const PageTransition = ({ isActive }) => (
    <Box
        sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            transform: isActive ? 'translateY(0%)' : 'translateY(100%)',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Box
            sx={{
                width: '50px',
                height: '50px',
                border: '3px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }}
        />
    </Box>
);