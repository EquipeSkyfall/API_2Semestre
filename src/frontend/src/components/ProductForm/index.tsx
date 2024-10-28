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
import SupplierSelect from '../SupplierSelect';
import { useNavigate } from 'react-router-dom';

interface ProductFormProps {
    refetch: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ refetch }) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
    const [fornecedorValue, setFornecedorValue] = useState<number | null>(null);
    const [precoVenda, setPrecoVenda] = useState<string>('');
    const [precoCusto, setPrecoCusto] = useState<string>('');
    const navigate = useNavigate();
    const methods = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, setValue } = methods

    const [unidadeMedida, setUnidadeMedida] = useState<'kg' | 'g' | 'L' | 'ml'>('kg'); // Default unit is kg

    useEffect(() => {
        if (!fornecedorValue) {
            setPrecoCusto('');
            setValue('preco_custo', undefined);
        }
    }, [fornecedorValue]);

    const handleManageSuppliers = () => {
        navigate('/Fornecedor'); // Navigate to the /Fornecedores route
    };

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

    const handlePrecoCustoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Replace invalid characters and prepare for formatting
        const numericValue = value.replace(/\D/g, '');

        // Format as BRL currency
        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(parseFloat(numericValue) / 100);

        // Set the formatted currency string to state
        setPrecoCusto(formattedValue);

        // Calculate precoNumber from the numericValue directly
        const precoNumber = parseFloat(numericValue) / 100; // Convert to number

        // Check if precoNumber is valid and set the Zod error if not
        if (isNaN(precoNumber) || precoNumber <= 0) {
            setError('preco_custo', { type: 'manual', message: 'Preço de custo é obrigatório.' });
            return;
        }

        // Use setValue to set the parsed value in react-hook-form
        setValue('preco_custo', precoNumber);
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
        setServerError('Erro ao cadastrar o produto!');
    };


    return (
        <div>
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="product-form"
                >
                    {successMessage && <p className="success-messages">{successMessage}</p>}
                    {serverError && <p className="error-message">{serverError}</p>}

                    <h1>Registro de Produtos</h1>

                    <div className="form-fields-grid">
                        {/* Campos Obrigatórios */}
                        <div className="form-field required">
                            <label htmlFor="nome_produto">Nome do Produto</label>
                            <input
                                {...register("nome_produto")}
                                type='text'
                                id="nome_produto"
                                placeholder={errors.nome_produto ? errors.nome_produto.message : "Obrigatório"}
                            />
                        </div>

                        <div className="form-field required">
                            <label htmlFor="preco_venda">Preço de Venda</label>
                            <input
                                type="text"
                                id="preco_venda"
                                value={precoVenda}
                                onChange={handlePrecoVendaChange}
                                placeholder={errors.preco_venda ? errors.preco_venda.message : "Obrigatório"}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="preco_custo">Preço de Custo</label>
                            <input
                                type="text"
                                id="preco_custo"
                                value={precoCusto}
                                onChange={handlePrecoCustoChange}
                                disabled={!fornecedorValue}
                                placeholder={errors.preco_custo ? errors.preco_custo.message : "Obrigatório"}
                            />
                        </div>

                        <div className="form-field required">
                            <label htmlFor="peso_produto">Peso</label>
                            <div className="peso-container">
                                <input
                                    {...register("peso_produto", { valueAsNumber: true })}
                                    type='number'
                                    id="peso_produto"
                                    placeholder={errors.peso_produto ? errors.peso_produto.message : "Obrigatório"}
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
                        </div>

                        <div className="form-field required">
                            <label htmlFor="altura_produto">Altura (cm)</label>
                            <input
                                {...register("altura_produto", { valueAsNumber: true })}
                                type='number'
                                id="altura_produto"
                                placeholder={errors.altura_produto ? errors.altura_produto.message : "Obrigatório"}
                                min='0'
                            />
                        </div>

                        <div className="form-field required">
                            <label htmlFor="largura_produto">Largura (cm)</label>
                            <input
                                {...register("largura_produto", { valueAsNumber: true })}
                                type='number'
                                id="largura_produto"
                                placeholder={errors.largura_produto ? errors.largura_produto.message : "Obrigatório"}
                                min='0'
                            />
                        </div>

                        <div className="form-field required">
                            <label htmlFor="comprimento_produto">Comprimento (cm)</label>
                            <input
                                {...register("comprimento_produto", { valueAsNumber: true })}
                                type='number'
                                id="comprimento_produto"
                                placeholder={errors.comprimento_produto ? errors.comprimento_produto.message : "Obrigatório"}
                                min='0'
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="marca_produto">Marca do Produto</label>
                            <input
                                {...register("marca_produto")}
                                type='text'
                                id="marca_produto"
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="modelo_produto">Modelo do Produto</label>
                            <input
                                {...register("modelo_produto")}
                                type='text'
                                id="modelo_produto"
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="localizacao_estoque">Localização no Estoque</label>
                            <input
                                {...register("localizacao_estoque")}
                                type='text'
                                id="localizacao_estoque"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    {/* Campo de descrição fora do grid */}
                    <div className="form-field">
                        <label htmlFor="descricao">Descrição do Produto</label>
                        <textarea
                            id="descricao"
                            {...register('descricao')}
                            className="descricao_produto_lista"
                            placeholder="Descrição do produto"
                        ></textarea>
                    </div>

                    <div className="form-fields-grid-segundo">
                        {/* Selecione uma Categoria */}
                        <div className="form-field-segundo">
                            <CategorySelect refetch={refetch} />
                            {isCategoryModalOpen && (
                                <CategoryModal
                                    setIsCategoryModalOpen={setIsCategoryModalOpen}
                                    refetch={refetch}
                                />
                            )}
                            <button
                                type="button"
                                className="manage-categoria-button"
                                onClick={() => setIsCategoryModalOpen(true)}
                            >
                                Gerenciar Categorias
                            </button>
                        </div>

                        {/* Selecione um Setor */}
                        <div className="form-field-segundo">
                            <SectorSelect refetch={refetch} />
                            {isSectorModalOpen && (
                                <SectorModal
                                    setIsSectorModalOpen={setIsSectorModalOpen}
                                    refetch={refetch}
                                />
                            )}
                            <button
                                type="button"
                                className="manage-categoria-button"
                                onClick={() => setIsSectorModalOpen(true)}
                            >
                                Gerenciar Setores
                            </button>
                        </div>

                        {/* Selecione um Fornecedor */}
                        <div className="form-field-segundo">
                            <SupplierSelect refetch={refetch} onChange={setFornecedorValue} />
                            <button
                                type="button"
                                className="manage-categoria-button"
                                onClick={handleManageSuppliers}
                            >
                                Gerenciar Fornecedores
                            </button>
                        </div>
                    </div>
                    <div class="button-container">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
                        </button>
                    </div>

                </form>
            </FormProvider>
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
