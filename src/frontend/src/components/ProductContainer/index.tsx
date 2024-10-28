import React, { useState, useCallback } from 'react';
import ProductForm from '../ProductForm';
import ProductsUpdateAndDelete from '../ProductUpdateDeleteList';
import useSearchProducts from '../../Hooks/Products/getSearchProductbyNameHook';
import './styles.css'; // Importando o CSS normal

interface FilterValues {
    search: string;
    id_setor: number | null;
    id_categoria: number | null;
}

// Memoize ProductForm to avoid unnecessary re-renders
const MemoizedProductForm = React.memo(ProductForm);

const ProductsContainer: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null });
    const itemsPerPage = 10;

    // Fetch products based on search and pagination
    const { products, totalPages, refetch, isLoading, isError } = useSearchProducts({...filters, page: currentPage, limit: itemsPerPage});

    // Handle search term change without reloading form
    const handleSearchTermChange = useCallback(
        (term: string, categoryId: number | null, sectorId: number | null) => {
            setFilters({
                search: term,
                id_setor: sectorId,
                id_categoria: categoryId,
            });
            setCurrentPage(1); // Reset to the first page on new search
        },
        []
    );

    return (
        <div className="product-container">
            {/* Memoized ProductForm to prevent re-render during search
            <div className='product-form-container'>
                <MemoizedProductForm refetch={refetch} />
            </div> */}

            {/* Product List and Search */}
            <div className="product-list-container">
                <ProductsUpdateAndDelete
                    products={products}
                    onSearchTermChange={handleSearchTermChange}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    refetch={refetch}
                />
            </div>

            {/* Loading and Error Handling */}
            {/* {isLoading && <div>Loading...</div>} */}
            {isError && <div>Error loading products</div>}
        </div>
    );
};

export default ProductsContainer;
