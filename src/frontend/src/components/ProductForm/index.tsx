// ProductForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { productSchema, ProductSchema } from './ProductSchema/productSchema';
import CreateProductMutation from '../../Hooks/Products/postProductCreationHook';

interface ProductFormProps {
    refetch: () => void;
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
        setSuccessMessage('Produto cadastrado com sucesso');
        refetch();
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
            
            <h2 className='text-center'>Cadastrar Produtos</h2>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {/* Product Name */}
                <div className="flex flex-col">
                    <input
                        {...register("product_name")}
                        type='text'
                        placeholder="Nome do Produto"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.product_name && <p className="text-red-500 text-sm mt-1">{errors.product_name.message}</p>}
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <input
                        {...register("description")}
                        type='text'
                        placeholder="Descrição"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Batch */}
                <div className="flex flex-col">
                    <input
                        {...register("batch")}
                        type='text'
                        placeholder="Lote"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.batch && <p className="text-red-500 text-sm mt-1">{errors.batch.message}</p>}
                </div>

                {/* Brand */}
                <div className="flex flex-col">
                    <input
                        {...register("brand")}
                        type='text'
                        placeholder="Marca"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                </div>

                {/* Quantity */}
                <div className="flex flex-col">
                    <input
                        {...register("quantity", { valueAsNumber: true })}
                        type='number'
                        placeholder="Quantidade"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
                </div>

                {/* Price */}
                <div className="flex flex-col">
                    <input
                        {...register("price", { valueAsNumber: true })}
                        type='number'
                        placeholder="Preço"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                </div>

                {/* Retail Price */}
                <div className="flex flex-col">
                    <input
                        {...register("retail_price", { valueAsNumber: true })}
                        type='number'
                        placeholder="Preço de Venda"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.retail_price && <p className="text-red-500 text-sm mt-1">{errors.retail_price.message}</p>}
                </div>

                {/* Stock Location */}
                <div className="flex flex-col">
                    <input
                        {...register("stock_location")}
                        type='text'
                        placeholder="Localização do Estoque"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.stock_location && <p className="text-red-500 text-sm mt-1">{errors.stock_location.message}</p>}
                </div>

                {/* Category ID */}
                <div className="flex flex-col">
                    <input
                        {...register("id_category")}
                        type='text'
                        placeholder="Id da categoria"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.id_category && <p className="text-red-500 text-sm mt-1">{errors.id_category.message}</p>}
                </div>

                {/* Sector ID */}
                <div className="flex flex-col">
                    <input
                        {...register("id_sector")}
                        type='text'
                        placeholder="Id do setor"
                        className="px-4 py-2 rounded w-full"
                    />
                    {errors.id_sector && <p className="text-red-500 text-sm mt-1">{errors.id_sector.message}</p>}
                </div>

                {/* Weight */}
                <div className="flex flex-col">
                    <input
                        {...register("weight", { valueAsNumber: true })}
                        type='number'
                        placeholder="Peso"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                </div>

                {/* Height */}
                <div className="flex flex-col">
                    <input
                        {...register("height", { valueAsNumber: true })}
                        type='number'
                        placeholder="Altura"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
                </div>

                {/* Width */}
                <div className="flex flex-col">
                    <input
                        {...register("width", { valueAsNumber: true })}
                        type='number'
                        placeholder="Largura"
                        className="px-4 py-2 rounded w-full"
                        min='0'
                    />
                    {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>}
                </div>
            </div>
            
            <button
                type="submit"
                className="bg-slate-400 border-black disabled:bg-gray-500 py-2 mt-4 rounded w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Loading...' : 'Cadastrar'}
            </button>
        </form>
    );
}

export default ProductForm;
