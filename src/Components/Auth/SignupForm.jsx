// SignupForm.jsx
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Link
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person
} from '@mui/icons-material';
import Loader from '../styles/loader.jsx';
import { signup } from '../../Services/auth.service.js';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../Context/UserData.context.jsx';

const SignupForm = ({ setAlertMessage, setDisplay, setSeverity, onToggleMode, isMobile }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { updateUserData } = useUserData();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                setAlertMessage('Passwords do not Match!');
                setSeverity('warning');
                setDisplay(true);
                return;
            }
            setLoading(true);
            const response = await signup(formData, updateUserData);
            setAlertMessage(response.message);
            setSeverity('success');
            setDisplay(true);
            setLoading(false);
            navigate('/home');

        } catch (error) {
            setAlertMessage(error.message);
            setSeverity('error');
            setDisplay(true);
            setLoading(false);
        }
    };

    return (
        <>
            <Loader display={loading} />
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Person color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock color="primary" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{ mt: 2 }}>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: isMobile ? 14 : 16,
                            py: 1.5,
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                            }
                        }}
                    >
                        Create Account
                    </Button>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        Already have an account?{' '}
                        <Link
                            component="button"
                            variant="button"
                            onClick={onToggleMode}
                            sx={{ textDecoration: 'none' }}
                        >
                            Log in here
                        </Link>
                    </Typography>
                </Box>
            </form>
        </>
    );
};

export default SignupForm;