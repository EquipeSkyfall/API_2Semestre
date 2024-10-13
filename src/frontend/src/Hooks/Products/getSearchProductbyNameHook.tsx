// Hooks/Products/useSearchProducts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ProductSchema {
    id: number;
    product_name: string;
    description: string;
    batch: string;
    brand: string;
    quantity: number;
    price: number;
    retail_price: number;
    stock_location: string;
    id_category?: number;
    id_sector?: number;
    weight: number;
    height: number;
    width: number;
    // Add other fields as needed
}

interface ProductsResponse {
    products: ProductSchema[];
    totalPages: number;
    totalProducts: number;
}

const useSearchProducts = (page: number, limit: number, searchTerm: string) => {
    const { data = { products: [], totalPages: 1, totalProducts: 0 }, isLoading, isError, refetch } = useQuery<ProductsResponse>({
        queryKey: ['searchProducts', searchTerm, page, limit],
        queryFn: async () => {
            const response = searchTerm.trim() === ''
                ? await axios.get(`http://127.0.0.1:3000/products?page=${page}&limit=${limit}`)
                : await axios.get(`http://127.0.0.1:3000/products?search=${searchTerm}&page=${page}&limit=${limit}`);
            return response.data || { products: [], totalPages: 1, totalProducts: 0 };
        },
        retry: false,
    });

    return {
        products: data.products,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
        isLoading,
        isError,
        refetch,
    };
};

export default useSearchProducts;
