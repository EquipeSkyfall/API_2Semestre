import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const fetchShipments = async (search = '', page = 1, limit = 10,navigate: ReturnType<typeof useNavigate>,
  location: ReturnType<typeof useLocation>) => {
  try{
  const response = await axios.get(`http://127.0.0.1:3000/shipments`, {
    params: { search, page, limit },
    withCredentials: true
  });
  return response.data;
}catch(error){
  if (axios.isAxiosError(error)){
      const errorResponse = error.response;
  if (errorResponse?.status === 401) {
      console.log('Unauthorized access - redirecting or handling as necessary');
      sessionStorage.clear()
      navigate('/', { state: { from: location }, replace: true });
       
  }
}}};

const useGetShipments = (search = '', page = 1, limit = 10) => {
  const navigate = useNavigate();
    const location = useLocation();
  return useQuery({
    queryKey:['products', { search, page, limit }],
    queryFn: () =>
    fetchShipments(search, page, limit,navigate,location),
    retry: false
  });
};

export default useGetShipments;
