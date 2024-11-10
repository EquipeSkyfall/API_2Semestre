import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Sector } from "../../components/SectorTypes/types";
import { useNavigate, useLocation } from "react-router-dom";

interface SectorsResponse {
    sectors: Sector[];
    totalPages: number;
    totalSectors: number;
}

const FetchAllSectors = (search: string, page: number = 1, limit: number | string = 'all') => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data = { sectors: [], totalPages: 1, totalSectors: 0 }, isLoading, isError, refetch } = useQuery<SectorsResponse>({
        queryKey: ['SectorsData', page, limit],
        queryFn: async () => {
            try{
            const response = await axios.get(`http://127.0.0.1:3000/sectors?search=${search}&page=${page}&limit=${limit}`,{ withCredentials:true})
            return response.data || {sectors: [], totalPages: 1, totalSectors: 0 }
        }catch(error){
            if (axios.isAxiosError(error)){
                const errorResponse = error.response;
            if (errorResponse?.status === 401) {
                console.log('Unauthorized access - redirecting or handling as necessary');
                sessionStorage.clear()
                navigate('/', { state: { from: location }, replace: true });
                 
            }
        }}
    },
        retry: false,
    });


    return {
        sectors: data.sectors,
        totalPages: data.totalPages,
        totalSectors: data.totalSectors,
        isLoading,
        isError,
        refetch
    }
};

export default FetchAllSectors;