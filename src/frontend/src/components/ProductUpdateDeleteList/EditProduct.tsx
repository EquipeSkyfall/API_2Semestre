import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, productSchema } from '../ProductForm/ProductSchema/productSchema';
import SectorSelect from '../SectorSelect';
import CategorySelect from '../CategorySelect';
import './productupdatedeletelist.css'


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
            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(product.preco_venda);

            setPrecoVenda(formattedPrice);
            setValue('preco_venda', Number(product.preco_venda));
        }
    }, [product, setValue]);

    const handlePrecoVendaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const numericValue = value.replace(/\D/g, '');
        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(parseFloat(numericValue) / 100);

        setPrecoVenda(formattedValue);
        const precoNumber = parseFloat(numericValue) / 100;

        if (isNaN(precoNumber) || precoNumber <= 0) {
            return;
        }

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

        if (!formData.id_categoria) formData.id_categoria = null;
        if (!formData.id_setor) formData.id_setor = null;

        const preparedData = {
            ...formData,
            id_produto: product.id_produto,
        };

        try {
            await onUpdate(preparedData);
            refetch();
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
            alert('Falha ao atualizar produto. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="overlay-fundo">
            <FormProvider {...methods}>
                <form className="conteudo-modal-edit" onSubmit={handleSubmit(onSubmit)}>
                <button className="botao-fechar-produto" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                    <h2 className="form-header">Editar Produto</h2>

                    {/* Campos principais */}
                    {Object.keys(product).filter((key) =>
                        key !== 'id_categoria' &&
                        key !== 'id_setor' &&
                        key !== 'unidade_medida' &&
                        key !== 'peso_produto' &&
                        key !== 'id_fornecedor' &&
                        key !== 'preco_custo' &&
                        key !== 'unidade_medida' &&
                        key !== 'produto_deletedAt' &&
                        key !== 'id_produto' &&
                        key !== 'permalink_imagem' &&
                        key !== 'total_estoque' &&
                        key !== 'categoria' &&
                        key !== 'setor' &&
                        key !== 'nome_categoria' &&
                        key !== 'nome_setor' &&
                        key !== 'descricao_produto' // Removido a descrição do topo
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

                    {/* Campos de Peso e Unidade de Medida */}
                    <div key={'peso_produto'} className="peso-container1">
                        <label htmlFor="peso_produto" className="form-label">
                            Peso Produto:
                            <div className="peso-container1">
                                <input
                                    id="peso_produto"
                                    {...register("peso_produto", {
                                        valueAsNumber: true,
                                        setValueAs: product.peso_produto ? product.peso_produto : ''
                                    })}
                                    type='number'
                                    step="0.01"
                                    className='form-input1'
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
                            </div>
                            {errors['peso_produto'] && <p className="error-message">{errors['peso_produto']?.message}</p>}
                        </label>
                    </div>



                    {/* Só a descrição do produto que está no final do formulário */}
                    <div key={'descricao_produto'} className="custom-non-form-group">
                        <label htmlFor="descricao_produto" className="form-label">
                            Descrição Produto:
                        </label>
                        <textarea
                            id="descricao_produto"
                            {...register('descricao_produto')}
                            rows={6} // Ajuste o número de linhas para controlar a altura
                            className="descricao_produto_lista" // Pode definir uma classe CSS específica para estilo
                        />
                        {errors['descricao_produto'] && <p className="error-message">{errors['descricao_produto']?.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoria" className="form-label"></label>
                        <CategorySelect refetch={refetch} defaultValue={product.id_categoria} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="setor" className="form-label"></label>
                        <SectorSelect refetch={refetch} defaultValue={product.id_setor} />
                    </div>


                    <div className="form-actions">
                        <button type="button" className="custom-btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="custom-btn-primary">Atualizar</button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );



};

export default EditProduct;
