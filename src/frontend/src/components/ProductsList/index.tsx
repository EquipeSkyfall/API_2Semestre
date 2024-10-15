import React from 'react';
import './styles.css';  // Importando o arquivo de estilos
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
                        <li key={product.id_produto} className="product-item">
                            <span className="product-name">{product.nome_produto}</span>
                            <button onClick={() => onEdit(product)} className="edit-btn">Edit</button>
                            <button onClick={() => onDelete(product.id_produto)} className="delete-btn">Delete</button>
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
                    className="pagination-btn"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>
        </div>
    );
});

export default ProductList;
