import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Category } from "../../components/CategoryTypes/types";

const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<Category, Error, Category>({
        mutationFn: async (category: Category) => {
            const{ data } = await axios.patch<Category>(`http://127.0.0.1:3000/categories/${category.id_categoria}`, category)
            return { data }
        },
        onSuccess: () => {
            // Invalidate and refetch categories after a successful deletion
            queryClient.invalidateQueries(['CategoriesData']);
        },
        onError: (error) => {
            console.error('Error patching category')
        }
    })
};

export default useUpdateCategory;