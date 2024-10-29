// Hooks/Supplier/useAddProductsToSupplier.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface ProductToAdd {
  id_produto: number;
  preco_custo: number;
}

const addProductsToSupplier = async (
  supplierId: number,
  products: ProductToAdd[]
) => {
    console.log(products)
    await axios.post(`http://127.0.0.1:3000/suppliers/${supplierId}/products`, {products},{withCredentials: true});
};

const useAddProductsToSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supplierId, products }: { supplierId: number; products: ProductToAdd[] }) =>
      addProductsToSupplier(supplierId, products),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] }); // Refresh suppliers list
    },
    onError: (error: any) => {
      console.error('Error adding products to supplier:', error);
    },
  });
};

export default useAddProductsToSupplier;
