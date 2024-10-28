// Hooks/Supplier/useDeleteSupplier.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const deleteSupplier = async (id: number) => {
  await axios.delete(`http://127.0.0.1:3000/suppliers/${id}`,{withCredentials: true});
};

const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:deleteSupplier,
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey:['suppliers']}); // Refresh supplier list
      },
      onError: (error: any) => {
        console.error('Error deleting supplier:', error);
      }    
  }
    ,
  )};


export default useDeleteSupplier;
