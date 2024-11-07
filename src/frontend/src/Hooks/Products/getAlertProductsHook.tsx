import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProductSchema } from "./getSearchProductbyNameHook";

interface ProductsResponse {
    products: ProductSchema[];
    totalPages: number;
    totalProducts: number;
}

interface QueryParams {
    search?: string;
    id_setor?: number | null;
    id_categoria?: number | null;
    page?: number;
    limit?: number;
    productsArray?: number[];
}

const useAlertProducts = (params: QueryParams) => {
    const { data = {products: [], totalPages: 1, totalProducts: 0 }, isLoading, isError, refetch } = useQuery<ProductsResponse>({
        queryKey: ['products', params],
        queryFn: async () => {
            try {
                console.log('TALK TO MEEE: ',params.productsArray)
                const response = await axios.post(`http://127.0.0.1:3000/products/post-array`,  params, {withCredentials: true} )
                return response.data || { products: [], totalPages: 1, totalProducts: 0 };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    // This is an Axios error
                    const errorResponse = error.response;

                    // Log the status and any messages
                    console.error('Error status:', errorResponse?.status);
                } else {
                    console.error('An unknown error occurred:', error);
                }
            }
        },
        retry: false,
    });

    return {
        products: data.products,
        totalPages: data.totalPages,
        totalProducts: data.totalProducts,
        isLoading,
        isError,
        refetch
    }
}

export default useAlertProducts;