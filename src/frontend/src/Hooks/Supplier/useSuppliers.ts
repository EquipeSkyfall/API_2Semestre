import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Supplier {
  id_fornecedor: number;
  cnpj_fornecedor: string;
  razao_social: string;
  nome_fantasia?: string | null;
  endereco_fornecedor?: string | null;
  cidade: string;
  estado: string;
  cep: string;
}

interface SuppliersResponse {
  suppliers: Supplier[];
  totalSuppliers: number;
  totalPages: number;
  currentPage: number;
}

interface QueryParams {
  search?: string;
  page?: number;
  limit?: number | 'all';
}

const fetchSuppliers = async (params: QueryParams) => {
  const response = await axios.get<SuppliersResponse>('http://127.0.0.1:3000/suppliers', { params });
    console.log('TT'+ response.data.suppliers)
    const a=response.data.suppliers
    a.forEach((name)=>{
        console.log(name)
    })
  return response.data;
};

const useSuppliers = (params: QueryParams) => {
  return useQuery({
    queryKey:['suppliers', params], 
    queryFn:() => fetchSuppliers(params),
    placeholderData: keepPreviousData       
});
};

export default useSuppliers;
