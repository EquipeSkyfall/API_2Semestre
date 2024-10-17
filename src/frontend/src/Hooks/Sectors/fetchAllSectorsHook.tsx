import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Sector } from "../../components/SectorTypes/types";

interface SectorsResponse {
    sectors: Sector[];
    totalPages: number;
    totalSectors: number;
}

const FetchAllSectors = (page: number, limit: number) => {
    const { data = { sectors: [], totalPages: 1, totalSectors: 0 }, isLoading, isError, refetch } = useQuery<SectorsResponse>({
        queryKey: ['searchSectors', page, limit],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:3000/sectors?page=${page}&limit=${limit}`)
            return response.data || {sectors: [], totalPages: 1, totalSectors: 0 }
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