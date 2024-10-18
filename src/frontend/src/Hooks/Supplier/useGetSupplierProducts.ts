// Hooks/Supplier/useGetSupplierProducts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SupplierProduct {
  id_produto: number;
  preco_custo: number;
  produto: {
    nome_produto: string;
    id_categoria: number;
    permalink_imagem: string;
    categoria: {
      nome_categoria: string;
    };
  };
}

const getSupplierProducts = async (supplierId: number) => {
  const response = await axios.get(`http://127.0.0.1:3000/suppliers/${supplierId}/products`);
  return response.data;
};

const useGetSupplierProducts = (supplierId: number) => {
  return useQuery<SupplierProduct[]>({
    queryKey: ['supplierProducts', supplierId],
    queryFn: () => getSupplierProducts(supplierId),
  });
};

export default useGetSupplierProducts;
