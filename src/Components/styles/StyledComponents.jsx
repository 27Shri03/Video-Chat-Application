import { styled } from '@mui/material/styles';
import { AppBar, Badge, Paper, Dialog, Button } from '@mui/material';


export const GradientAppBar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(135deg, #6E8EFB 0%, #7C3AED 100%)',
    boxShadow: 'none',
}));

export const FriendCard = styled(Paper)(({ theme }) => ({
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

export const StyledBadge = styled(Badge)(({ theme }) => ({
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

export const BackgroundCircle = styled('div')(({ size, color, top, left, blur }) => ({
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

export const ProfileDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        padding: theme.spacing(2),
    }
}));

export const ProfileButton = styled(Button)(({ theme }) => ({
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