import React, { useState } from 'react';
import useSearchProducts from '../../Hooks/Products/getSearchProductbyNameHook'; 
import useDeleteProduct from '../../Hooks/Products/deleteProductByIdHook';
import ProductForm from '../ProductForm';
import Modal from '../Modal';
import EditProduct from './EditProduct'; 
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';
import useUpdateProduct from '../../Hooks/Products/patchByIdProductHook';
import ProductList from '../ProductsList';
import SearchBar from '../SearchBar';

interface Product extends ProductSchema {
    id: number;
    url_image?: string | null | undefined;
}

const ProductsUpdateAndDelete: React.FC = () => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Keep searchTerm state here
    const itemsPerPage = 10;

    const { products, refetch, isLoading, isError } = useSearchProducts(currentPage, itemsPerPage, searchTerm);

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
            setSuccessMessage('Product updated successfully!');
            refetch(); // Refetch products after update
        } catch (error) {
            const err = error as Error;
            setErrorMessage(`Error updating product: ${err.message}`);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            try {
                await deleteProductMutation.mutateAsync(id);
                setSuccessMessage('Product deleted successfully!');
                refetch(); // Refetch products after deletion
            } catch (error) {
                const err = error as Error;
                alert(`Failed to delete product: ${err.message}`);
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        refetch(); // Refetch when page changes
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: Unable to fetch products.</div>;

    return (
        <div className='flex gap-x-80'>
            <ProductForm refetch={refetch} />

            <div className='flex flex-col items-center border'>
                <h1 className='border'>Products</h1>
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <ProductList
                    products={products}
                    onEdit={handleEdit}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onDeleteSuccess={refetch}
                />
            </div>

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
