import axios from 'axios';
import { API_URL } from './api';
import Cookies from 'js-cookie';


export interface User {
    firstname?: string;
    lastname?: string;
    email?: string;
    photo?: string;
}

export const isAuthenticated = (): boolean => {
    const token = Cookies.get("authToken");
    return !!token;
};

export const getUser = async (): Promise<User | null> => {
    const token = Cookies.get("authToken");
    if (!token) return null;

    try {
        const response = await axios.get(`${API_URL}/api/auth/user-details`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response || !response.data) {
            Cookies.remove("authToken");
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
    Cookies.remove("authToken");
    localStorage.removeItem('userData'); // Clear user data if stored
};
