
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Supplier } from './useSuppliers';

interface UpdateSupplierPayload extends Partial<Supplier> {
  id_fornecedor: number;
}

const updateSupplier = async (supplier: UpdateSupplierPayload) => {
  const { id_fornecedor, ...data } = supplier;
  const response = await axios.patch(`http://127.0.0.1:3000/suppliers/${id_fornecedor}`, data,{withCredentials: true});
  return response.data;
};

const useUpdateSupplier = (onSuccess: () => void, setServerError: unknown) => {
  const queryClient = useQueryClient();

  return useMutation(
    {mutationFn: updateSupplier,
     onSuccess:() =>{
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        console.log(`Fornecedor atualizado`)
     }
    }
    );
};

export default useUpdateSupplier;
