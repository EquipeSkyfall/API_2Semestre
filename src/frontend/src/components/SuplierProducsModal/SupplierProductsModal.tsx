// Components/Supplier/SupplierProductsModal.tsx
import React, { useState } from 'react';
import useGetSupplierProducts from '../../Hooks/Supplier/useGetSupplierProducts';
import useDeleteProductFromSupplier from '../../Hooks/Supplier/useDeleteProductFromSupplier';

interface SupplierProductsModalProps {
  supplierId: number;
  isOpen: boolean;
  nome_produto: string;
  onClose: () => void;
}


const SupplierProductsModal: React.FC<SupplierProductsModalProps> = ({
  supplierId,
  isOpen,
  onClose,
}) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetSupplierProducts(supplierId, {search: '', page: page, limit: 10});
  const { mutate: deleteProduct } = useDeleteProductFromSupplier();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = data?.products.filter((product) =>
    product.produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id_produto: number) => {
    console.log(id_produto,supplierId)
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct({ supplierId, id_produto });
    }
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2>Produtos do Fornecedorr</h2>

            <input
                type="text"
                placeholder="Procurando Produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='mt-2 mb-2'
            />

            {isLoading ? (
                <p className='mt-2 mb-2'>Carregar Produtos...</p>
            ) : isError ? (
                <p className='mt-2 mb-2'>Erro ao carreagar Produtos.</p>
            ) : filteredProducts.length === 0 ? (
                <p className='mt-2 mb-2'>Produtos não encontrado.</p>
            ) : (
                <>
                    <ul>
                        {filteredProducts.map((product) => (
                            <li key={product.id_produto}>
                                <div className='flex flex-row items-center justify-between p-4 bg-gray-100 rounded-md shadow-md mb-2'>
                                    <strong className="text-lg font-semibold text-gray-800">{product.produto.nome_produto}</strong>
                                    <p className="text-sm text-gray-600">ID: {product.id_produto}</p>
                                    <p className="text-sm text-gray-600">Preço de custo: {product.preco_custo}</p>
                                    <button className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors duration-300'
                                    onClick={() => handleDelete(product.id_produto)}>
                                        Deletar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination controls */}
                    <div className="pagination">
                        <button onClick={handlePrevPage} disabled={ data?.totalPages === 1}>
                            Anterior
                        </button>
                        <span>
                            Página {page} de {data?.totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={page === data?.totalPages}
                        >
                            Próximo
                        </button>
                    </div>
                </>
            )}

            <button className='px-4 py-2 bg-cyan-400 hover:bg-sky-400 text-white rounded-md text-sm font-medium transition-colors duration-300 mt-5' onClick={onClose}>Fechar</button>
        </div>
    </div>
  );
};

export default SupplierProductsModal;
