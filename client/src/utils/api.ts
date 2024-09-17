import axios from 'axios';

export const fetchUserDetails = async (token: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/user-details', { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};
