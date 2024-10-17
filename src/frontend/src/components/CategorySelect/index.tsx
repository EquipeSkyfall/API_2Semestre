import React from 'react';
import { useFormContext } from 'react-hook-form';
import FetchAllCategories from '../../Hooks/Categories/fetchAllCategoriesHook'; // Adjust the path as needed

interface CategorySelectProps {
    setIsCategoryModalOpen: (isOpen: boolean) => void; // Function to open the category modal
    setSelectedCategoryId: (id: number) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ setIsCategoryModalOpen, setSelectedCategoryId }) => {
    const { register, watch, formState: { errors } } = useFormContext();
    const { categories, isLoading, isError, refetch } = FetchAllCategories(1, 10);

    const selectedCategoryId = watch('id_categoria');

    const handleSelectCategory = (categoryId: number) => {
        setSelectedCategoryId(categoryId); // Set the selected category ID
        setIsCategoryModalOpen(false); // Optionally close the modal if needed
    };

    return (
        <div className="form-field">
            <label htmlFor="id_categoria">Categoria</label>
            <select
                {...register('id_categoria', { required: 'Selecione uma categoria' })} // Include validation
                id="id_categoria"
                value={selectedCategoryId}
                onChange={(e) => handleSelectCategory(Number(e.target.value))}
            >
                <option disabled>Selecione uma categoria</option>
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