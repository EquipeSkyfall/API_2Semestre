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

  if (isLoading) return <p>Carregado Fornecedores...</p>;
  if (isError) return <p>Erro ao tentar carregar os Fornecedores.</p>;

  const suppliers = data?.suppliers ?? [];

  return (
    <div className='flex-1 p-5 bg-gray-100 rounded-lg shadow-md max-h-[80vh] overflow-y-auto box-border ml-10 mr-10 mt-8 mb-10'>
      <h1 className='text-center'>Lista de Fornecedores</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="search-form flex justify-center mb-5">
        <input
          {...register('search')}
          type="text"
          placeholder="Razão Social"
          className='px-3 py-2'
        />
        <input
          {...register('cidade')}
          type="text"
          placeholder="Cidade"
          className='px-3 py-2 ml-5'
        />
        <input
          {...register('estado')}
          type="text"
          placeholder="Estado"
          className='px-3 py-2 ml-5'
        />
        <button type="submit" className='px-3 py-2 bg-cyan-400 hover:bg-sky-400 text-white border-none 
        rounded-md cursor-pointer text-base justify ml-5 '>Procurar</button>
      </form>

      <div className='ml-[14%]'>
      {suppliers.length === 0 ? (
        <p className='mt-3 ml-2 mb-4 flex justify-center'>Sem Fornecedores.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Razão Social</th>
              <th>Nome Fantasia</th>
              <th>CNPJ</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>CEP</th>
              <th>Ações</th>
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
                  <button className='px-2 py-1 bg-green-400 hover:bg-green-700 text-white border-none 
                  rounded-md cursor-pointer text-base justify ml-2' onClick={() => openModal(supplier)}>
                    Editar
                  </button>
                  <button className='px-2 py-1 bg-red-400 hover:bg-red-700 text-white border-none 
                  rounded-md cursor-pointer text-base justify ml-2' onClick={() => handleDelete(supplier.id_fornecedor)}>
                    Deletar
                  </button>
                  <button className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
                  rounded-md cursor-pointer text-base justify ml-2' onClick={() => openProductModal(supplier)}>
                      Add Produtos
                  </button>
                  <button className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
                  rounded-md cursor-pointer text-base justify ml-2' onClick={() => openViewProductsModal(supplier)}>
                      Ver Produtos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>

      <div className="pagination ml-[40%] mr-[40%] mt-[40px]">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1}
          className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
        rounded-md cursor-pointer text-base justify mr-2 '
        >
          Anterior
        </button>
        <span className='flex-1 p-1.5 max-h-[80vh] overflow-y-auto box-border'>
          Página {data?.currentPage} de {data?.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === data?.totalPages}
          className='px-2 py-1 bg-cyan-400 hover:bg-sky-400 text-white border-none 
        rounded-md cursor-pointer text-base justify ml-2'
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
    </div>
  );
};

export default SupplierList;
