// Hooks/Supplier/useGetSupplierProducts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface SupplierProduct {
  id_produto: number;
  preco_custo: number;
  produto: {
    nome_produto: string;
    id_categoria: number;
    permalink_imagem: string;
    categoria: {
      nome_categoria: string;
    };
    setor: {
      nome_setor: string;
    }
  };
  quantidade_estoque: number;
}

interface Response {
  products: SupplierProduct[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

interface QueryParams {
  search?: string;
  id_setor?: number | null;
  id_categoria?: number | null;
  page?: number;
  limit?: number;
}

const getSupplierProducts = async (supplierId: number | null, params: QueryParams) => {
  const response = await axios.get<Response>(`http://127.0.0.1:3000/suppliers/${supplierId}/products`, {params});
  console.log('fala')
  return response.data;
};

const useGetSupplierProducts = (supplierId: number, params: QueryParams) => {
  return useQuery({
    queryKey: ['suppliers', supplierId, params],
    queryFn: () => getSupplierProducts(supplierId, params),
    enabled: !!supplierId
  });
};

export default useGetSupplierProducts;
