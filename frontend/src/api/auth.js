import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/auth' });

// Add JWT to every request if it exists
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export const signup = (formData) => API.post('/signup', formData);
export const verifyOtp = (otpData) => API.post('/verify-otp', otpData);
export const login = (formData) => API.post('/login', formData);