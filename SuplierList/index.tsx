import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSuppliers, { Supplier } from '../../Hooks/Supplier/useSuppliers';
import EditSupplierModal from '../SuplierEditModal/SuplierEditModal';
import useDeleteSupplier from '../../Hooks/Supplier/useDeleteSupplier';
import AddProductToSupplierModal from '../AddProductToSupplierModal';
import SupplierProductsModal from '../SuplierProducsModal/SupplierProductsModal';

interface FilterValues {
  search: string;
  cidade?: string;
  estado?: string;
}

const SupplierList: React.FC = () => {
  const { register, handleSubmit } = useForm<FilterValues>();
  const [filters, setFilters] = useState<FilterValues>({ search: '' });
  const [page, setPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isViewProductsModalOpen, setIsViewProductsModalOpen] = useState(false);
  const { data, isLoading, isError } = useSuppliers({ ...filters, page, limit: 10 });
  const { mutate: deleteSupplier} = useDeleteSupplier();
  const onSubmit = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
  };

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
    setSelectedSupplier(null);
  };

  const openViewProductsModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewProductsModalOpen(true); // Open the view products modal
  };

  const handleDelete =(id:number)=>{
    if(confirm('Tem certeza que deseja deletar esse fornecedor?')){
      deleteSupplier(id)
    }
  }

  if (isLoading) return <p>Loading suppliers...</p>;
  if (isError) return <p>Error loading suppliers.</p>;

  const suppliers = data?.suppliers ?? [];

  return (
    <div>
      <h1>Supplier List</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="search-form">
        <input
          {...register('search')}
          type="text"
          placeholder="Search by Razão Social"
        />
        <input
          {...register('cidade')}
          type="text"
          placeholder="Filter by Cidade"
        />
        <input
          {...register('estado')}
          type="text"
          placeholder="Filter by Estado"
        />
        <button type="submit">Search</button>
      </form>

      {suppliers.length === 0 ? (
        <p>No suppliers found.</p>
      ) : (
        <table className="supplier-table">
          <thead>
            <tr>
              <th>Razão Social</th>
              <th>Nome Fantasia</th>
              <th>CNPJ</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>CEP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier: Supplier) => (
              <tr key={supplier.id_fornecedor}>

                <td>{supplier.razao_social}</td>
                <td>{supplier.nome_fantasia? supplier.nome_fantasia: 'Não Informado'}</td>
                <td>{supplier.cnpj_fornecedor}</td>
                <td>{supplier.cidade}</td>
                <td>{supplier.estado}</td>
                <td>{supplier.cep}</td>
                <td>
                  <button onClick={() => openModal(supplier)}>Edit</button>
                  <button
                    onClick={() => handleDelete(supplier.id_fornecedor)}
                  >Deletar
                  </button>
                  <button onClick={() => openProductModal(supplier)}>Add Products</button>
                  <button onClick={() => openViewProductsModal(supplier)}>View Products</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {data?.currentPage} of {data?.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === data?.totalPages}
        >
          Next
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
    </div>
  );
};

export default SupplierList;
