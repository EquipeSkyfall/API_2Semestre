import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { categorySchema, CategorySchema } from "./CategorySchema/categorySchema";
import MutationCreateCategory from "../../Hooks/Categories/postCategoryCreationHook";
import './styles.css'

interface CategoryFormProps {
    refetch: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ refetch }) => {
    const [serverError, setServerError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<CategorySchema>({
        resolver: zodResolver(categorySchema)
    });

    const onSuccess = () => {
        reset();
        setSuccessMessage('Categoria cadastrada com sucesso!');
        refetch();
    };

    const mutation = MutationCreateCategory(onSuccess, setError, setServerError);

    const onSubmit = (data: CategorySchema) => {
        setServerError(null);
        setSuccessMessage(null);
        mutation.mutate(data);
    };

    const onError = (errors: any) => {
        console.error('Zod validation errors:', errors)
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="category-form"
        >
            {successMessage && <p className="success-message">{successMessage}</p>}
            {serverError && <p className="error-message">{serverError}</p>}

            <h2>Cadastrar Categoria</h2>

            <div className="form-fields-grid">
                <div className="form-field required">
                    <label htmlFor="nome_categoria">Nome da Categoria</label>
                    <input
                        {...register("nome_categoria")}
                        type="text"
                        id="nome_categoria"
                    />
                    {errors.nome_categoria && <p className="error-message">{errors.nome_categoria.message}</p>}
                </div>

                <div className="form-field optional">
                    <label htmlFor="descricao_categoria">Descrição</label>
                    <input
                        {...register("descricao_categoria")}
                        type="text"
                        id="descricao_categoria"
                    />
                    {errors.descricao_categoria && <p className="error-message">{errors.descricao_categoria.message}</p>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Carregando...' : 'Cadastrar'}
                </button>
            </div>
        </form>
    )
};

export default CategoryForm;