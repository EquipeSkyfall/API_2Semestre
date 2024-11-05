// useGetUsers.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fetchUsers = async ({ page, limit, searchTerm },navigate) => {
  console.log('hah')
  try{
    const response = await axios.get(`http://127.0.0.1:3000/users`, {
      params: { page, limit, searchTerm },
      withCredentials: true,
    });
    return response.data;
  }catch(error){
    
    if (axios.isAxiosError(error)){
      const errorResponse = error.response;
      
      if (errorResponse?.status === 401) {
          console.log('Unauthorized access - redirecting or handling as necessary');
          sessionStorage.clear()
          navigate('/');
           
      }
  }
  }
 
};

const useGetUsers = ({ page = 1, limit = 10, searchTerm }) => {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ['users', page, limit, searchTerm],
    queryFn: () => fetchUsers({ page, limit, searchTerm },navigate),

    retry: false,
  });
};

export default useGetUsers;
