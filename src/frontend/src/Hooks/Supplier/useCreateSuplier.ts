import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FornecedorFormValues } from '../../components/SupplierForm/supplierSchema';




const postSupplierData = async (data: FornecedorFormValues) => {
    console.log(data)
    const response = await axios.post('http://127.0.0.1:3000/suppliers', data);
    return response.data;
  }



const useCreateSupplier = (
    
        onSuccess: () => void,
        onError: (message: string) => void
       
) => {
    const queryClient = useQueryClient()
    return useMutation(
    {
      mutationFn: postSupplierData,
      onSuccess:(data) =>{
        console.log('Fornecedor Criado',data)
        queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        onSuccess()
      },
      onError:(error)=>{
        
        console.log('Falha ao adicionar Fornecedor')
        console.log(error.message)
        onError(error.message)
      }
    }
  );
};

export default useCreateSupplier;
