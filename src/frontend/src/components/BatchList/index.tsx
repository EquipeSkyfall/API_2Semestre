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

    const handleOpenModal = (batch) => {
        setSelectedBatch(batch);
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
        setPage(newPage);
    };

    if (isLoading) return <p className="text-center text-blue-600">Loading batches...</p>;
    if (isError) return <p className="text-center text-red-600">Error loading batches.</p>;

    return (
        <div className="bg-white w-1/2 h-[30rem] rounded-lg shadow-lg text-center">
            <h2 className="text-cyan-600 font-['Afacad_Flux']">Entradas</h2>

            <div className="flex justify-center mt-4">
                <label htmlFor="datePicker" className="mr-2 text-gray-600 mt-2">Selecione um data:</label>
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
                        <th className="border-b border-gray-300 px-4 py-2">ID Compra</th>
                        <th className="border-b border-gray-300 px-4 py-2">Data de Compra</th>
                        <th className="border-b border-gray-300 px-4 py-2">Fornecedor</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.batchListWithChecks.map((batch, index) => (
                        <tr
                            key={batch.id_lote}
                            className={`${index % 2 === 0 ? 'bg-[#E7E9EB]' : ''} cursor-pointer hover:bg-gray-200 p-4 rounded-lg shadow-sm transition-colors`}
                            onClick={() => handleOpenModal(batch)}
                        >
                            <td className="border-b border-gray-300 px-4 py-2">{batch.id_lote}</td>
                            <td className="border-b border-gray-300 px-4 py-2">{new Date(batch.data_compra).toLocaleDateString()}</td>
                            <td className="border-b border-gray-300 px-4 py-2">{batch.fornecedor.razao_social}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {selectedBatch && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalhes de Entrada</h3>
                        <p className="text-gray-700">
                            Data de Compra: {new Date(selectedBatch.data_compra).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">Fornecedor: {selectedBatch.fornecedor.razao_social}</p>

                        {selectedBatch.produtos.map((loteProduto) => (
                            <li key={loteProduto.produto.id_produto} className="mt-2">
                                <p className="text-gray-600">
                                    Nome do Produto: {loteProduto.produto.nome_produto} - Validade do Produto: {loteProduto.validade_produto ? new Date(loteProduto.validade_produto).toLocaleDateString() : 'N/A'} - Quantidade: {loteProduto.quantidade}
                                </p>
                            </li>
                        ))}
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

export default BatchesList;
