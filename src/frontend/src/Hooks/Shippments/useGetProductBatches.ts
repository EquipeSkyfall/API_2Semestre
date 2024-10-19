// Hooks/Shipment/useGetProductBatches.ts
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

interface Batch {
  id_lote: number;
  id_produto: number;
  quantidadeDisponivel: number;
  validade_produto: string;
}

const fetchProductBatches = async (productId: number) => {
  const { data } = await axios.get<Batch[]>(
    `http://127.0.0.1:3000/products/${productId}/batches`
  );
  return data;
};

const useGetProductBatches = (productIds: number[]) => {
  return useQueries({
    queries: productIds.map(productId => ({
      queryKey: ['shipments', productId],
      queryFn: () => fetchProductBatches(productId),
      enabled: !!productId, // Only fetch if productId is truthy
    })),
  });
};

export default useGetProductBatches;
