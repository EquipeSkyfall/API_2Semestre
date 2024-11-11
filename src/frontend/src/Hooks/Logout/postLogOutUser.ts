import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // Send a POST request to the backend logout endpoint
      await axios.post('http://127.0.0.1:3000/users/logout', { withCredentials: true });

      // Clear cached data, if necessary (e.g., user session data)
      queryClient.clear();

      // Redirect the user to the homepage
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optional: Add error handling logic, like showing a toast notification
    }
  };

  return logout;
}
