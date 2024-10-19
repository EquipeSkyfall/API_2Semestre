import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchShipments = async (search = '', page = 1, limit = 10) => {
  const response = await axios.get(`http://127.0.0.1:3000/shipments`, {
    params: { search, page, limit },
  });
  return response.data;
};

const useGetShipments = (search = '', page = 1, limit = 10) => {
  return useQuery({
    queryKey:['shipments', { search, page, limit }],
    queryFn: () =>
    fetchShipments(search, page, limit),
    retry: false
  });
};

export default useGetShipments;
