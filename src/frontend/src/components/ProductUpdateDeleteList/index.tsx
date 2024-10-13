import React, { useState } from 'react';
import ProductList from '../ProductsList';
import SearchBar from '../SearchBar';
import Modal from '../Modal';
import EditProduct from './EditProduct';
import useDeleteProduct from '../../Hooks/Products/deleteProductByIdHook';
import useUpdateProduct from '../../Hooks/Products/patchByIdProductHook';
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';

interface Product extends ProductSchema {
    id: number;
    url_image?: string | null | undefined;
}

interface ProductsUpdateAndDeleteProps {
    products: Product[];
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    refetch: () => void; // Pass refetch function
}

const ProductsUpdateAndDelete: React.FC<ProductsUpdateAndDeleteProps> = ({
    products,
    searchTerm,
    onSearchTermChange,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch,
}) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedProduct: Product) => {
        try {
            await updateProductMutation.mutateAsync(updatedProduct);
            setIsModalOpen(false);
            refetch(); // Refetch only after updating
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProductMutation.mutateAsync(id);
                refetch(); // Refetch only after deletion
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className='flex flex-col items-center border'>
            <h1 className='border'>Products</h1>

            {/* Search Bar */}
            <SearchBar searchTerm={searchTerm} setSearchTerm={onSearchTermChange} />

            {/* Product List */}
            <ProductList
                products={products}
                onEdit={handleEdit}
                currentPage={currentPage}
                handlePageChange={setCurrentPage}
                totalPages={totalPages} // Pass totalPages for pagination logic
                onDelete={handleDelete}
                itemsPerPage={10}
            />

            {/* Modal for Editing Product */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingProduct && (
                    <EditProduct
                        product={editingProduct}
                        onUpdate={handleUpdate}
                        onClose={() => setIsModalOpen(false)}
                        refetch={refetch}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProductsUpdateAndDelete;
