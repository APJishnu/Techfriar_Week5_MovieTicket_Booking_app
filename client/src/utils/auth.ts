import axios from "axios";
import { API_URL } from "./api";
import Cookies from "js-cookie";

export interface User {
  firstname?: string;
  lastname?: string;
  email?: string;
  emailVerifiedAt?: Date | null;
  photo?: string;
}

// Helper function to fetch user details from the backend
const fetchUserDetails = async (): Promise<User | null> => {
  const token = Cookies.get("authToken");
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/api/auth/user-details`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response || !response.data) {
      Cookies.remove("authToken");
      localStorage.removeItem("userData");
      return null;
    }

    // Store user data locally if needed
    localStorage.setItem("userData", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    // Handle errors (e.g., token expiration or server error)
    Cookies.remove("authToken");
    localStorage.removeItem("userData");
    return null;
  }
};

// Updated isAuthenticated function to check token and email verification status
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await fetchUserDetails();
  return !!(user && user.emailVerifiedAt);
};

// Updated getUser function to return user details (if available)
export const getUser = async (): Promise<User | null> => {
  return await fetchUserDetails();
};

export const logout = (): void => {
  Cookies.remove("authToken");
  localStorage.removeItem("userData"); // Clear user data if stored
};
