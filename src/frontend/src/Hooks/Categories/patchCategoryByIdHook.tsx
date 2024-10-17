import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Category {
    id_categoria: number;
    nome_categoria: string;
    descricao_categoria: string;
}

const useUpdateCategory = () => {
    return useMutation<Category, Error, Category>({
        mutationFn: async (category: Category) => {
            const{ data } = await axios.patch<Category>(`http://127.0.0.1:3000/categories/${category.id_categoria}`, category)
            return data;
        }
    })
};

export default useUpdateCategory;