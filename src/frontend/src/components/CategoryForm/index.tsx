import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { categorySchema, CategorySchema } from "./CategorySchema/categorySchema";
import { Category } from "../CategoryTypes/types";
import MutationCreateCategory from "../../Hooks/Categories/postCategoryCreationHook";
import './categoryform.css';
import useUpdateCategory from "../../Hooks/Categories/patchCategoryByIdHook";

interface CategoryFormProps {
    refetch: () => void;
    editingCategory?: Category | null;
    setIsEditing?: (isEditing: boolean) => void;
    onCancelEdit: () => void;
    setEditingCategory?: (category: Category | null) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ refetch, editingCategory, setIsEditing, onCancelEdit, setEditingCategory }) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        if (setIsEditing) setIsEditing(false);
    };

    const mutation = MutationCreateCategory(onSuccess, setError, setServerError);
    const updateMutation = useUpdateCategory();

    useEffect(() => {
        if (editingCategory) {
            setValue("nome_categoria", editingCategory.nome_categoria);
            setValue("descricao_categoria", editingCategory.descricao_categoria);
        } else {
            reset();
        }
    }, [editingCategory, setValue, reset]);

    const onSubmit = (data: CategorySchema) => {
        setServerError(null);
        setSuccessMessage(null);

        if (editingCategory) {
            updateMutation.mutate(
                {
                    ...data,
                    id_categoria: editingCategory.id_categoria,  // Garantir que o ID está sendo passado corretamente
                    descricao_categoria: data.descricao_categoria || '',
                },
                {
                    onSuccess: () => {
                        reset();
                        setSuccessMessage('Categoria atualizada com sucesso!');
                        refetch();
                        if (setIsEditing) setIsEditing(false);
                        if (setEditingCategory) setEditingCategory(null); // Limpa a categoria editada após sucesso
                    },
                    onError: (error: any) => {
                        console.error('Erro ao atualizar categoria:', error.response || error.message);
                        setServerError('Erro ao atualizar categoria.');
                    },
                }
            );
        } else {
            mutation.mutate(data, {
                onSuccess: () => {
                    reset();
                    setSuccessMessage('Categoria cadastrada com sucesso!');
                    refetch();
                },
                onError: (error: any) => {
                    console.error('Erro ao cadastrar categoria:', error.response || error.message);
                    setServerError('Erro ao cadastrar categoria.');
                },
            });
        }
    };

    const onError = (errors: any) => {
        console.error('Zod validation errors:', errors);
    };

    return (
        <><h1 className="text-center text-m">
            {editingCategory ? 'Editar Categoria' : 'Cadastrar Categoria'}
        </h1><form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-4 w-full relative"
        >
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                {serverError && <p className="text-red-500">{serverError}</p>}

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="nome_categoria" className="font-medium">Nome da Categoria</label>
                        <input
                            {...register("nome_categoria")}
                            type="text"
                            id="nome_categoria"
                            maxLength={100} // Limitando o número de caracteres
                            className="p-2 border border-gray-300 rounded-md w-full" // Definindo a largura como 100%
                            style={{ wordWrap: "break-word", overflowWrap: "break-word" }} // Garantindo que o texto quebre
                        />
                        {errors.nome_categoria && <p className="text-red-500">{errors.nome_categoria.message}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="descricao_categoria" className="font-medium">Descrição</label>
                        <textarea
                            {...register("descricao_categoria")}
                            id="descricao_categoria"
                            maxLength={200} // Limitando o número de caracteres
                            className="p-2 border border-gray-300 rounded-md w-full h-24 resize-none overflow-auto" // Usando um textarea com altura fixa e sem redimensionamento
                            style={{ wordWrap: "break-word", overflowWrap: "break-word", resize: "none", overflowY: "auto" }} // Previne a quebra do layout
                        />
                        {errors.descricao_categoria && <p className="text-red-500">{errors.descricao_categoria.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className={`mt-3 py-2 px-4 rounded-md bg-cyan-400 text-white ${isSubmitting ? 'opacity-50' : 'hover:bg-cyan-600 transition duration-300 ease-in-out'}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Carregando...' : (editingCategory ? 'Salvar Alterações' : 'Cadastrar')}
                    </button>

                    {editingCategory && (
                        <button
                            type="button"
                            className="py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600 -mt-3"
                            onClick={() => {
                                reset();
                                onCancelEdit();
                            } }
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form></>
    );
};

export default CategoryForm;
