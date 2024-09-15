import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust to your backend URL
const EXPIRY_TIME_MS = 3600000; // 1 hour in milliseconds

export interface User {
    firstname?: string;
    lastname?: string;
    email?: string;
    photo?: string;
}

// Helper to set token with expiration
export const setAuthToken = (token: string): void => {
    const now = new Date().getTime();
    const expiryTime = now + EXPIRY_TIME_MS; // Expire in 1 hour
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiry', expiryTime.toString());
    console.log('Auth token and expiry time have been set.');
};

// Helper to check if token is expired
const isTokenExpired = (): boolean => {
    const expiryTime = localStorage.getItem('authTokenExpiry');
    if (!expiryTime) return true;

    const now = new Date().getTime();
    return now > parseInt(expiryTime, 10);
};

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token || isTokenExpired()) {
        console.log('Token is either missing or expired.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
        return false;
    }
    return true;
};

export const getUser = async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token || isTokenExpired()) {
        console.log('Token is missing or expired.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
        return null;
    }

    try {
        const response = await axios.get(`${API_URL}/user-details`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('User data retrieved:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiry');
    localStorage.removeItem('userData'); // Clear user data if stored
    console.log('Logged out and token data removed.');
};
