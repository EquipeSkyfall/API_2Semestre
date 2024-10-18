import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FetchAllCategories from '../../Hooks/Categories/fetchAllCategoriesHook'; // Adjust the path as needed

interface CategorySelectProps {
    refetch: () => void;
    onChange?: (categoryId: number | null) => void;
    defaultValue?: number | null;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ defaultValue, refetch, onChange }) => {
    const { register, formState: { errors }, setValue } = useFormContext();
    const { categories, isLoading, isError, refetch: refetchCategories } = FetchAllCategories(1);
    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId: number | null = event.target.value ? Number(event.target.value) : null;

        setValue('id_categoria', selectedId)

        if (onChange) {
            onChange(selectedId)
        }

        refetch()
    };

    useEffect(() => {
        refetchCategories(); // Sync with changes from the modal or other components
        if (defaultValue) {
            setValue('id_categoria', defaultValue)
        }
    }, [defaultValue, setValue, refetch]);

    return (
        <div className="form-field optional">
            <label htmlFor="id_categoria">Categoria</label>
            <select
                {...register('id_categoria')}
                id="id_categoria"
                defaultValue={ defaultValue || '' }
                onChange={handleCategoryChange}
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
        </div>
    );
};

export default CategorySelect;