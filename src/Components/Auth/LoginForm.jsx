// LoginForm.jsx
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
import { useNavigate } from 'react-router-dom';
import { login } from '../../Services/auth.service.js';
import Loader from '../styles/loader.jsx';
import { useUserData } from '../Context/UserData.context.jsx';

const LoginForm = ({ setAlertMessage, setDisplay, setSeverity, onToggleMode, isMobile }) => {
    const { updateUserData } = useUserData();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const navigate = useNavigate();
    const [showEmail, setShowEmail] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data = {
                password: formData.password
            };
            if (formData.username.length === 0) {
                data.email = formData.email;
            }
            else {
                data.username = formData.username;
            }
            setLoading(true);
            const response = await login(data , updateUserData);
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
                <Box>
                    {!showEmail ? (
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
                    ) : (
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            type="text"
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
                    )}
                    <Box sx={{ mt: -1, mb: 1, textAlign: 'right' }}>
                        <Link
                            component="button"
                            type="button" // Prevent form submission
                            variant="body2"
                            onClick={() => {
                                setShowEmail(!showEmail);
                                setFormData({
                                    email: '',
                                    password: '',
                                    username: ''
                                })
                            }}
                            sx={{
                                textDecoration: 'none',
                                fontSize: '0.75rem',
                                color: 'text.secondary',
                                '&:hover': {
                                    color: 'primary.main'
                                }
                            }}
                        >
                            {showEmail ? 'Login with Email' : 'Login with Username'}
                        </Link>
                    </Box>
                </Box>

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
                        Sign In
                    </Button>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        Don't have an account?{' '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={onToggleMode}
                            sx={{ textDecoration: 'none' }}
                        >
                            Sign up here
                        </Link>
                    </Typography>
                </Box>
            </form>
        </>
    );
};

export default LoginForm;