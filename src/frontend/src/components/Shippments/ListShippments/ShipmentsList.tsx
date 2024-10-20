import React, { useState, useEffect } from 'react';
import useGetShipments from '../../../Hooks/Shippments/useGetShipments';
import Modal from '../../Modal';

const ShipmentsList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [debouncedDate, setDebouncedDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10; // Number of items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [collapsedBatches, setCollapsedBatches] = useState<{ [key: number]: boolean }>({});

  const { data, isLoading, isError } = useGetShipments(debouncedDate, page, limit);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDate(selectedDate);
  }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler); // Cleanup the timeout on unmount or when selectedDate changes
    };
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
      [id_produto]: !prev[id_produto], // Toggle the collapsed state for this id_lote
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setPage(1); // Reset to the first page on date change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // \/ The fuck is this?? \/
  
  // const formatDateForBackend = (date: string) => {
  //   // Convert date string to a JavaScript Date object
  //   const dateObject = new Date(date);
  //   // Optional: Format to ISO string if needed
  //   return dateObject.toISOString(); // or return dateObject if you need a Date object
  // };

  // const parsedDate = selectedDate ? formatDateForBackend(selectedDate) : '';

  console.log(data)

  if (isLoading) return <p>Loading shipments...</p>;
  if (isError) return <p>Error loading shipments.</p>;

  return (
    <div>
      <h2>Shipments List</h2>
      <label htmlFor="datePicker">Select a date:</label>
      <input
        type="date"
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <ul>
        {data?.shipments.map((shipment) => (
          <li key={shipment.id_saida} onClick={() => handleOpenModal(shipment)}>
            <p>Data da Venda: {new Date(shipment.data_venda).toLocaleDateString()}</p>
            <p>Motivo da Saída: {shipment.motivo_saida}</p>
          </li>
        ))}
      </ul>
      {/* Modal for showing detailed products information */}
      {selectedShipment && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div>
            <h3>Shipment Details</h3>
            <p>Data da Venda: {new Date(selectedShipment.data_venda).toLocaleDateString()}</p>
            <p>Motivo da Saída: {selectedShipment.motivo_saida}</p>

            {/* Group products inside the modal */}
            {selectedShipment.saidaProdutos && selectedShipment.saidaProdutos.length > 0 && (
              <div>
                {Object.entries(
                  selectedShipment.saidaProdutos.reduce((acc, saidaProduto) => {
                    const { id_produto, id_lote, quantidade_retirada } = saidaProduto;
                    const nome_produto = saidaProduto.loteProduto.produto.nome_produto; // Extract product name

                    // Initialize the array for the product if it doesn't exist
                    if (!acc[id_produto]) {
                      acc[id_produto] = { nome_produto, lotes: [], totalQuantidadeRetirada: 0 };
                    }
                    // Push the lote details into the product's array
                    acc[id_produto].lotes.push({ id_lote, quantidade_retirada });
                    acc[id_produto].totalQuantidadeRetirada += quantidade_retirada;
                    return acc;
                  }, {} as Record<number, { nome_produto: string; lotes: { id_lote: number; quantidade_retirada: number }[]; totalQuantidadeRetirada: number }>)
                ).map(([id_produto, { nome_produto, lotes, totalQuantidadeRetirada }]) => {
                  const isCollapsed = collapsedBatches[id_produto] || false; // Get the collapsed state

                  return (
                    <div key={id_produto}>
                      <h4 onClick={() => toggleCollapse(id_produto)} style={{ cursor: 'pointer' }}>
                        Produto: {nome_produto} - Quantidade Retirada: {totalQuantidadeRetirada} {isCollapsed ? '▼' : '▲'}
                      </h4>
                      {isCollapsed && (
                        <ul>
                          {lotes.map(({ id_lote, quantidade_retirada }) => (
                            <li key={`${id_lote}-${quantidade_retirada}`}>
                              <p>ID Lote: {id_lote} | Quantidade Retirada: {quantidade_retirada}</p>
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
        <div>
          <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {data.totalPages}
          </span>
          <button
            disabled={page === data.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentsList;
