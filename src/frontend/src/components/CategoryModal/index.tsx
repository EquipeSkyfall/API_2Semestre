import React, { useState, useEffect } from 'react';
import CategoryList from '../CategoryList';
import useDeleteCategory from '../../Hooks/Categories/deleteCategoryByIdHook';
import useUpdateCategory from '../../Hooks/Categories/patchCategoryByIdHook';
import FetchAllCategories from '../../Hooks/Categories/fetchAllCategoriesHook';
import { Category } from '../CategoryTypes/types';
import CategoryForm from '../CategoryForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './styles.css';

interface CategoryModalProps {
    setIsCategoryModalOpen: (isOpen: boolean) => void;
    refetch: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    setIsCategoryModalOpen,
    refetch,
}) => {
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const deleteCategoryMutation = useDeleteCategory();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const { categories, totalPages, isLoading, isError, refetch: refetchCategories } = FetchAllCategories(currentPage, itemsPerPage);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    useEffect(() => {
        refetchCategories(); // Ensure categories are re-fetched on modal open
    }, [currentPage, isEditing]);

    const closeModal = () => {
        console.log('Fechando modal...');
        setIsCategoryModalOpen(false);
        refetch();
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsEditing(true);
    };

    const handleDelete = (id_categoria: number) => {
        setCategoryToDelete(id_categoria);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete !== null) {
            try {
                await deleteCategoryMutation.mutateAsync(categoryToDelete);
                refetch();
                refetchCategories();
                setShowConfirmModal(false); // Fecha o modal após a confirmação
            } catch (error) {
                console.error('Erro tentando deletar categoria:', error);
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false); // Fecha o modal sem deletar
    };

    const handleSuccess = () => {
        setEditingCategory(null);  // Limpa o estado de edição
        setIsEditing(false);       // Sai do modo de edição
        refetch();                 // Refaz o fetch das categorias
        refetchCategories();       // Atualiza a lista de categorias
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-4xl p-6 relative">
                {/* Botão de fechar modal (X) no canto superior direito do modal */}
                <button className="close-button-category" onClick={closeModal}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="flex space-x-6">
                    {/* Formulário de Cadastro (Esquerda) */}
                    <div className="w-1/2">
                        <CategoryForm
                            refetch={() => handleSuccess()}
                            editingCategory={editingCategory}
                            setIsEditing={setIsEditing}
                            onCancelEdit={() => {
                                setEditingCategory(null);
                                setIsEditing(false);
                            }}
                        />
                    </div>

                    {/* Lista de Categorias (Direita) */}
                    <div className="w-1/2">
                        <CategoryList
                            categories={categories}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={5}
                            handlePageChange={setCurrentPage}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>

                {/* Modal de Confirmação de Exclusão */}
                {showConfirmModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-60">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-center text-xl mb-4">Confirmação de Exclusão</h2>
                            <p className="text-center mb-4">Tem certeza que deseja excluir esta categoria?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Sim
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryModal;
