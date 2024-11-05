import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const fetchUser = async (navigate) => { 
  
  try{
    const response = await axios.get(`http://127.0.0.1:3000/users/me`, {
      withCredentials: true
    });
    console.log(response.data)
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

const useGetUser = () => {
  const navigate = useNavigate();
  return useQuery({
    queryKey:['users'],
    queryFn: () =>
    fetchUser(navigate),
    retry: false
  });
};

export default useGetUser;
