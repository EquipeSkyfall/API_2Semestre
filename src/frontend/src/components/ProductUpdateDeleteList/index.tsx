import React, { useState } from 'react';
import ProductList from '../ProductsList';
import SearchBar from '../ProdutosSearchBar';
import EditProduct from './EditProduct';
import useDeleteProduct from '../../Hooks/Products/deleteProductByIdHook';
import useUpdateProduct from '../../Hooks/Products/patchByIdProductHook';
import { ProductSchema } from '../ProductForm/ProductSchema/productSchema';
import './productupdatedeletelist.css';
import ProductForm from '../ProductForm';
import AdicionarProdutoModal from '../AdicionarProdutoModal';
import EditModal from '../EditModal';
import './productupdatedeletelist.css';
import SectorModal from '../SectorModal';  // Corrigir a importação para SectorModal
import CategoryModal from '../CategoryModal'; // Corrigir a importação para CategoryModal
import useGetUser from '../../Hooks/Users/getUserHook';

interface Product extends ProductSchema {
    id_produto: number;
    quantidade_estoque: number;
}

interface ProductsUpdateAndDeleteProps {
    products: Product[];
    onSearchTermChange: (term: string, categoryId: number | null, sectorId: number | null) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    refetch: () => void; // Passar a função de refazer consulta
}

const ProductsUpdateAndDelete: React.FC<ProductsUpdateAndDeleteProps> = ({
    products,
    onSearchTermChange,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch,
}) => {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null); // Estado para armazenar o ID do produto a ser excluído
    const updateProductMutation = useUpdateProduct();
    const deleteProductMutation = useDeleteProduct();
    const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false); // Estado para controlar o modal de produto
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false); // Estado para controlar o modal de categoria
    const [isSectorModalOpen, setIsSectorModalOpen] = useState<boolean>(false); // Estado para controlar o modal de setor
    const handleOpenModal = () => setIsProductModalOpen(true);
    const handleCloseModal = () => setIsProductModalOpen(false);

    const handleEdit = (product: Product) => {
        console.log('Editing product:', product);  // Verifique se o produto está sendo passado corretamente
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedProduct: Product) => {
        try {
            await updateProductMutation.mutateAsync(updatedProduct);
            setIsModalOpen(false);
            refetch(); // Refazer consulta após atualização
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
        }
    };

    const handleDelete = (id_produto: number) => {
        setProductToDelete(id_produto); // Armazenar o ID do produto a ser excluído
        setShowConfirmModal(true); // Mostrar o modal de confirmação
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProductMutation.mutateAsync(productToDelete);
                refetch(); // Refazer consulta após exclusão
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            } finally {
                setShowConfirmModal(false); // Fechar o modal de confirmação
                setProductToDelete(null); // Limpar o ID do produto
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false); // Fechar o modal de confirmação
        setProductToDelete(null); // Limpar o ID do produto
    };

    const { data: user, isLoading, error } = useGetUser();
    const isAllowed = user && (user.role === 'Administrador' || user.role === 'Gerente');

    return (
        <div className="flex flex-col items-center border">
            <h2 className="h2 !text-5xl !text-cyan-600">Produtos</h2>
            <div className="lg:flex lg:justify-start lg:w-full lg:gap-4 lg:pr-[25vw]">
                {isAllowed && (
                    <>
                        <button
                            className="searchbar-button lg:!mt-1 lg:!mb-0"
                            onClick={() => setIsProductModalOpen(true)}
                        >
                            Adicionar Produto
                        </button>
                        <button
                            className="searchbar-button lg:!mt-1 lg:!mb-0"
                            onClick={() => setIsCategoryModalOpen(true)}
                        >
                            Gerenciar Categorias
                        </button>
                        <button
                            className="searchbar-button lg:!mt-1 lg:!mb-0"
                            onClick={() => setIsSectorModalOpen(true)}
                        >
                            Gerenciar Setores
                        </button>
                    </>
                )}
            </div>
            <SearchBar
                onSearchTermChange={onSearchTermChange}
            />

            {/* Lista de Produtos */}
            <ProductList
                products={products}
                onEdit={handleEdit}
                currentPage={currentPage}
                handlePageChange={setCurrentPage}
                totalPages={totalPages} // Passando totalPages para lógica de paginação
                onDelete={handleDelete}
                itemsPerPage={5}
            />

            {/* Modal de Confirmação de Exclusão */}
            {
                showConfirmModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-60">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 sm:w-1/4">
                            <h2 className="text-center text-xl mb-4">Confirmação de Exclusão</h2>
                            <p className="text-center mb-4">Tem certeza que deseja excluir este produto?</p>
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
                )
            }

            {/* Modal para Adicionar Produto */}
            <AdicionarProdutoModal isOpen={isProductModalOpen} onClose={handleCloseModal}>
                <ProductForm refetch={refetch} />
            </AdicionarProdutoModal>

            {/* Modal para Edição do Produto */}
            <EditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={
                editingProduct && (
                    <EditProduct
                        product={editingProduct}
                        onUpdate={handleUpdate}
                        onClose={() => setIsModalOpen(false)}
                        refetch={refetch}
                    />
                )
            } />

            {isCategoryModalOpen && (
                <CategoryModal
                    setIsCategoryModalOpen={setIsCategoryModalOpen}
                    refetch={refetch}
                />
            )}
            {isSectorModalOpen && (
                <SectorModal
                    setIsSectorModalOpen={setIsSectorModalOpen}
                    refetch={refetch}
                />
            )}
        </div >
    );
};

export default ProductsUpdateAndDelete;
