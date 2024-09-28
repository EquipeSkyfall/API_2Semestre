import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type ProductId = number;

const useDeleteProduct = () => {
    return useMutation<void, Error, ProductId>({
        mutationFn: async (id: ProductId) => {
            await axios.delete(`http://127.0.0.1:3000/products/id?id=${id}`);
        },
        // Optional: you can handle errors globally here or pass an onError callback in the component
        onError: (error) => {
            console.error('Error deleting product(error sent from HOOK DeleteProductByID):', error);
        }
    });
};

export default useDeleteProduct;
