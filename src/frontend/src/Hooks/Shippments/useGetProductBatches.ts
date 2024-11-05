// Hooks/Shipment/useGetProductBatches.ts
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface Batch {
  id_lote: number;
  id_produto: number;
  quantidadeDisponivel: number;
  validade_produto: string;
}

const fetchProductBatches = async (productId: number,navigate: ReturnType<typeof useNavigate>,
  location: ReturnType<typeof useLocation>) => {
    
  try{
  const { data } = await axios.get<Batch[]>(
    `http://127.0.0.1:3000/products/${productId}/batches`,
    {withCredentials:true}
  );
  return data;
}catch(error){
  
  if (axios.isAxiosError(error)){
      const errorResponse = error.response;
  if (errorResponse?.status === 401) {
      console.log('Unauthorized access - redirecting or handling as necessary');
      sessionStorage.clear()
      navigate('/', { state: { from: location }, replace: true });
       
  }
}}};

const useGetProductBatches = (productIds: number[]) => {
  const navigate = useNavigate();
  const location = useLocation();  
  return useQueries({
    queries: productIds.map(productId => ({
      queryKey: ['products', productId],
      queryFn: () => fetchProductBatches(productId, navigate, location),
      enabled: !!productId, // Only fetch if productId is truthy
    })),
  });
};

export default useGetProductBatches;
