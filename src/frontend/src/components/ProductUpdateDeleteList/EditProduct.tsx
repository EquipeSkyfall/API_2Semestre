import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, productSchema } from '../ProductForm/ProductSchema/productSchema';
// Adjust the path based on your project structure

interface Product extends ProductSchema {
    id: number;
    url_image?: string | null | undefined;
}

interface EditProductProps {
    product: Product;
    onUpdate: (product: Product) => void;
    onClose: () => void;
    refetch: () => void; // Add refetch prop
}

const EditProduct: React.FC<EditProductProps> = ({ product, onUpdate, onClose, refetch }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
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
        refetch(); // Call refetch after updating
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

export default EditProduct;
