import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useSearchProducts = (page: number, limit: number, searchTerm: string) => {
    const { data = { products: [], totalPages: 1 }, isLoading, isError, refetch } = useQuery({
        queryKey: ['searchProducts', searchTerm, page, limit],
        queryFn: async () => {
            const response = searchTerm.trim() === ''
                ? await axios.get(`http://127.0.0.1:3000/products?page=${page}&limit=${limit}`)
                : await axios.get(`http://127.0.0.1:3000/products/search?product_name=${searchTerm}&page=${page}&limit=${limit}`);
                
            return response.data || { products: [], totalPages: 1 };
        },
        retry: false,
    });

    return {
        products: data.products,
        totalPages: data.totalPages,
        isLoading,
        isError,
        refetch,
    };
};

export default useSearchProducts;
