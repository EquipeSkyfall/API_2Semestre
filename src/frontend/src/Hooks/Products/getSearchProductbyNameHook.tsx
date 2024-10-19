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
    page?: number;
    limit?: number;
    forshipping?: number;
}

const useSearchProducts = (params: QueryParams) => {
    const { data = { products: [], totalPages: 1, totalProducts: 0 }, isLoading, isError, refetch } = useQuery<ProductsResponse>({
        queryKey: ['shipments','searchProducts', params],
        queryFn: async () => {
            const response = await axios.get(`http://127.0.0.1:3000/products`, {params});

            return response.data || { products: [], totalPages: 1, totalProducts: 0 };
        },
        retry: false,
    });

    const productsWithAdditionalFields = data.products.map(product => ({
        ...product,
        quantidade_estoque: product.quantidade_estoque || 0,
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
