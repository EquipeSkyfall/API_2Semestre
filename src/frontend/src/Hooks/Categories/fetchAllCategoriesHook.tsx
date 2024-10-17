import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface CategorySchema {
    id_categoria: number;
    nome_categoria: string;
    descricao_categoria: string;
}

interface CategoriesResponse {
    categories: CategorySchema[];
    totalPages: number;
    totalCategories: number;
}

const FetchAllCategories = (page: number, limit: number) => {
    const { data = { categories: [], totalPages: 1, totalCategories: 0 }, isLoading, isError, refetch } = useQuery<CategoriesResponse>({
        queryKey: ['searchCategories', page, limit],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:3000/categories?page=${page}&limit=${limit}`)
            return response.data || { categories: [], totalPages: 1, totalCategories: 0 }
        },
        retry: false,
    });

    return {
        categories: data.categories,
        totalPages: data.totalPages,
        totalCategories: data.totalCategories,
        isLoading,
        isError,
        refetch
    }
}

export default FetchAllCategories