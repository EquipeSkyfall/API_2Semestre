import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {  useLocation, useNavigate } from 'react-router-dom';  // Ensure this is imported if you’re navigating on error

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

const fetchSuppliers = async (params: QueryParams,navigate: ReturnType<typeof useNavigate>,
  location: ReturnType<typeof useLocation>) => {
  
  try {
    const response = await axios.get<SuppliersResponse>('http://127.0.0.1:3000/suppliers', {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response;

      // Handle unauthorized access
      if (errorResponse?.status === 401) {
        console.log('Unauthorized access - redirecting or handling as necessary');
        sessionStorage.clear();
        navigate('/', { state: { from: location }, replace: true });
      }

      // Log error details
      console.error('Error status:', errorResponse?.status);
      console.error('Error message:', errorResponse?.data?.message || 'No message available');
      throw new Error(errorResponse?.data?.message || 'An error occurred while fetching suppliers');
    } else {
      console.error('An unknown error occurred:', error);
      throw new Error('An unknown error occurred');
    }
  }
};

const useSuppliers = (params: QueryParams) => {
  const navigate = useNavigate();
    const location = useLocation();
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => fetchSuppliers(params,navigate,location),
    placeholderData: keepPreviousData,
  });
};

export default useSuppliers;
