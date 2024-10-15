import React, { useState, useCallback } from 'react';
import ProductForm from '../ProductForm';
import ProductsUpdateAndDelete from '../ProductUpdateDeleteList';
import useSearchProducts from '../../Hooks/Products/getSearchProductbyNameHook';
import './styles.css';  // Importe o CSS aqui

// Memoize ProductForm to avoid unnecessary re-renders
const MemoizedProductForm = React.memo(ProductForm);

const ProductsContainer: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const itemsPerPage = 10;

    // Fetch products based on search and pagination
    const { products, totalPages, refetch, isLoading, isError } = useSearchProducts(currentPage, itemsPerPage, searchTerm);

    // Handle search term change without reloading form
    const handleSearchTermChange = useCallback((term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to the first page on new search
    }, []);

    return (
        <div className='product-container'>
            {/* Memoized ProductForm to prevent re-render during search */}
            <div className='product-form-container'>
                <MemoizedProductForm refetch={refetch} />
            </div>

            {/* Product List and Search */}
            <div className='product-list-container'>
                <ProductsUpdateAndDelete
                    products={products}
                    searchTerm={searchTerm}
                    onSearchTermChange={handleSearchTermChange}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    refetch={refetch} // For refreshing list after CUD
                />
            </div>

            {/* Loading and Error Handling */}
            {/* {isLoading && <div>Loading...</div>} */}
            {isError && <div>Error loading products</div>}
        </div>
    );
};

export default ProductsContainer;
