// src/hooks/useSearchProducts.ts
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useSearchProducts = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { data: products = [], isLoading, isError } = useQuery({
        queryKey: ['searchProducts', searchTerm],
    
        queryFn: () => {
            console.log(searchTerm)
            if (searchTerm.trim() === '') return []; // Return empty array if searchTerm is empty
            return axios.get(`http://127.0.0.1:3000/products/search?product_name=${searchTerm}`).then(res => res.data);
        },
        enabled: !!searchTerm, // Only run query if searchTerm is not empty
        retry: false, // Optionally prevent retry on failure
    });

    return { products, searchTerm, setSearchTerm, isLoading, isError };
};

export default useSearchProducts;
