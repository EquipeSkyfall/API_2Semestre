import React, { useState, useCallback } from 'react';
import ProductForm from '../ProductForm';
import ProductsUpdateAndDelete from '../ProductUpdateDeleteList';
import useSearchProducts from '../../Hooks/Products/getSearchProductbyNameHook';

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
        <div className='flex gap-x-80 justify-around'>
            {/* Memoized ProductForm to prevent re-render during search */}
            <MemoizedProductForm refetch={refetch} />

            {/* Product List and Search */}
          <span className='max-w-200'>

            <ProductsUpdateAndDelete
                products={products}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                refetch={refetch} // For refreshing list after CUD
                />
                </span>

            {/* Loading and Error Handling */}
            {/* {isLoading && <div>Loading...</div>} */}
            {isError && <div>Error loading products</div>}
        </div>
    );
};

export default ProductsContainer;
