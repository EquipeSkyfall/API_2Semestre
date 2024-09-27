import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Product {
    id: number;
    product_name: string;
    description?: string;
    batch: string;
    brand: string;
    quantity: number;
    price: number;
    retail_price: number;
    stock_location?: string;
    id_category?: number;
    id_sector?: number;
    url_image?: string;
    weight?: number;
    height?: number;
    width?: number;
}

// Hook for updating product
const useUpdateProduct = () => {
    return useMutation<Product, Error, Product>({
        mutationFn: async (product: Product) => {
            const { data } = await axios.patch<Product>(`http://127.0.0.1:3000/products/${product.id}`, product);
            return data;
        },
    });
};

export default useUpdateProduct;
