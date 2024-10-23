import React, { useEffect, useState } from 'react';
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
    const [precoVenda, setPrecoVenda] = useState<string>('');
    const methods = useForm<Product>({
        resolver: zodResolver(productSchema),
        defaultValues: product, // Definindo valores iniciais do formulário
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = methods;

    useEffect(() => {
        if (product) {
            // Initialize the state with the product's preco_venda formatted for display
            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(product.preco_venda);
            
            setPrecoVenda(formattedPrice);
            // Set the value in the form as a number (not formatted)
            setValue('preco_venda', Number(product.preco_venda));
        }
    }, [product, setValue]);

    const handlePrecoVendaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
    
        // Replace invalid characters and prepare for formatting
        const numericValue = value.replace(/\D/g, '');
    
        // Format as BRL currency
        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(parseFloat(numericValue) / 100);
    
        // Set the formatted currency string to state
        setPrecoVenda(formattedValue);
    
        // Calculate precoNumber from the numericValue directly
        const precoNumber = parseFloat(numericValue) / 100; // Convert to number
    
        // Check if precoNumber is valid and set the Zod error if not
        if (isNaN(precoNumber) || precoNumber <= 0) {
            return;
        }
        
        // Use setValue to set the parsed value in react-hook-form
        setValue('preco_venda', precoNumber);
    };

    const onSubmit = async (formData: Product) => {
        switch (formData.unidade_medida) {
            case "g":
                if (formData.peso_produto > 999) {
                    formData.unidade_medida = "kg";
                    formData.peso_produto /= 1000;
                }
                break;
            case "kg":
                if (formData.peso_produto < 1) {
                    formData.unidade_medida = "g";
                    formData.peso_produto *= 1000;
                }
                break;
            case "ml":
                if (formData.peso_produto > 999) {
                    formData.unidade_medida = "L";
                    formData.peso_produto /= 1000;
                }
                break;
            case "L":
                if (formData.peso_produto < 1) {
                    formData.unidade_medida = "ml";
                    formData.peso_produto *= 1000;
                }
        }

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
                        .filter(key => key !== 'id_categoria' &&
                                key !== 'id_setor' &&
                                key !== 'unidade_medida' &&
                                key !== 'peso_produto' &&
                                key !== 'id_fornecedor' && key !== 'preco_custo'
                        ).map((key) => {
                            const keyAsType = key as keyof Product;
                            const isNumericField = ['preco_venda', 'altura_produto', 'largura_produto', 'comprimento_produto', 'peso_produto'].includes(key);

                            return (
                                <div key={key} className="custom-form-group">
                                    <label htmlFor={keyAsType} className="form-label">
                                        {key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())}:
                                    </label>
                                    {key === 'preco_venda' ? (
                                        <input
                                            id={keyAsType}
                                            value={precoVenda} // Use the state variable for formatted value
                                            onChange={handlePrecoVendaChange} // Use the custom change handler
                                            type="text"
                                            placeholder="Formato: R$ 0,00"
                                            className="form-input"
                                        />
                                    ) : key === 'descricao_produto' ? (
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
                        })
                    }
                    {/* Botões de Unidade de Medida */}
                    <div key={'peso_produto'} className="custom-form-group">
                        <label htmlFor="peso_produto" className="form-label">
                            Peso Produto:
                            <input
                                id="peso_produto"
                                {...register("peso_produto", {
                                    valueAsNumber: true,
                                    setValueAs: product.peso_produto ? product.peso_produto : ''
                                })}
                                type='number'
                                step="0.01"
                                className='form-input'
                            />
                            <select
                                {...register("unidade_medida")}
                                defaultValue={product.unidade_medida}
                                className="unit-select"
                            >
                                <option value="kg">KG</option>
                                <option value="g">G</option>
                                <option value="L">L</option>
                                <option value="ml">ML</option>
                            </select>
                            {errors['peso_produto'] && <p className="error-message">{errors['peso_produto']?.message}</p>}
                        </label>
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
