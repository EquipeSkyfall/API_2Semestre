import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { productSchema, ProductSchema } from './ProductSchema/productSchema';
import CreateProductMutation from '../../Hooks/Products/postProductCreationHook';
import CategorySelect from '../CategorySelect';
import CategoryModal from '../CategoryModal';
import SectorSelect from '../SectorSelect';
import SectorModal from '../SectorModal';
import './styles.css';  // Referência ao CSS

interface ProductFormProps {
    refetch: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ refetch }) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
    const [precoVenda, setPrecoVenda] = useState<string>('');
    const methods = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, setValue } = methods

    const [unidadeMedida, setUnidadeMedida] = useState<'kg' | 'g' | 'L' | 'ml'>('kg'); // Default unit is kg

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
            setError('preco_venda', { type: 'manual', message: 'Preço de Venda é obrigatório.' });
            return;
        }
        
        // Use setValue to set the parsed value in react-hook-form
        setValue('preco_venda', precoNumber);
    };

    useEffect(() => {
        console.log("Current unidadeMedida:", unidadeMedida);
    }, [unidadeMedida]);

    const onSuccess = () => {
        reset();
        setPrecoVenda('')
        setSuccessMessage('Produto Cadastrado com Sucesso!');
        refetch();
    };

    const mutation = CreateProductMutation(onSuccess, setError, setServerError);

    const onSubmit = (data: ProductSchema) => {
        setServerError(null);
        setSuccessMessage(null);

        switch (data.unidade_medida) {
            case "g":
                if (data.peso_produto > 999) {
                    data.unidade_medida = "kg";
                    data.peso_produto /= 1000;
                }
                break;
            case "kg":
                if (data.peso_produto < 1) {
                    data.unidade_medida = "g";
                    data.peso_produto *= 1000;
                }
                break;
            case "ml":
                if (data.peso_produto > 999) {
                    data.unidade_medida = "L";
                    data.peso_produto /= 1000;
                }
                break;
            case "L":
                if (data.peso_produto < 1) {
                    data.unidade_medida = "ml";
                    data.peso_produto *= 1000;
                }
        }

        mutation.mutate(data);
    };

    const onError = (errors: any) => {
        console.error('Zod validation errors:', errors);
    };

    return (
        <div>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="product-form"
                >
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {serverError && <p className="error-message">{serverError}</p>}

                    <h2>Registro de Produtos</h2>

                    <div className="form-fields-grid">
                        {/* Campos Obrigatórios */}
                        <div className="form-field required">
                            <label htmlFor="nome_produto">Nome do Produto</label>
                            <input
                                {...register("nome_produto")}
                                type='text'
                                id="nome_produto"
                                placeholder="Obrigatório"
                            />
                            {errors.nome_produto && <p className="error-message">{errors.nome_produto.message}</p>}
                        </div>

                        <div className="form-field required">
                            <label htmlFor="preco_venda">Preço de Venda</label>
                            <input
                                type="text" // Change type to text
                                id="preco_venda"
                                value={precoVenda}
                                onChange={handlePrecoVendaChange}
                                placeholder="Obrigatório"
                            />
                            {errors.preco_venda && <p className="error-message">{errors.preco_venda.message}</p>}
                        </div>

                        <div className="form-field required">
                            <label htmlFor="altura_produto">Altura (cm)</label>
                            <input
                                {...register("altura_produto", { valueAsNumber: true })}
                                type='number'
                                id="altura_produto"
                                placeholder="Obrigatório"
                                min='0'
                            />
                            {errors.altura_produto && <p className="error-message">{errors.altura_produto.message}</p>}
                        </div>

                        <div className="form-field required">
                            <label htmlFor="largura_produto">Largura (cm)</label>
                            <input
                                {...register("largura_produto", { valueAsNumber: true })}
                                type='number'
                                id="largura_produto"
                                placeholder="Obrigatório"
                                min='0'
                            />
                            {errors.largura_produto && <p className="error-message">{errors.largura_produto.message}</p>}
                        </div>

                        <div className="form-field required">
                            <label htmlFor="comprimento_produto">Comprimento (cm)</label>
                            <input
                                {...register("comprimento_produto", { valueAsNumber: true })}
                                type='number'
                                id="comprimento_produto"
                                placeholder="Obrigatório"
                                min='0'
                            />
                            {errors.comprimento_produto && <p className="error-message">{errors.comprimento_produto.message}</p>}
                        </div>

                        <div className="form-field required">
                            <label htmlFor="peso_produto">Peso</label>
                            <div className="peso-container">
                                <input
                                    {...register("peso_produto", { valueAsNumber: true })}
                                    type='number'
                                    id="peso_produto"
                                    placeholder="Obrigatório"
                                    min='0'
                                />
                                <select
                                    {...register("unidade_medida")}
                                    value={unidadeMedida}
                                    onChange={(e) => setUnidadeMedida(e.target.value as 'kg' | 'g' | 'L' | 'ml')}
                                    className="unit-select"
                                >
                                    <option value="kg">KG</option>
                                    <option value="g">G</option>
                                    <option value="L">L</option>
                                    <option value="ml">ML</option>
                                </select>
                            </div>

                            {errors.peso_produto && <p className="error-message">{errors.peso_produto.message}</p>}
                        </div>


                        {/* Campos Opcionais */}
                        <div className="form-field optional">
                            <label htmlFor="descricao_produto">Descrição do Produto</label>
                            <input
                                {...register("descricao_produto")}
                                type='text'
                                id="descricao_produto"
                                placeholder="Opcional"
                            />
                            {errors.descricao_produto && <p className="error-message">{errors.descricao_produto.message}</p>}
                        </div>

                        <div className="form-field optional">
                            <label htmlFor="marca_produto">Marca do Produto</label>
                            <input
                                {...register("marca_produto")}
                                type='text'
                                id="marca_produto"
                                placeholder="Opcional"
                            />
                            {errors.marca_produto && <p className="error-message">{errors.marca_produto.message}</p>}
                        </div>

                        <div className="form-field optional">
                            <label htmlFor="modelo_produto">Modelo do Produto</label>
                            <input
                                {...register("modelo_produto")}
                                type='text'
                                id="modelo_produto"
                                placeholder="Opcional"
                            />
                            {errors.modelo_produto && <p className="error-message">{errors.modelo_produto.message}</p>}
                        </div>

                        <div className="form-field optional">
                            <label htmlFor="localizacao_estoque">Localização no Estoque</label>
                            <input
                                {...register("localizacao_estoque")}
                                type='text'
                                id="localizacao_estoque"
                                placeholder="Opcional"
                            />
                            {errors.localizacao_estoque && <p className="error-message">{errors.localizacao_estoque.message}</p>}
                        </div>

                        {/* Selecione uma Categoria */}
                        <div className="form-field">
                            <CategorySelect refetch={refetch} />
                            <button
                                type="button"
                                className="manage-button"
                                onClick={() => setIsCategoryModalOpen(true)}
                            >
                                Gerenciar Categorias
                            </button>
                        </div>

                        {/* Selecione um Setor */}
                        <div className="form-field">
                            <SectorSelect refetch={refetch} />
                            <button
                                type="button"
                                className="manage-button"
                                onClick={() => setIsSectorModalOpen(true)}
                            >
                                Gerenciar Setores
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
                    </button>
                </form>
            </FormProvider>

            {/* Modais */}
            {isCategoryModalOpen && (
                <CategoryModal
                    setIsCategoryModalOpen={setIsCategoryModalOpen}
                    refetch={refetch}
                />
            )}
            {isSectorModalOpen && (
                <SectorModal
                    setIsSectorModalOpen={setIsSectorModalOpen}
                    refetch={refetch}
                />
            )}
        </div>
    );
}

export default ProductForm;
