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
import FornecedorForm from '../SupplierForm';

const SupplierList: React.FC = () => {
  const { handleSubmit } = useForm();
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [modalState, setModalState] = useState({
    isEditModalOpen: false,
    isProductModalOpen: false,
    isViewProductsModalOpen: false,
    showConfirmModal: false,
    supplierIdToDelete: null as number | null,
  });
  const { data, isLoading, isError } = useSuppliers({ search, page, limit: 9 });
  const { mutate: deleteSupplier } = useDeleteSupplier();

  const handleSearchTermChange = useCallback((search: string) => {
    setSearch(search);
    setPage(1);
  }, []);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const openModal = (supplier: Supplier, modalType: string) => {
    setSelectedSupplier(supplier);
    setModalState((prev) => ({ ...prev, [modalType]: true }));
  };

  const closeModals = () => {
    setModalState({
      isEditModalOpen: false,
      isProductModalOpen: false,
      isViewProductsModalOpen: false,
      showConfirmModal: false,
      supplierIdToDelete: null,
    });
    setSelectedSupplier(null);
  };

  const handleDelete = (id: number) => {
    setModalState((prev) => ({ ...prev, showConfirmModal: true, supplierIdToDelete: id }));
  };

  const confirmDelete = async () => {
    if (modalState.supplierIdToDelete) {
      await deleteSupplier(modalState.supplierIdToDelete);
      closeModals();
    }
  };

  if (isLoading) return <p>Carregando Fornecedores...</p>;
  if (isError) return <p>Erro ao tentar carregar os Fornecedores.</p>;

  const suppliers = data?.suppliers ?? [];

  return (
    <div className="flex-1 p-5 bg-gray-100 rounded-lg shadow-md max-h-[80vh] overflow-y-auto box-border ml-10 mr-10 mt-8 mb-10">
      <div className="relative flex items-center mb-4">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl md:text-3xl font-semibold truncate">
          Lista de Fornecedores
        </h1>
        <div className="ml-auto hidden sm:block">
          <FornecedorForm />
        </div>
      </div>

      <SupplierSearchBar onSearchTermChange={handleSearchTermChange} />
      <div className="sm:hidden mb-5 flex justify-center">
        <FornecedorForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
        {suppliers.length === 0 ? (
          <p className='mt-3 ml-2 mb-4 flex justify-center'>Sem Fornecedores.</p>
        ) : (
          suppliers.map((supplier: Supplier) => (
            <li key={supplier.id_fornecedor} className="bg-white p-4 rounded-lg shadow-md flex flex-col relative">
              <div className="item-summary flex flex-col justify-between">
                <p className="item-name text-lg font-semibold">{supplier.razao_social}</p>
                <p className="item-details">Nome Fantasia: {supplier.nome_fantasia || 'Não Informado'}</p>
                <p className="item-details">CNPJ: {supplier.cnpj_fornecedor}</p>
                <p className="item-details">Endereço: {supplier.endereco_fornecedor || 'Não Informado'}</p>
                <p className="item-details">Cidade: {supplier.cidade}</p>
                <p className="item-details">Estado: {supplier.estado}</p>
                <p className="item-details">CEP: {supplier.cep}</p>

                <div className="item-actions flex justify-between mt-3 space-x-2">
                  <button
                    className='px-4 py-1 bg-cyan-400 hover:bg-sky-400 text-white rounded-md text-xs w-full'
                    onClick={() => openModal(supplier, 'isProductModalOpen')}
                  >
                    Adicionar Produtos
                  </button>
                  <button
                    className='px-4 py-1 bg-cyan-400 hover:bg-sky-400 text-white rounded-md text-xs w-full'
                    onClick={() => openModal(supplier, 'isViewProductsModalOpen')}
                  >
                    Ver Produtos
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-3 space-x-2">
                <button
                  onClick={() => openModal(supplier, 'isEditModalOpen')}
                  className="edit-button px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-400"
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id_fornecedor)}
                  className="delete-button px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-400"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </li>



          ))
        )}
      </div>

      <div className="pagination-controls flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className='pagination-button px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 mr-2'
        >
          Anterior
        </button>
        <span>
          Página {data?.currentPage} de {data?.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === data?.totalPages}
          className='pagination-button px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 ml-2'
        >
          Próximo
        </button>
      </div>

      <AddProductToSupplierModal
        supplierId={selectedSupplier?.id_fornecedor || 0}
        isOpen={modalState.isProductModalOpen}
        onClose={closeModals}
      />

      <EditSupplierModal
        supplier={selectedSupplier}
        isOpen={modalState.isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleSubmit}
      />

      {
        selectedSupplier && (
          <SupplierProductsModal
            supplierId={selectedSupplier.id_fornecedor}
            isOpen={modalState.isViewProductsModalOpen}
            onClose={closeModals}
          />
        )
      }

      {
        modalState.showConfirmModal && (
          <div className="fixed inset-0 flex justify-center items-center z-60">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/3">
              <h2 className="text-center text-xl mb-4">Confirmação de Exclusão</h2>
              <p className="text-center mb-4 text-sm sm:text-base">Tem certeza que deseja excluir este fornecedor?</p>
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
        )
      }

    </div>
  );
};

export default SupplierList;
