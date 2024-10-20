import React, { useState, useEffect } from 'react';
import useGetBatches from '../../Hooks/Batches/fetchAllBatchesHook';
import Modal from '../Modal';

const BatchesList: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [debouncedDate, setDebouncedDate] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const { data, isLoading, isError } = useGetBatches(debouncedDate, page, 10);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedDate(selectedDate);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [selectedDate]);

    const handleOpenModal = (id_batch) => {
        setSelectedBatch(id_batch);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBatch(null);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        setPage(1); // Reset to the first page on date change
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    };

    if (isLoading) return <p>Loading batches...</p>
    if (isError) return <p>Error loading batches.</p>

    return (
        <div>
            <h2>Batches List</h2>
            <label htmlFor="datePicker">Select a date:</label>
            <input
                type="date"
                id="datePicker"
                value={selectedDate}
                onChange={handleDateChange}
            />
            <ul>
                {data?.batchListWithChecks.map((batch) => (
                    <li key={batch.id_batch} onClick={() => handleOpenModal(batch)}>
                        <p>Data de Compra: {new Date(batch.data_compra).toLocaleDateString()}</p>
                        <p>Fornecedor: {batch.fornecedor.razao_social}</p>
                    </li>
                ))}
            </ul>
            {selectedBatch && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div>
                        <h3>Batch Details</h3>
                        <p>Data de Compra: {new Date(selectedBatch.data_compra).toLocaleDateString()}</p>
                        <p>Fornecedor: {selectedBatch.fornecedor.razao_social}</p>

                        {selectedBatch.produtos.map((loteProduto) => (
                            <li key={loteProduto.produto.id_produto}>
                                <p>Nome do Produto: {loteProduto.produto.nome_produto}
                                     - Validade do Produto: {loteProduto.validade_produto ? new Date(loteProduto.validade_produto).toLocaleDateString() : 'N/A'}
                                     - Quantidade: {loteProduto.quantidade}</p>
                            </li>
                        ))}
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
    )
};

export default BatchesList;