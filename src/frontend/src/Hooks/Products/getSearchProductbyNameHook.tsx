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
    productsArray?: number[];
}

const useSearchProducts = (params: QueryParams) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data = { products: [], totalPages: 1, totalProducts: 0 }, isLoading, isError, refetch } = useQuery<ProductsResponse>({
        queryKey: ['products', params],
        queryFn: async () => {
            try {
                // Determine if we should send as GET or POST based on productsArray
                const response = params.productsArray && params.productsArray.length > 0
                    ? await axios.post(`http://127.0.0.1:3000/products/post-array`, { ...params, productsArray: params.productsArray }, { withCredentials: true })
                    : await axios.get(`http://127.0.0.1:3000/products`, { params, withCredentials: true });
                
                return response.data || { products: [], totalPages: 1, totalProducts: 0 };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const errorResponse = error.response;
                    console.error('Error status:', errorResponse?.status);
                    
                    if (errorResponse?.status === 401) {
                        sessionStorage.clear();
                        navigate('/', { state: { from: location }, replace: true });
                    }
                } else {
                    console.error('An unknown error occurred:', error);
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
