import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the type for the user data
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "manager"; // Adjust based on your actual user roles
}

// Custom hook for fetching users
const FetchAllUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['UsersData'],
    queryFn: async () => {
      const { data } = await axios.get('http://127.0.0.1:3000/users');
      return data;
    },
  });
};

export default FetchAllUsers;
