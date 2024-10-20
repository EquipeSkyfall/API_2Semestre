import React, { useState, useEffect } from 'react';
import useGetShipments from '../../../Hooks/Shippments/useGetShipments';
import Modal from '../../Modal';

const ShipmentsList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [debouncedDate, setDebouncedDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10;
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

  if (isLoading) return <p className="text-center text-blue-600">Loading shipments...</p>;
  if (isError) return <p className="text-center text-red-600">Error loading shipments.</p>;

  return (
    <div className="bg-white w-1/2 h-[30rem] rounded-lg shadow-lg text-center">
      <h2 className="text-cyan-600 font-['Afacad_Flux']">Saídas</h2>

      <div className="flex justify-center mt-4">
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
          <tr className="bg-gray-100">
            <th className="border-b border-gray-300 px-4 py-2">ID Saída</th>
            <th className="border-b border-gray-300 px-4 py-2">Data da Venda</th>
            <th className="border-b border-gray-300 px-4 py-2">Motivo da Saída</th>
          </tr>
        </thead>
        <tbody>
          {data?.shipments.map((shipment, index) => (
            <tr
              key={shipment.id_saida}
              className={`${index % 2 === 0 ? 'bg-[#E7E9EB]' : ''} cursor-pointer hover:bg-gray-200 transition-colors`}
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
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalhes de Saída</h3>
            <p className="text-gray-700">
              Data da Venda: {new Date(selectedShipment.data_venda).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Motivo da Saída: {selectedShipment.motivo_saida}</p>

            {selectedShipment.saidaProdutos && selectedShipment.saidaProdutos.length > 0 && (
              <div className="mt-4">
                {Object.entries(
                  selectedShipment.saidaProdutos.reduce((acc, saidaProduto) => {
                    const { id_produto, id_lote, quantidade_retirada } = saidaProduto;
                    const nome_produto = saidaProduto.loteProduto.produto.nome_produto;

                    if (!acc[id_produto]) {
                      acc[id_produto] = { nome_produto, lotes: [], totalQuantidadeRetirada: 0 };
                    }
                    acc[id_produto].lotes.push({ id_lote, quantidade_retirada });
                    acc[id_produto].totalQuantidadeRetirada += quantidade_retirada;
                    return acc;
                  }, {} as Record<number, { nome_produto: string; lotes: { id_lote: number; quantidade_retirada: number }[]; totalQuantidadeRetirada: number }>)
                ).map(([id_produto, { nome_produto, lotes, totalQuantidadeRetirada }]) => {
                  const isCollapsed = collapsedBatches[id_produto] || false;

                  return (
                    <div key={id_produto}>
                      <h4
                        className="text-lg font-medium text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => toggleCollapse(id_produto)}
                      >
                        Produto: {nome_produto} - Quantidade Retirada: {totalQuantidadeRetirada} {isCollapsed ? '▼' : '▲'}
                      </h4>
                      {isCollapsed && (
                        <ul className="ml-4 mt-2 space-y-2">
                          {lotes.map(({ id_lote, quantidade_retirada }) => (
                            <li key={`${id_lote}-${quantidade_retirada}`} className="text-gray-600">
                              ID Lote: {id_lote} | Quantidade Retirada: {quantidade_retirada}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal>
      )}

      {data && (
        <div className="pagination-controls">
          <button
            className="pagination-button"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {page} of {data.totalPages}
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
