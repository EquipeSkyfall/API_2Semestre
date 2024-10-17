import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Sector } from "../../components/SectorTypes/types";

const useUpdateSector = () => {
    const queryClient = useQueryClient();

    return useMutation<Sector, Error, Sector>({
        mutationFn: async (sector: Sector) => {
            const { data } = await axios.patch<Sector>(`http://127.0.0.1:3000/sectors/${sector.id_setor}`, sector)
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['SectorsData']);
        },
        onError: (error) => {
            console.error('Error deleting sector.')
        }
    })
};

export default useUpdateSector;