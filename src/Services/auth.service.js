// auth.service.js
import axios from 'axios';
const API_URL = import.meta.env.VITE_SERVER_URL;

// Utility function to save token
const saveToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Utility function to get token
const getToken = () => {
    return localStorage.getItem('authToken');
};

// Signup function
export const signup = async (formData, updateUserData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signUp`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        updateUserData(data.userData);
        saveToken(data.token); // Save token for future requests
        return data; // Returning response for further processing if needed
    } catch (error) {
        console.error('Signup Error:', error);
        throw new Error(error.response?.data?.message || 'SignUp failed');
    }
};

// Login function
export const login = async (formData, updateUserData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/logIn`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        updateUserData(data.userData);
        saveToken(data.token); // Save token for future requests
        return data; // Returning response for further processing if needed
    } catch (error) {
        console.error('Login Error:', error);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

// Middleware for requests requiring authentication
export const authFetch = async (url, options = {}) => {
    const token = getToken();
    if (!token) throw new Error('No token found, user may not be authenticated');

    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios(url, authOptions);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Request failed');
    }
};

// Placeholder functions
export const acceptFriendRequest = async (username, addFriend) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No token found, user may not be authenticated');
        const response = await axios.post(`${API_URL}/user/acceptFriendRequest`, { username }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        addFriend(response.data.data);
        return response.data;
    } catch (error) {
        console.error('Send Friend Request Error:', error);
        throw new Error(error.response?.data?.message || 'Failed to send friend request');
    }
}

export const rejectFriendRequest = async (username, removeFriendRequest) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No token found, user may not be authenticated');
        const response = await axios.delete(`${API_URL}/user/rejectFriendRequest/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        removeFriendRequest(username);
        return response.data;
    } catch (error) {
        console.error('Send Friend Request Error:', error);
        throw new Error(error.response?.data?.message || 'Failed to send friend request');
    }
}

export const sendFriendRequest = async (username) => {
    try {
        const token = getToken();
        if (!token) throw new Error('No token found, user may not be authenticated');

        const response = await axios.post(`${API_URL}/user/sendFriendRequest`, { username }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Returning response for further processing if needed
    } catch (error) {
        console.error('Send Friend Request Error:', error);
        throw new Error(error.response?.data?.message || 'Failed to send friend request');
    }
};

export const updateProfilePhoto = () => { }

export const isOnline = () => { }

export const startVideoCall = () => { }