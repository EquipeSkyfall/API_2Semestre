import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FetchAllCategories from '../../Hooks/Categories/fetchAllCategoriesHook'; // Adjust the path as needed

interface CategorySelectProps {
    setIsCategoryModalOpen: (isOpen: boolean) => void; // Function to open the category modal
    refetch: () => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ setIsCategoryModalOpen, refetch }) => {
    const { register, formState: { errors } } = useFormContext();
    const { categories, isLoading, isError, refetch: refetchCategories } = FetchAllCategories(1, 10);

    useEffect(() => {
        refetchCategories(); // Sync with changes from the modal or other components
    }, [refetch]);

    return (
        <div className="form-field optional">
            <label htmlFor="id_categoria">Categoria</label>
            <select
                {...register('id_categoria')}
                id="id_categoria"
            >
                <option value="">Selecione uma categoria</option>
                {isLoading ? (
                    <option disabled>Carregando categorias...</option>
                ) : isError ? (
                    <option disabled>Erro ao carregar categorias</option>
                ) : categories && categories.length > 0 ? (
                    categories.map(category => (
                        <option key={category.id_categoria} value={category.id_categoria}>
                            {category.nome_categoria}
                        </option>
                    ))
                ) : (
                    <option disabled>Não há categorias disponíveis</option>
                )}
            </select>
            <button type="button" onClick={() => setIsCategoryModalOpen(true)}>
                Gerenciar Categorias
            </button>
        </div>
    );
};

export default CategorySelect;