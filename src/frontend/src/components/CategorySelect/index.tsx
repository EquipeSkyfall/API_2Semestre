import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FetchAllCategories from '../../Hooks/Categories/fetchAllCategoriesHook';
import './categoryselect.css'; // Certifique-se de que está importando o CSS

interface CategorySelectProps {
    refetch: () => void;
    onChange?: (categoryId: number | null) => void;
    defaultValue?: number | null;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ defaultValue, refetch, onChange }) => {
    const { register, setValue } = useFormContext();
    const { categories, isLoading, isError, refetch: refetchCategories } = FetchAllCategories(1);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId: number | null = event.target.value ? Number(event.target.value) : null;

        setValue('id_categoria', selectedId);

        if (onChange) {
            onChange(selectedId);
        }

        refetch();
    };

    useEffect(() => {
        refetchCategories();
        if (defaultValue) {
            setValue('id_categoria', defaultValue);
        }
    }, [defaultValue, setValue, refetch]);

    return (
        <div className="form-field-categoria">
            <label htmlFor="id_categoria"></label>
            <select
                {...register('id_categoria')}
                id="id_categoria"
                defaultValue={defaultValue || ''}
                onChange={handleCategoryChange}
                className="category-select"
            >
                <option value="">Categoria</option>
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
