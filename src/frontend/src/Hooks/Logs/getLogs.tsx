import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const fetchLogs = async (search='', page=1, limit=10) => {
    const response = await axios.get(`http://127.0.0.1:3000/logs`, {
        params: { search, page, limit },withCredentials: true
    })
    return response.data
};

const useGetLogs = (search='', page=1, limit=10) => {
    return useQuery({
        queryKey:['logs', { search, page, limit }],
        queryFn: () =>
        fetchLogs(search, page, limit),
        retry: false
    });
};

export default useGetLogs;