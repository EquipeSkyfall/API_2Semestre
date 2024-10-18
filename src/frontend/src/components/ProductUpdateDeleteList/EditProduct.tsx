import React from 'react';
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
        defaultValues: product, // Definindo valores iniciais do formulário
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = async (formData: Product) => {
        console.log("Dados do formulário ao enviar:", formData);

        if (!formData.id_categoria) formData.id_categoria = null;
        if (!formData.id_setor) formData.id_setor = null;

        const preparedData = {
            ...formData,
            id_produto: product.id_produto,
        };

        console.log("Dados preparados antes de enviar para onUpdate:", preparedData);

        try {
            await onUpdate(preparedData);  // Atualiza o produto
            console.log('Produto atualizado com sucesso!');
            refetch();  // Refaz a consulta para atualizar a lista de produtos
            onClose();  // Fecha o modal após a atualização
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
            alert('Falha ao atualizar produto. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="custom-modal-container">
            <FormProvider {...methods}>
                <form className="custom-edit-product-form" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="form-header">Editar Produto</h2>

                    {/* Itera pelos campos principais, excluindo 'id_categoria', 'id_setor' e 'unidade_medida' */}
                    {Object.keys(productSchema.shape)
                        .filter(key => key !== 'id_categoria' && key !== 'id_setor' && key !== 'unidade_medida')
                        .map((key) => {
                            const keyAsType = key as keyof Product;
                            const isNumericField = ['preco_venda', 'altura_produto', 'largura_produto', 'comprimento_produto', 'peso_produto'].includes(key);

                            return (
                                <div key={key} className="custom-form-group">
                                    <label htmlFor={keyAsType} className="form-label">
                                        {key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())}:
                                    </label>
                                    {key === 'descricao_produto' ? (
                                        <textarea
                                            id={keyAsType}
                                            {...register(keyAsType)}
                                            rows={6} // Ajuste o número de linhas para controlar a altura
                                        />
                                    ) : (
                                        <input
                                            id={keyAsType}
                                            {...register(keyAsType, {
                                                valueAsNumber: isNumericField,
                                                setValueAs: (value) => value === '' ? null : value,
                                            })}
                                            type={isNumericField ? 'number' : 'text'}
                                            step="0.01"
                                            className="form-input"
                                        />
                                    )}
                                    {errors[keyAsType] && <p className="error-message">{errors[keyAsType]?.message}</p>}
                                </div>
                            );
                        })}
                    {/* Botões de Unidade de Medida */}
                    <div className="custom-form-group">
                        <label className="form-label">Unidade de Medida:</label>
                        <div className="unit-radio-buttons">
                            {['kg', 'g', 'L', 'ml'].map(unit => (
                                <label key={unit} className="unit-radio-label">
                                    <input
                                        type="radio"
                                        {...register("unidade_medida")}
                                        value={unit}
                                        defaultChecked={product.unidade_medida === unit} // Definindo estado inicial
                                        className="unit-radio-input"
                                    />
                                    {unit}
                                </label>
                            ))}
                        </div>
                    </div>

                    <CategorySelect refetch={refetch} defaultValue={product.id_categoria} />
                    <SectorSelect refetch={refetch} defaultValue={product.id_setor} />

                    <div className="form-actions">
                        <button type="submit" className="custom-btn-primary">Atualizar</button>
                        <button type="button" className="custom-btn-secondary" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default EditProduct;
