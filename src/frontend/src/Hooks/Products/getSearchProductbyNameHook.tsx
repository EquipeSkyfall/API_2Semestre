// Hooks/Products/useSearchProducts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { redirect } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
export interface ProductSchema {
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
    nome_categoria: string;
    nome_setor: string;
    quantidade_estoque: number;
    // Add other fields as needed
}

interface ProductsResponse {
    products: ProductSchema[];
    totalPages: number;
    totalProducts: number;
}

interface QueryParams {
    search?: string;
    id_setor?: number | null;
    id_categoria?: number | null;
    id_fornecedor?: number | null;
    page?: number;
    limit?: number;
    forshipping?: number;
}

const useSearchProducts = (params: QueryParams) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data = { products: [], totalPages: 1, totalProducts: 0 }, isLoading, isError, refetch } = useQuery<ProductsResponse>({
        queryKey: ['products', params],
        queryFn: async () => {
            
            try {
                const response = await axios.get(`http://127.0.0.1:3000/products`, { params, withCredentials: true });
                return response.data || { products: [], totalPages: 1, totalProducts: 0 };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // This is an Axios error
                    const errorResponse = error.response;

                    // Log the status and any messages
                    console.error('Error status:', errorResponse?.status);
                    // console.error('Error message:', errorResponse?.data?.message || 'No message available');

                    // You can handle specific status codes here
                    if (errorResponse?.status === 401) {
                        console.log('Unauthorized access - redirecting or handling as necessary');
                        sessionStorage.clear()
                        navigate('/', { state: { from: location }, replace: true });
                         
                    }

                    // Optionally throw the error to make it accessible in the component
                    // throw new Error(errorResponse?.data?.message || 'An error occurred');
                } else {
                    console.error('An unknown error occurred:', error);
                    // throw new Error('An unknown error occurred');
                }
            }
        },
        retry: false,
    });

    const productsWithAdditionalFields = data.products.map(product => ({
        ...product,
        nome_categoria: product.nome_categoria,
        nome_setor: product.nome_setor,
    }));

    return {
        products: productsWithAdditionalFields,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
        isLoading,
        isError,
        refetch,
    };
};

export default useSearchProducts;
