// src/components/SearchBar2.tsx
import React, { useState } from 'react';
import FetchAllProducts from '../../Hooks/Products/fetchAllProductsHook'; // Hook to fetch all products

const SearchBar2: React.FC = () => {
    const { data: products } = FetchAllProducts(); // Fetch all products
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

    // Filter products based on search term
    const filteredProducts = products?.filter(product => 
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Search Products</h2>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <div>
                {filteredProducts?.length ? (
                    <ul>
                        {filteredProducts.map(product => (
                            <li key={product.id}>{product.product_name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default SearchBar2;
