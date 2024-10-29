// Hooks/Supplier/useDeleteProductFromSupplier.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const deleteProductFromSupplier = async ({
  supplierId,
  id_produto,
}: {
  supplierId: number;
  id_produto: number;
}) => {
  await axios.delete(`http://127.0.0.1:3000/suppliers/${supplierId}/products`, {
    data: { id_produto },
    withCredentials: true
  });
};

const useDeleteProductFromSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:deleteProductFromSupplier,
    onSuccess: (_, { supplierId }) => {
        queryClient.invalidateQueries({queryKey:['suppliers', supplierId]}); // Refresh products list
      },
      onError: (error) => {
        console.error('Error deleting product from supplier:', error);
      }} );
};

export default useDeleteProductFromSupplier;
