import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBatches = async (search = '', page = 1, limit = 10) => {
  const response = await axios.get(`http://127.0.0.1:3000/batches`, {
    params: { search, page, limit },
  });
  return response.data;
};

const useGetBatches = (search = '', page = 1, limit = 10) => {
  return useQuery({
    queryKey:['batches', { search, page, limit }],
    queryFn: () =>
    fetchBatches(search, page, limit),
    retry: false
  });
};

export default useGetBatches;
