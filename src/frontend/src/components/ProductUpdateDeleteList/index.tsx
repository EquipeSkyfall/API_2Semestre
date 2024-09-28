import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FetchAllProducts from '../../Hooks/Products/fetchAllProductsHook';
import useUpdateProduct from '../../Hooks/Products/patchByIdProductHook';
import useDeleteProduct from '../../Hooks/Products/deleteProductByIdHook';
import { ProductSchema, productSchema } from '../ProductForm/ProductSchema/productSchema';
import Modal from '../Modal/index';
import ProductForm from '../ProductForm';
import SearchBar from '../SearchBar';
 // Import the SearchBar component

interface Product extends ProductSchema {
    id: number;
    url_image?: string | null | undefined;
}

const ProductsUpdateAndDelete: React.FC = () => {
    const { data: products, isLoading, isError, error, refetch } = FetchAllProducts();
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

    // Open modal for editing product
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Handle updating product
    const handleUpdate = async (updatedProduct: Product) => {
        try {
            await updateProductMutation.mutateAsync(updatedProduct);
            setIsModalOpen(false);
            refetch();
            setSuccessMessage('Product updated successfully!');
        } catch (error) {
            const err = error as Error;
            setErrorMessage(`Error updating product: ${err.message}`);
        }
    };

    // Handle deleting product
    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            try {
                await deleteProductMutation.mutateAsync(id);
                refetch();
                setSuccessMessage('Product deleted successfully!');
            } catch (error) {
                const err = error as Error;
                alert(`Failed to delete product: ${err.message}`);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    // Filter products based on search term
    const filteredProducts = products?.filter((product: Product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex gap-x-80'>
            <ProductForm refetch={refetch} />

            <div className='flex flex-col items-center border'>
                <h1 className='border'>Produtos</h1>
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                {/* Include the SearchBar component */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                
                <ul>
                    {filteredProducts?.map((product: Product) => (
                        <li key={product.id}>
                            <span>{product.product_name}</span>
                            <button onClick={() => handleEdit(product)}>Edit</button>
                            <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Render modal and pass the editing product */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingProduct && (
                    <EditProduct 
                        product={editingProduct} 
                        onUpdate={handleUpdate} 
                        onClose={() => setIsModalOpen(false)} 
                    />
                )}
            </Modal>
        </div>
    );
};

const EditProduct: React.FC<{ 
    product: Product; 
    onUpdate: (product: Product) => void; 
    onClose: () => void; 
}> = ({ product, onUpdate, onClose }) => {
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors } 
    } = useForm<Product>({
        resolver: zodResolver(productSchema),
        defaultValues: product,
    });

    const onSubmit = async (formData: Product) => {
        const preparedData = {
            ...formData,
            id: product.id,
            quantity: Number(formData.quantity),
            url_image: formData.url_image ?? undefined,
            price: Number(formData.price),
            retail_price: Number(formData.retail_price),
            weight: Number(formData.weight),
            height: Number(formData.height),
            width: Number(formData.width),
            id_category: formData.id_category ? Number(formData.id_category) : undefined,
            id_sector: formData.id_sector ? Number(formData.id_sector) : undefined,
        };

        await onUpdate(preparedData);
    };

    useEffect(() => {
        (Object.keys(product) as (keyof Product)[]).forEach((key) => {
            setValue(key, product[key]);
        });
    }, [product, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Edit Product</h2>
            {Object.keys(productSchema.shape).map((key) => {
                const keyAsType = key as keyof Product;
                return (
                    <div key={key}>
                        <label>
                            {key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase())}:
                            <input {...register(keyAsType)} />
                        </label>
                        {errors[keyAsType] && <p style={{ color: 'red' }}>{errors[keyAsType]?.message}</p>}
                    </div>
                );
            })}
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
};

export default ProductsUpdateAndDelete;
