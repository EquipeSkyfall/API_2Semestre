import React, { useState } from 'react'
import CategoryList from '../CategoryList'
import useDeleteCategory from '../../Hooks/Categories/deleteCategoryByIdHook'
import useUpdateCategory from '../../Hooks/Categories/patchCategoryByIdHook'
import FetchAllCategories from '../../Hooks/Categories/fetchAllCategoriesHook'
import { Category } from '../CategoryTypes/types'
import CategoryForm from '../CategoryForm'
import './styles.css'

interface CategoryModalProps {
    setIsCategoryModalOpen: (isOpen: boolean) => void;
    refetch: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    setIsCategoryModalOpen,
    refetch,
}) => {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const updateCategoryMutation = useUpdateCategory()
    const deleteCategoryMutation = useDeleteCategory()
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const { categories, totalPages, isLoading, isError } = FetchAllCategories(currentPage, itemsPerPage)

    const closeModal = () => {
        setIsCategoryModalOpen(false);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsEditing(true);
    };

    const handleUpdate = async (updatedCategory: Category) => {
        try{
            await updateCategoryMutation.mutateAsync(updatedCategory);
            setIsEditing(false);
            refetch();
        } catch (error) {
            console.error('Erro deletando categoria:', error)
        }
    };

    const handleDelete = async (id_categoria: number) => {
        if (window.confirm('Tem certeza que deseja deletar essa categoria?')) {
            try{
                console.log(id_categoria)
                await deleteCategoryMutation.mutateAsync(id_categoria)
                refetch()
            } catch (error) {
                console.error('Erro tentando deletar categoria:', error)
            }
        }
    };

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <button className="close-button" onClick={closeModal}>X</button>
                <h1>Categorias</h1>

                {/* Listagem */}
                <CategoryList
                    categories={categories}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={10}
                    handlePageChange={setCurrentPage}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />

                {/* Cadastro */}
                <CategoryForm refetch={refetch} />
            </div>
        </div>
    )
}

export default CategoryModal;