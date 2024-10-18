import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, productSchema } from '../ProductForm/ProductSchema/productSchema';
import SectorSelect from '../SectorSelect';
import CategorySelect from '../CategorySelect';

interface Product extends ProductSchema {
    id_produto: number;
}

interface EditProductProps {
    product: Product;
    onUpdate: (product: Product) => void;
    onClose: () => void;
    refetch: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onUpdate, onClose, refetch }) => {
    const methods = useForm<Product>({
                        resolver: zodResolver(productSchema),
                        defaultValues: product, // Set initial form values
                    });
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = methods

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
            <FormProvider {...methods}>
                <form className="edit-product-form" onSubmit={handleSubmit(onSubmit)}>
                    <h2>Edit Product</h2>

                    {Object.keys(productSchema.shape)
                    .filter(key => key !== 'id_categoria' && key !== 'id_setor' && key !== 'unidade_medida')  // Exclude category and sector fields
                    .map((key) => {
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
                                valueAsNumber: isNumericField,
                                setValueAs: (value) => value === '' ? null : value,
                            })}
                            type={isNumericField ? 'number' : 'text'}
                            step="0.01"
                            />
                            {errors[keyAsType] && <p className="error-message">{errors[keyAsType]?.message}</p>}
                        </div>
                        );
                    })}
                    {/* Unit Measure Radio Buttons */}
                    <div className="form-group">
                        <label>Unidade de Medida:</label>
                        <div>
                            {['kg', 'g', 'L', 'ml'].map(unit => (
                                <label key={unit}>
                                    <input
                                        type="radio"
                                        {...register("unidade_medida")}
                                        value={unit}
                                        defaultChecked={product.unidade_medida === unit} // Set the default checked state
                                    />
                                    {unit}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Add the Category and Sector dropdowns */}
                    <CategorySelect refetch={refetch} defaultValue={product.id_categoria} />
                    <SectorSelect refetch={refetch} defaultValue={product.id_setor} />

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Update</button>
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default EditProduct;
