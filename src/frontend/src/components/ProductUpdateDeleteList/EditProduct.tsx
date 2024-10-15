import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, productSchema } from '../ProductForm/ProductSchema/productSchema';

interface Product extends ProductSchema {
    id_produto: number;
    // url_image?: string | null | undefined | '';
}

interface EditProductProps {
    product: Product;
    onUpdate: (product: Product) => void;
    onClose: () => void;
    refetch: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onUpdate, onClose, refetch }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Product>({
        resolver: zodResolver(productSchema),
        defaultValues: product, // Set initial form values
    });

    const onSubmit = async (formData: Product) => {
        console.log("Form data on submit:", formData); // Verifique os dados do formulário aqui

        if (!formData.id_categoria) formData.id_categoria = null;
        if (!formData.id_setor) formData.id_setor = null;

        const preparedData = {
            ...formData,
            id_produto: product.id_produto,
        };

        console.log("Prepared data before sending to onUpdate:", preparedData); // Verifique os dados antes de chamar onUpdate

        try {
            await onUpdate(preparedData);  // Verifique se onUpdate está funcionando corretamente
            console.log('Product updated successfully!');
            refetch();
            onClose();  // Fechar o modal após a atualização
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again later.');
        }
    };

    useEffect(() => {
        console.log("Setting form values from product:", product); // Verifique se os valores estão sendo passados para o formulário
        Object.keys(product).forEach((key) => {
            setValue(key as keyof Product, product[key as keyof Product]);
        });
    }, [product, setValue]);

    return (
        <div className="modal-container">
            <form className="edit-product-form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Edit Product</h2>
                {Object.keys(productSchema.shape).map((key) => {
                    const keyAsType = key as keyof Product;
                    const isNumericField = ['preco_venda', 'altura_produto', 'largura_produto', 'comprimento_produto', 'peso_produto'].includes(key);

                    return (
                        <div key={key} className="form-group">
                            <label htmlFor={keyAsType}>
                                {key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())}:
                            </label>
                            <input
                                id={keyAsType}
                                {...register(keyAsType, {
                                    valueAsNumber: isNumericField, // Parse para número
                                    setValueAs: (value) => {
                                        if (key === 'id_categoria' || key === 'id_setor') {
                                            return value === '' ? null : value; // Force null for id_categoria and id_setor if empty
                                        }
                                        return value; // Default behavior for other fields
                                    },
                                })}
                                type={isNumericField ? 'number' : 'text'}
                            />
                            {errors[keyAsType] && <p className="error-message">{errors[keyAsType]?.message}</p>}
                        </div>
                    );
                })}
                <div className="form-actions">
                    <button type="submit" className="btn-primary">Update</button>
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
