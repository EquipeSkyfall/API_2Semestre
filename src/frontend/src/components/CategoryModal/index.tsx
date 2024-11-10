import React, { useState, useEffect, useCallback } from 'react';
import CategoryList from '../CategoryList';
import useDeleteCategory from '../../Hooks/Categories/deleteCategoryByIdHook';
import FetchAllCategories from '../../Hooks/Categories/fetchAllCategoriesHook';
import { Category } from '../CategoryTypes/types';
import CategoryForm from '../CategoryForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './categorymodal.css';

interface CategoryModalProps {
    setIsCategoryModalOpen: (isOpen: boolean) => void;
    refetch: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    setIsCategoryModalOpen,
    refetch,
}) => {
    const [isFormVisible, setIsFormVisible] = useState(true); 
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const deleteCategoryMutation = useDeleteCategory();
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const { categories, totalPages, isLoading, isError, refetch: refetchCategories } = FetchAllCategories(search, currentPage, itemsPerPage);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const handleSearchTermChange = useCallback((search: string) => {
        setSearch(search);
        setCurrentPage(1);
      },[]
    );

    useEffect(() => {
        refetchCategories();
    }, [currentPage, search]);

    const closeModal = () => {
        setIsCategoryModalOpen(false);
        refetch();
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormVisible(true);
    };

    const handleDelete = (id_categoria: number) => {
        setCategoryToDelete(id_categoria);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete !== null) {
            try {
                await deleteCategoryMutation.mutateAsync(categoryToDelete);
                setShowConfirmModal(false);
                refetchCategories();
                refetch();
            } catch (error) {
                console.error('Erro tentando deletar categoria:', error);
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
    };

    const handleSuccess = () => {
        setEditingCategory(null);
        refetchCategories();
        refetch();
    };

    const getModalTitle = () => {
        return editingCategory ? 'Editar Categoria' : isFormVisible ? 'Criar Nova Categoria' : 'Lista de Categorias';
    };

    const getButtonStyle = (isFormButton: boolean) => {
        if (editingCategory) return 'bg-gray-300 text-gray-800';

        return isFormButton
            ? isFormVisible ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-800'
            : !isFormVisible ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-800';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-4 sm:p-6 md:p-8 relative" style={{ height: '80vh', maxHeight: '600px' }}>
                <button className="fechar absolute top-4 right-4" onClick={closeModal}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                
                <h1 className="text-xl sm:text-2xl md:text-3xl mb-4">{getModalTitle()}</h1>

                <div className="flex justify-start mb-4 space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md ${getButtonStyle(true)}`}
                        onClick={() => setIsFormVisible(true)}
                    >
                        Criar Nova Categoria
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${getButtonStyle(false)}`}
                        onClick={() => setIsFormVisible(false)}
                    >
                        Ver Lista de Categorias
                    </button>
                </div>

                {isFormVisible ? (
                    <CategoryForm
                        refetch={handleSuccess}
                        editingCategory={editingCategory}
                        onCancelEdit={() => {
                            setEditingCategory(null);
                            setIsFormVisible(false);
                        }}
                    />
                ) : (
                    <CategoryList
                        searchTerm={handleSearchTermChange}
                        categories={categories}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={setCurrentPage}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                )}

                {showConfirmModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-60 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
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
