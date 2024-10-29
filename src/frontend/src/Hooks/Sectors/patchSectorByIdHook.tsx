import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Sector } from "../../components/SectorTypes/types";
import { token } from "../Token";

const useUpdateSector = () => {
    const queryClient = useQueryClient();

    return useMutation<Sector, Error, Sector>({
        mutationFn: async (sector: Sector) => {
            const { data } = await axios.patch<Sector>(`http://127.0.0.1:3000/sectors/${sector.id_setor}`, sector,{withCredentials: true})
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:['SectorsData']});
        },
        onError: (error) => {
            console.error('Error deleting sector.')
        }
    })
};

export default useUpdateSector;