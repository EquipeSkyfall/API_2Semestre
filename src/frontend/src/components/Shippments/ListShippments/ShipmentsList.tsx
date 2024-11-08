import React, { useState, useEffect } from 'react';
import useGetShipments from '../../../Hooks/Shippments/useGetShipments';
import Modal from '../../Modal';

const ShipmentsList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [debouncedDate, setDebouncedDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(11);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [collapsedBatches, setCollapsedBatches] = useState<{ [key: number]: boolean }>({});

  const { data, isLoading, isError } = useGetShipments(debouncedDate, page, limit);

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth <= 850) { 
            setLimit(7);
        } else if (window.innerWidth <=1070) {
          setLimit (8)
        }
         else if (window.innerWidth <= 1200) {
            setLimit(10);
        } else{
            setLimit(11)
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

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
    <div className="bg-white w-full md:w-1/2 md:h-[45rem] mt-5 md:mt-10 rounded-lg lg:text-base text-sm shadow-lg text-center flex flex-col">
      <div className="flex-grow overflow-y-hidden p-0 sm:p-4">
        <h2 className="text-cyan-600 font-['Afacad_Flux'] pt-2 sm:pt-0">Saídas</h2>

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
              <th className="px-4 py-2">Data da Venda</th>
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
            <div className="p-2 sm:p-6 text-xs sm:text-sm lg:text-base rounded-lg flex flex-col items-center justify-center text-center">
              <h2 className="text-lg md:text-3xl font-semibold text-gray-800 mb-3">Detalhes de Saída</h2>
              <p className="text-gray-700 mb-1 text-base md:text-lg">
                Data da Venda: {new Date(selectedShipment.data_venda).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-base md:text-lg mb-4">
                Motivo da Saída: <span className="text-cyan-600 font-semibold"> {selectedShipment.motivo_saida} </span>
              </p>

              {selectedShipment.saidaProdutos && selectedShipment.saidaProdutos.length > 0 && (
                <div className="flex flex-col w-full items-center">
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
                      <div key={id_produto} className="w-full flex flex-col items-start mb-4 border-b-2">
                        <div
                          className="flex justify-between items-center border-b-black w-full px-2 sm:px-4 sm:py-2 py-1 text-sm sm:text-lg font-medium text-gray-800 cursor-pointer hover:text-cyan-600 transition-colors"
                          onClick={() => toggleCollapse(id_produto)}
                        >
                          <span className='flex-grow text-left'>Produto: {nome_produto}</span>
                          <span className="text-left pl-4 sm:pl-0">Quantidade Retirada: {totalQuantidadeRetirada}</span>
                          <span className="ml-18 sm:ml-24">{isCollapsed ? '▼' : '▲'}</span>
                        </div>

                        {isCollapsed && (
                          <ul className="space-y-2">
                            {lotes.map(({ id_lote, quantidade_retirada }) => (
                              <li key={`${id_lote}-${quantidade_retirada}`} className="flex text-gray-600 w-full px-4 pb-2">
                                <span className="flex-1">ID Lote: {id_lote}</span>
                                <span className="flex-2 w-10 text-cyan-600">|</span>
                                <span className="flex-2">Quantidade Retirada: {quantidade_retirada}</span>
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
      </div>

      {data && (
        <div className="pagination-controls py-4 flex justify-center items-center">
          <button
            className=" text-white hover:bg-cyan-600 transition duration-300 bg-cyan-500"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Anterior
          </button>
          <span className="text-gray-600 mx-2">
            Página {page} de {data.totalPages}
          </span>
          <button
            className=" text-white hover:bg-cyan-600 transition duration-300 bg-cyan-500"
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