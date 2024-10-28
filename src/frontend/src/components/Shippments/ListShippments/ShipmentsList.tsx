import React, { useState, useEffect } from 'react';
import useGetShipments from '../../../Hooks/Shippments/useGetShipments';
import Modal from '../../Modal';

const ShipmentsList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [debouncedDate, setDebouncedDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 11;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [collapsedBatches, setCollapsedBatches] = useState<{ [key: number]: boolean }>({});

  const { data, isLoading, isError } = useGetShipments(debouncedDate, page, limit);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDate(selectedDate);
    }, 300);

    return () => clearTimeout(handler);
  }, [selectedDate]);

  const handleOpenModal = (shipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCollapsedBatches({});
    setIsModalOpen(false);
    setSelectedShipment(null);
  };

  const toggleCollapse = (id_produto) => {
    setCollapsedBatches((prev) => ({
      ...prev,
      [id_produto]: !prev[id_produto],
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <p className="text-center text-blue-600">Carregando Saídas...</p>;
  if (isError) return <p className="text-center text-red-600">Erro ao Carregar as Saídas.</p>;

  return (
    <div className="bg-white w-1/2 h-[45rem] mt-10 rounded-lg shadow-lg flex flex-col text-center">
      <div className="flex-grow overflow-y-auto p-4">
        <h2 className="text-cyan-600 font-['Afacad_Flux']">Saídas</h2>

        <div className="flex justify-center -mt-2">
          <label htmlFor="datePicker" className="mr-2 text-gray-600 mt-2">Selecione uma data:</label>
          <input
            type="date"
            id="datePicker"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <table className="ws-table-all w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 px-4 py-2">
              <th className="px-4 py-2">ID Saída</th>
              <th className="px-4 py-2">Data de Venda</th>
              <th className="px-4 py-2">Motivo da Saída</th>
            </tr>
          </thead>
          <tbody>
            {data?.shipments.map((shipment, index) => (
              <tr
                key={shipment.id_saida}
                className={`${index % 2 === 0 ? 'bg-[#E7E9EB]' : ''} cursor-pointer hover:bg-gray-300 transition-colors`}
                onClick={() => handleOpenModal(shipment)}
              >
                <td className="border-b border-gray-300 px-4 py-2">{shipment.id_saida}</td>
                <td className="border-b border-gray-300 px-4 py-2">{new Date(shipment.data_venda).toLocaleDateString()}</td>
                <td className="border-b border-gray-300 px-4 py-2">{shipment.motivo_saida}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedShipment && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <div className="p-6 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-gray-800 mb-3">Detalhes de Saída</h3>
              <p className="text-gray-700 mb-1 text-lg">
                Data da Venda: {new Date(selectedShipment.data_venda).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-lg mb-4">
                Motivo da Saída: <span className="text-cyan-600 font-semibold">{selectedShipment.motivo_saida}</span>
              </p>

              {selectedShipment.saidaProdutos && selectedShipment.saidaProdutos.length > 0 && (
                <div className="mt-4">
                  {/* Cabeçalho da Tabela */}
                  <div className="grid grid-cols-3 gap-4 text-lg pb-2 font-semibold text-gray-800">
                    <span>Produto</span>
                    <span>Lote</span>
                    <span>Quantidade Retirada</span>
                  </div>

                  {/* Conteúdo da Tabela */}
                  {selectedShipment.saidaProdutos.map((saidaProduto) => {
                    const { id_produto, id_lote, quantidade_retirada } = saidaProduto;
                    const nome_produto = saidaProduto.loteProduto.produto.nome_produto;

                    return (
                      <div key={id_produto} className="grid grid-cols-3 gap-4 py-2 text-gray-700 hover:text-cyan-600">
                        <span className="text-center">{nome_produto}</span>
                        <span className="text-center">{id_lote}</span>
                        <span className="text-center">{quantidade_retirada}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>

      {data && (
        <div className="pagination-controls py-4 flex justify-center items-center">
          <button
            className="pagination-button"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Anterior
          </button>
          <span className="text-gray-600 mx-2">
            Página {page} de {data.totalPages}
          </span>
          <button
            className="pagination-button"
            disabled={page === data.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentsList;