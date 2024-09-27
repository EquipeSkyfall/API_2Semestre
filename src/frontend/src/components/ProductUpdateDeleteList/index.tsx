import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { useForm } from 'react-hook-form';
import FetchAllProducts from '../../Hooks/Products/fetchAllProductsHook'; // Fetch products hook
import useUpdateProduct from '../../Hooks/Products/patchByIdProductHook'; // Update product hook
import useDeleteProduct from '../../Hooks/Products/deleteProductByIdHook'; // Delete product 
import { ProductSchema, productSchema } from '../ProductForm/ProductSchema/productSchema'; // Zod schema
import Modal from '../Modal/index'; // Modal component
import ProductForm from '../ProductForm';

// Extending the Product interface with the Zod schema
interface Product extends ProductSchema {
    id: number;
    url_image?: string | null | undefined;
}

const ProductsUpdateAndDelete: React.FC = () => {
    const { data: products, isLoading, isError, error, refetch } = FetchAllProducts(); // Fetching all products
    const updateProductMutation = useUpdateProduct(); // Mutation for updating product
    const deleteProductMutation = useDeleteProduct(); // Mutation for deleting product
    const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Holds the product to edit
    const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal state
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Open modal for editing product
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Handle updating product
    const handleUpdate = async (updatedProduct: Product) => {
        try {
            await updateProductMutation.mutateAsync(updatedProduct);//Não liguem pra esse "erro", isso é só o TS sendo irritante
            setIsModalOpen(false); // Close modal on success
            refetch(); // Refetch products to update the list
            setSuccessMessage('Product updated successfully!'); // Notify user of success
        } catch (error) {
            const err = error as Error; // Type assertion
            setErrorMessage(`Error updating product: ${err.message}`); // Notify user of error
        }
    };

    // Handle deleting product
    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            try {
                await deleteProductMutation.mutateAsync(id);
                refetch(); // Update the product list after deletion
                setSuccessMessage('Product deleted successfully!'); // Notify user of successful deletion
            } catch (error) {
                const err = error as Error; // Type assertion
                alert(`Failed to delete product: ${err.message}`); // Notify user of error
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div className='flex gap-x-80'>
            <ProductForm refetch={refetch} />
           
           <div className='flex flex-col items-center border '>

            <h1 className='border'>Produtos</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <ul>
                {products?.map((product: Product) => (
                    <li key={product.id}>
                        <span>{product.product_name}</span>
                        <button onClick={() => handleEdit(product)}>Edit</button>
                        <button onClick={() => handleDelete(product.id)}>Delete</button> {/* Delete button */}
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
            {/* Display success or error messages */}
           
        </div>
    );
};

const EditProduct: React.FC<{ 
    product: Product; 
    onUpdate: (product: Product) => void; 
    onClose: () => void; 
}> = ({ product, onUpdate, onClose }) => {
    
    // React Hook Form with Zod validation
    const { 
        register, 
        handleSubmit, 
        setValue, 
        formState: { errors } 
    } = useForm<Product>({
        resolver: zodResolver(productSchema), // Use Zod resolver for validation
        defaultValues: product, // Set initial values from the passed product
    });

    // Submit handler for updating product
    const onSubmit = async (formData: Product) => {
        // Prepare data for submission, converting strings to numbers where necessary
        const preparedData = {
            ...formData,
            id: product.id, // Ensure product ID stays the same
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

        // Call onUpdate with the validated and prepared data
        await onUpdate(preparedData);
    };

    // Set the form values when product changes
    useEffect(() => {
        (Object.keys(product) as (keyof Product)[]).forEach((key) => {
            setValue(key, product[key]); // This is now type-safe
        });
    }, [product, setValue]);

    return (
        <>
        
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Edit Product</h2>
            {/* Dynamically render form fields based on product schema */}
            {Object.keys(productSchema.shape).map((key) => {
                const keyAsType = key as keyof Product;
                return (
                    <div key={key}>
                        <label>
                            {key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase())}:
                            <input {...register(keyAsType)} /> {/* Register each field */}
                        </label>
                        {errors[keyAsType] && <p style={{ color: 'red' }}>{errors[keyAsType]?.message}</p>}
                    </div>
                );
            })}
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
        </>
    );
};

export default ProductsUpdateAndDelete;
