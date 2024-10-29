import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type CategoryId = number

const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, CategoryId>({
        mutationFn: async (id: CategoryId) => {
            console.log(id)
            await axios.delete(`http://127.0.0.1:3000/categories/${id}`,{withCredentials: true})
        },
        onSuccess: () => {
            // Invalidate and refetch categories after a successful deletion
            queryClient.invalidateQueries({queryKey:['CategoriesData']});
        },
        onError: (error) => {
            console.error(error)
        }
    })
};

export default useDeleteCategory