import axios from 'axios';
import { API_URL } from './api';


export interface User {
    firstname?: string;
    lastname?: string;
    email?: string;
    photo?: string;
}

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
};

export const getUser = async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const response = await axios.get(`${API_URL}/api/auth/user-details`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response || !response.data) {
            localStorage.removeItem('authToken'); // Remove authToken if response is null
            localStorage.removeItem('userData');  // Clear userData as well
            return null;
        }

        localStorage.setItem('userData', JSON.stringify(response.data));

        return response.data;
    } catch (error) {
        return null;
    }
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData'); // Clear user data if stored
    localStorage.removeItem("verifiedPhone");
    localStorage.removeItem("phoneVerified");
};
