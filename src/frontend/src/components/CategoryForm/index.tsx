import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { categorySchema, CategorySchema } from "./CategorySchema/categorySchema";
import { Category } from "../CategoryTypes/types";
import MutationCreateCategory from "../../Hooks/Categories/postCategoryCreationHook";
import './styles.css'
import useUpdateCategory from "../../Hooks/Categories/patchCategoryByIdHook";

interface CategoryFormProps {
    refetch: () => void;
    editingCategory?: Category | null;
    setIsEditing?: (isEditing: boolean) => void;
    onCancelEdit: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ refetch, editingCategory, setIsEditing, onCancelEdit }) => {
    const [serverError, setServerError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, setValue } = useForm<CategorySchema>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            nome_categoria: editingCategory?.nome_categoria || '',
            descricao_categoria: editingCategory?.descricao_categoria || '',
        }
    });

    const onSuccess = () => {
        reset();
        setSuccessMessage('Categoria cadastrada com sucesso!');
        refetch();
        if (setIsEditing) setIsEditing(false)
    };

    const mutation = MutationCreateCategory(onSuccess, setError, setServerError);
    const updateMutation = useUpdateCategory();

    useEffect(() => {
        if (editingCategory) {
            setValue("nome_categoria", editingCategory.nome_categoria)
            setValue("descricao_categoria", editingCategory.descricao_categoria)
        } else {
            reset()
        }
    }, [editingCategory, setValue, reset]);

    const onSubmit = (data: CategorySchema) => {
        setServerError(null);
        setSuccessMessage(null);
        if (editingCategory) {
            updateMutation.mutate({
                ...data,
                id_categoria: editingCategory.id_categoria,
                descricao_categoria: data.descricao_categoria || '',
            }, {
                onSuccess: () => {
                    onSuccess();
                },
                onError: (error: any) => {
                    setServerError('Erro ao atualizar categoria.')
                }
            })
        } else {
            mutation.mutate(data);
        }
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

            <h2>{editingCategory ? 'Editar Categoria' : 'Cadastrar Categoria'}</h2>

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
                    {isSubmitting ? 'Carregando...' : (editingCategory ? 'Salvar Alterações' : 'Cadastrar')}
                </button>

                {editingCategory && (
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                            reset();  // Reset the form
                            onCancelEdit();  // Exit editing mode
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
};

export default CategoryForm;