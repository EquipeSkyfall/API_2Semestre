import React from 'react';
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';

interface Product extends ProductSchema {
    id_produto: number;
}

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    currentPage: number;
    handlePageChange: (newPage: number) => void;
    totalPages: number;
    itemsPerPage: number;
    onDelete: (id_produto: number) => void;
}

const ProductList: React.FC<ProductListProps> = React.memo(({
    products,
    onEdit,
    currentPage,
    handlePageChange,
    totalPages,
    itemsPerPage,
    onDelete,
}) => {
    return (
        <div className="product-list">
            <ul>
                {products.length > 0 ? (
                    products.map((product: Product) => (
                        <li key={product.id_produto}>
                            <span>{product.nome_produto}</span>
                            <button onClick={() => onEdit(product)}>Edit</button>
                            <button onClick={() => onDelete(product.id_produto)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <li>No products found</li>
                )}
            </ul>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
});

export default ProductList;
