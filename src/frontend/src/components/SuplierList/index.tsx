import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSuppliers, { Supplier } from '../../Hooks/Supplier/useSuppliers';
import EditSupplierModal from '../SuplierEditModal/SuplierEditModal';
import useDeleteSupplier from '../../Hooks/Supplier/useDeleteSupplier';
import AddProductToSupplierModal from '../AddProductToSupplierModal';
import SupplierProductsModal from '../SuplierProducsModal/SupplierProductsModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import './supplierlist.css';
import SupplierSearchBar from '../SupplierSearchBar';

const SupplierList: React.FC = () => {
  const { handleSubmit } = useForm();
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isViewProductsModalOpen, setIsViewProductsModalOpen] = useState(false);
  const { data, isLoading, isError } = useSuppliers({ search, page, limit: 10 });
  const { mutate: deleteSupplier } = useDeleteSupplier();

  // Estado para o modal de confirmação
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState<number | null>(null);

  const handleSearchTermChange = useCallback((search: string) => {
      setSearch(search);
      setPage(1);
    },[]
  );

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const openModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const openProductModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsProductModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsProductModalOpen(false);
    setIsViewProductsModalOpen(false);
    setShowConfirmModal(false);
    setSelectedSupplier(null);
    setSupplierIdToDelete(null); // Reseta o ID do fornecedor a ser excluído
  };

  const openViewProductsModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewProductsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setSupplierIdToDelete(id); // Armazena o ID do fornecedor para exclusão
    setShowConfirmModal(true); // Abre o modal de confirmação
  };

  const confirmDelete = async () => {
    if (supplierIdToDelete) {
      await deleteSupplier(supplierIdToDelete);
      closeModals(); // Fecha os modais
    }
  };

  if (isLoading) return <p>Carregando Fornecedores...</p>;
  if (isError) return <p>Erro ao tentar carregar os Fornecedores.</p>;

  const suppliers = data?.suppliers ?? [];

  return (
    <div className='flex-1 p-5 bg-gray-100 rounded-lg shadow-md max-h-[80vh] overflow-y-auto box-border ml-10 mr-10 mt-8 mb-10'>
      <h1 className='text-center'>Lista de Fornecedores</h1>

      <SupplierSearchBar onSearchTermChange={handleSearchTermChange} />

      <div className='ml-[14%]'>
        {suppliers.length === 0 ? (
          <p className='mt-3 ml-2 mb-4 flex justify-center'>Sem Fornecedores.</p>
        ) : (
          <ul className="list-items1">
            {suppliers.map((supplier: Supplier) => (
              <li key={supplier.id_fornecedor} className="list-item1">
                <div className="item-summary">
                  <div>
                    <p className="item-name">{supplier.razao_social}</p>
                    <p className="item-details">Nome Fantasia: {supplier.nome_fantasia || 'Não Informado'}</p>
                    <p className="item-details">CNPJ: {supplier.cnpj_fornecedor}</p>
                    <p className="item-details">Endereço: {supplier.endereco_fornecedor || 'Não Informado'}</p>
                    <p className="item-details">Cidade: {supplier.cidade}</p>
                    <p className="item-details">Estado: {supplier.estado}</p>
                    <p className="item-details">CEP: {supplier.cep}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => openModal(supplier)} className="edit-button">
                      <FontAwesomeIcon icon={faPencilAlt} /> Editar
                    </button>
                    <button onClick={() => handleDelete(supplier.id_fornecedor)} className="delete-button">
                      <FontAwesomeIcon icon={faTrashAlt} /> Deletar
                    </button>
                    <button
                      className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
                    rounded-md cursor-pointer text-base justify ml-2'
                      onClick={() => openProductModal(supplier)}
                    >
                      Adicionar Produtos
                    </button>
                    <button
                      className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
                    rounded-md cursor-pointer text-base justify ml-2'
                      onClick={() => openViewProductsModal(supplier)}
                    >
                      Ver Produtos
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="controles-pagina">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className='pagina-botao'
        >
          Anterior
        </button>
        <span>
          Página {data?.currentPage} de {data?.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === data?.totalPages}
          className='pagina-botao'
        >
          Próximo
        </button>
      </div>

      <AddProductToSupplierModal
        supplierId={selectedSupplier?.id_fornecedor || 0}
        isOpen={isProductModalOpen}
        onClose={closeModals}
      />

      <EditSupplierModal
        supplier={selectedSupplier}
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={handleSubmit}
      />

      {selectedSupplier && (
        <SupplierProductsModal
          supplierId={selectedSupplier.id_fornecedor}
          isOpen={isViewProductsModalOpen}
          onClose={closeModals}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex justify-center items-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-center text-xl mb-4">Confirmação de Exclusão</h2>
            <p className="text-center mb-4">Tem certeza que deseja excluir este fornecedor?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Sim
              </button>
              <button
                onClick={closeModals}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
