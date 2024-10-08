// ProductForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { productSchema, ProductSchema } from './ProductSchema/productSchema';
import CreateProductMutation from '../../Hooks/Products/postProductCreationHook';

interface ProductFormProps {
    refetch: () => void; // Add refetch function as a prop
}

const ProductForm: React.FC<ProductFormProps> = ({ refetch }) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
    });

    console.log('FORM')
    const onSuccess = () => {
        reset();
        setSuccessMessage('Product Created successfully!');
        refetch(); // Call refetch after product creation
    };

    const mutation = CreateProductMutation(onSuccess, setError, setServerError);

    const onSubmit = (data: ProductSchema) => {
        setServerError(null);
        setSuccessMessage(null);
        mutation.mutate(data);
    };

    const onError = (errors: any) => {
        console.error('Zod validation errors:', errors);
    };

    return (
        <form 
            onSubmit={handleSubmit(onSubmit, onError)} 
            className="flex flex-col gap-y-4 border-2 border-black bg-slate-500 p-10 rounded w-full max-w-lg mx-auto"
        >
            {successMessage && <p className="text-green-500 font-bold">{successMessage}</p>}
            {serverError && <p className="text-red-500">{serverError}</p>}
            
            <h2>Registro de Produtos</h2>
    
            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {/* Product Name */}
                <div className="flex flex-col">
                    <label htmlFor="nome_produto">Nome do Produto</label>
                    <input
                        {...register("nome_produto")}
                        type='text'
                        id="nome_produto"
                        placeholder="Nome do Produto"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.nome_produto && <p className="text-red-500 text-sm mt-1">{errors.nome_produto.message}</p>}
                </div>
    
                {/* Descricao Produto */}
                <div className="flex flex-col">
                    <label htmlFor="descricao_produto">Descrição do Produto</label>
                    <input
                        {...register("descricao_produto")}
                        type='text'
                        id="descricao_produto"
                        placeholder="Descrição do Produto"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.descricao_produto && <p className="text-red-500 text-sm mt-1">{errors.descricao_produto.message}</p>}
                </div>
    
                {/* Marca Produto */}
                <div className="flex flex-col">
                    <label htmlFor="marca_produto">Marca do Produto</label>
                    <input
                        {...register("marca_produto")}
                        type='text'
                        id="marca_produto"
                        placeholder="Marca do Produto"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.marca_produto && <p className="text-red-500 text-sm mt-1">{errors.marca_produto.message}</p>}
                </div>
    
                {/* Modelo Produto */}
                <div className="flex flex-col">
                    <label htmlFor="modelo_produto">Modelo do Produto</label>
                    <input
                        {...register("modelo_produto")}
                        type='text'
                        id="modelo_produto"
                        placeholder="Modelo do Produto"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.modelo_produto && <p className="text-red-500 text-sm mt-1">{errors.modelo_produto.message}</p>}
                </div>
    
                {/* Preco Venda */}
                <div className="flex flex-col">
                    <label htmlFor="preco_venda">Preço de Venda</label>
                    <input
                        {...register("preco_venda", { valueAsNumber: true })}
                        type='number'
                        id="preco_venda"
                        placeholder="Preço de Venda"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.preco_venda && <p className="text-red-500 text-sm mt-1">{errors.preco_venda.message}</p>}
                </div>
    
                {/* Altura Produto */}
                <div className="flex flex-col">
                    <label htmlFor="altura_produto">Altura</label>
                    <input
                        {...register("altura_produto", { valueAsNumber: true })}
                        type='number'
                        id="altura_produto"
                        placeholder="Altura do Produto"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.altura_produto && <p className="text-red-500 text-sm mt-1">{errors.altura_produto.message}</p>}
                </div>
    
                {/* Largura Produto */}
                <div className="flex flex-col">
                    <label htmlFor="largura_produto">Largura</label>
                    <input
                        {...register("largura_produto", { valueAsNumber: true })}
                        type='number'
                        id="largura_produto"
                        placeholder="Largura do Produto"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.largura_produto && <p className="text-red-500 text-sm mt-1">{errors.largura_produto.message}</p>}
                </div>
    
                {/* Comprimento Produto */}
                <div className="flex flex-col">
                    <label htmlFor="comprimento_produto">Comprimento</label>
                    <input
                        {...register("comprimento_produto", { valueAsNumber: true })}
                        type='number'
                        id="comprimento_produto"
                        placeholder="Comprimento do Produto"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.comprimento_produto && <p className="text-red-500 text-sm mt-1">{errors.comprimento_produto.message}</p>}
                </div>
    
                {/* Localização Estoque */}
                <div className="flex flex-col">
                    <label htmlFor="localizacao_estoque">Localização no Estoque</label>
                    <input
                        {...register("localizacao_estoque")}
                        type='text'
                        id="localizacao_estoque"
                        placeholder="Localização no Estoque"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.localizacao_estoque && <p className="text-red-500 text-sm mt-1">{errors.localizacao_estoque.message}</p>}
                </div>
    
                {/* Peso Produto */}
                <div className="flex flex-col">
                    <label htmlFor="peso_produto">Peso</label>
                    <input
                        {...register("peso_produto", { valueAsNumber: true })}
                        type='number'
                        id="peso_produto"
                        placeholder="Peso do Produto"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.peso_produto && <p className="text-red-500 text-sm mt-1">{errors.peso_produto.message}</p>}
                </div>
    
                {/* ID Categoria */}
                <div className="flex flex-col">
                    <label htmlFor="id_categoria">ID da Categoria</label>
                    <input
                        {...register("id_categoria")}
                        type='text'
                        id="id_categoria"
                        placeholder="ID da Categoria"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.id_categoria && <p className="text-red-500 text-sm mt-1">{errors.id_categoria.message}</p>}
                </div>
    
                {/* ID Setor */}
                <div className="flex flex-col">
                    <label htmlFor="id_setor">ID do Setor</label>
                    <input
                        {...register("id_setor")}
                        type='text'
                        id="id_setor"
                        placeholder="ID do Setor"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.id_setor && <p className="text-red-500 text-sm mt-1">{errors.id_setor.message}</p>}
                </div>
            </div>
            
            <button
                type="submit"
                className="bg-slate-400 border-black disabled:bg-gray-500 py-2 mt-4 rounded w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Loading...' : 'Submit'}
            </button>
        </form>
    );
}

export default ProductForm;
