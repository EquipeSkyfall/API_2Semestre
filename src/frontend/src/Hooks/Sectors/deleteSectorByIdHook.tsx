import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type SectorId = number

const useDeleteSector = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, SectorId>({
        mutationFn: async (id: SectorId) => {
            console.log(id)
            await axios.delete(`http://127.0.0.1:3000/sectors/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['SectorsData']);
        },
        onError: (error) => {
            console.error('Error deleting sector.')
        }
    })
};

export default useDeleteSector;