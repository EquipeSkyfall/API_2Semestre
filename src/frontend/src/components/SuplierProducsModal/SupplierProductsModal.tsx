import React, { useEffect, useState } from 'react';
import useGetSupplierProducts from '../../Hooks/Supplier/useGetSupplierProducts';
import useDeleteProductFromSupplier from '../../Hooks/Supplier/useDeleteProductFromSupplier';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './supplierproductsmodal.css'


interface SupplierProductsModalProps {
    supplierId: number;
    isOpen: boolean;
    onClose: () => void;
}

const SupplierProductsModal: React.FC<SupplierProductsModalProps> = ({
    supplierId,
    isOpen,
    onClose,
}) => {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useGetSupplierProducts(supplierId, { search: '', page: page, limit: 9 });
    const { mutate: deleteProduct } = useDeleteProductFromSupplier();
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    const filteredProducts = data?.products.filter((product) =>
        product.produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id_produto: number) => {
        setProductToDelete(id_produto);
        setShowConfirmModal(true);
    };

    const confirmDelete = () => {
        if (productToDelete !== null) {
            deleteProduct({ supplierId, id_produto: productToDelete });
            setShowConfirmModal(false);
            setProductToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setProductToDelete(null);
    };

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-supplier-produto text-xs md:text-sm inset-0 flex">
            <div className="modal-content-supplier-produto !max-w-screen-md w-full 2xl:!max-w-screen-md relative">
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="text-2xl font-bold text-cyan-600 text-center mb-4">Adicionar Produtos ao Fornecedor</h2>                <input
                    type="text"
                    placeholder="Procurando Produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-5 text-center w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                {isLoading ? (
                    <p className='mt-2 mb-2'>Carregando Produtos...</p>
                ) : isError ? (
                    <p className='mt-2 mb-2'>Erro ao carregar Produtos.</p>
                ) : filteredProducts.length === 0 ? (
                    <p className='mt-2 mb-2'>Produtos não encontrados.</p>
                ) : (
                    <>
                        <ul className="sm:w-[100%] sm:-translate-x-0 w-[120%] -translate-x-6">
                            {filteredProducts.map((product) => (
                                <li key={product.id_produto}>
                                    <div className="grid grid-cols-4 items-center p-2 bg-gray-100 rounded-md shadow-md mb-2">
                                        <div className='text-left'>
                                            <strong className="text-sm md:text-base 2xl:text-lg font-semibold text-gray-800">
                                                {product.produto.nome_produto}
                                            </strong>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mr-10">ID: {product.id_produto}</p>
                                        </div>
                                        <div className="text-xs sm:text-sm  text-gray-600 -ml-10">
                                            Preço de custo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_custo)}
                                        </div>
                                        <div className='ml-0 sm:ml-24'>
                                            <button
                                                className="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-300"
                                                onClick={() => handleDelete(product.id_produto)}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Controles de paginação */}
                        <div className="pagination flex justify-center items-center mt-4 2xl:text-xl text-base">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className="px-3 py-2 bg-gray-300 hover:bg-gray-400 !rounded-md"
                            >
                                Anterior
                            </button>
                            <span className="mx-4">
                                Página {page} de {data?.totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === data?.totalPages}
                                className="px-3 py-2 bg-gray-300 hover:bg-gray-400 !rounded-md"
                            >
                                Próximo
                            </button>
                        </div>

                    </>
                )}

                {/* Modal de Confirmação de Exclusão */}
                {showConfirmModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-60">
                        <div className="bg-white p-10 rounded-lg shadow-lg">
                            <h2 className="text-center text-xl mb-4">Confirmação de Exclusão</h2>
                            <p className="text-center mb-4">Tem certeza que deseja excluir este produto?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                                >
                                    Sim
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
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

export default SupplierProductsModal;