import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { token } from "../Token";

type SectorId = number

const useDeleteSector = () => {
    const queryClient = useQueryClient();
    
    return useMutation<void, Error, SectorId>({
        mutationFn: async (id: SectorId) => {
            console.log(id)
            await axios.delete(`http://127.0.0.1:3000/sectors/${id}`,{withCredentials: true})
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['SectorsData']});
        },
        onError: (error) => {
            console.error('Error deleting sector.')
        }
    })
};

export default useDeleteSector;