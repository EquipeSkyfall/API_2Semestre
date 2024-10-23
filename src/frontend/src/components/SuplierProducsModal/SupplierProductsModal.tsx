// Components/Supplier/SupplierProductsModal.tsx
import React, { useState } from 'react';
import useGetSupplierProducts from '../../Hooks/Supplier/useGetSupplierProducts';
import useDeleteProductFromSupplier from '../../Hooks/Supplier/useDeleteProductFromSupplier';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
    const { data, isLoading, isError } = useGetSupplierProducts(supplierId, { search: '', page: page, limit: 10 });
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
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Produtos do Fornecedor</h2>

                <input
                    type="text"
                    placeholder="Procurando Produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='mt-2 mb-2 border rounded-md p-2'
                />

                {isLoading ? (
                    <p className='mt-2 mb-2'>Carregando Produtos...</p>
                ) : isError ? (
                    <p className='mt-2 mb-2'>Erro ao carregar Produtos.</p>
                ) : filteredProducts.length === 0 ? (
                    <p className='mt-2 mb-2'>Produtos não encontrados.</p>
                ) : (
                    <>
                        <ul>
                            {filteredProducts.map((product) => (
                                <li key={product.id_produto}>
                                    <div className='flex flex-row items-center justify-between p-4 bg-gray-100 rounded-md shadow-md mb-2'>
                                        <strong className="text-lg font-semibold text-gray-800">{product.produto.nome_produto}</strong>
                                        <p className="text-sm text-gray-600">ID: {product.id_produto}</p>
                                        <p className="text-sm text-gray-600">Preço de custo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_custo)}</p>
                                        <button className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-300'
                                            onClick={() => handleDelete(product.id_produto)}>
                                            Deletar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Controles de paginação */}
                        <div className="pagination flex justify-between mt-4">
                            <button onClick={handlePrevPage} disabled={page === 1} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                                Anterior
                            </button>
                            <span>
                                Página {page} de {data?.totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={page === data?.totalPages} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                            >
                                Próximo
                            </button>
                        </div>
                    </>
                )}

                {/* Modal de Confirmação de Exclusão */}
                {showConfirmModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-60">
                        <div className="bg-white p-6 rounded-lg shadow-lg"> {/* Ajuste na largura */}
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
                )}
            </div>
        </div>
    );
};

export default SupplierProductsModal;
