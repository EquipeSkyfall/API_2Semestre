import React from 'react';
import useDeleteProduct from '../../Hooks/Products/deleteProductByIdHook';
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';

interface Product extends ProductSchema {
    id: number;
    url_image?: string | null | undefined;
}

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    currentPage: number;
    handlePageChange: (newPage: number) => void;
    itemsPerPage: number;
    onDeleteSuccess: () => void; // New prop for handling delete success
}

const ProductList: React.FC<ProductListProps> = React.memo(({
    products,
    onEdit,
    currentPage,
    handlePageChange,
    itemsPerPage,
    onDeleteSuccess,
}) => {
    const deleteProductMutation = useDeleteProduct();

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            try {
                await deleteProductMutation.mutateAsync(id);
                onDeleteSuccess(); // Call the delete success function
            } catch (error) {
                const err = error as Error;
                alert(`Failed to delete product: ${err.message}`);
            }
        }
    };

    return (
        <div className="product-list">
            <ul>
                {products.length > 0 ? (
                    products.map((product: Product) => (
                        <li key={product.id}>
                            <span>{product.product_name}</span>
                            <button onClick={() => onEdit(product)}>Edit</button>
                            <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <li>No products found</li>
                )}
            </ul>

            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={products.length < itemsPerPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
});

export default ProductList;
