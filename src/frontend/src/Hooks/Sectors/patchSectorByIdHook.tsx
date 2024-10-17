import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Sector } from "../../components/SectorTypes/types";

const useUpdateSector = () => {
    return useMutation<Sector, Error, Sector>({
        mutationFn: async (sector: Sector) => {
            const { data } = await axios.patch<Sector>(`http://127.0.0.1:3000/sectors/${sector.id_setor}`, sector)
            return data;
        }
    })
};

export default useUpdateSector;