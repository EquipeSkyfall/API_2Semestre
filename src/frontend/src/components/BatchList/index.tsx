import React, { useState, useEffect } from 'react';
import useGetBatches from '../../Hooks/Batches/fetchAllBatchesHook';
import Modal from '../Modal';

const BatchesList: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [debouncedDate, setDebouncedDate] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [limit, setLimit] = useState(11);

    const { data, isLoading, isError } = useGetBatches(debouncedDate, page, limit);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 850) { // 640px é o ponto de corte para SM
                setLimit(7);
            } else if (window.innerWidth <= 1200) {
                setLimit(8);
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
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (isLoading) return <p className="text-center text-blue-600">Carregando Lotes...</p>;
    if (isError) return <p className="text-center text-red-600">Erro ao Carregar Lotes</p>;

    return (
        <div className="bg-white w-full md:w-1/2 md:h-[45rem] mt-5 md:mt-10 rounded-lg lg:text-base text-sm shadow-lg text-center flex flex-col ">
            <div className="flex-grow overflow-y-hidden p-0 sm:p-4">
                <h2 className="text-cyan-600 font-['Afacad_Flux'] text-center pt-2 sm:pt-0">Entradas</h2>

                <div className="flex justify-center -mt-2">
                    <label htmlFor="datePicker" className="mr-2 text-gray-600 mt-2">Selecione uma data:</label>
                    <input
                        type="date"
                        id="datePicker"
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-cyan-700"
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
                                className={`${index % 2 === 0 ? 'bg-[#E7E9EB]' : ''} cursor-pointer hover:bg-gray-300 p-4 rounded-lg shadow-sm transition-colors`}
                                onClick={() => handleOpenModal(batch)}
                            >
                                <td className="border-b border-gray-300 px-4 py-2">{batch.id_lote}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{new Date(batch.data_compra).toLocaleDateString()}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{batch.fornecedor.razao_social}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='items-center mr-96'>
                    {selectedBatch && (
                        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                            <div className="p-2 sm:p-6 text-xs sm:text-sm lg:text-base rounded-lg flex flex-col items-center justify-center text-center">
                                <h2 className="text-lg md:text-3xl font-semibold text-gray-800 mb-3">Detalhes de Entrada</h2>

                                <p className="text-gray-700 mb-1 text-base md:text-lg">
                                    Data de Compra: {new Date(selectedBatch.data_compra).toLocaleDateString()}
                                </p>

                                <p className="text-gray-600 text-base md:text-lg mb-4">
                                    Fornecedor: <span className="text-cyan-600 font-semibold">{selectedBatch.fornecedor.razao_social}</span>
                                </p>

                                <div className="max-w-96">
                                    <div className="grid grid-cols-3 gap-4 text-gray-800 text-sm sm:text-lg font-semibold pb-4">
                                        <span>Nome do Produto</span>
                                        <span>Validade do Produto</span>
                                        <span>Quantidade</span>
                                    </div>

                                    {selectedBatch.produtos.map((loteProduto) => (
                                        <div
                                            key={loteProduto.produto.id_produto}
                                            className="grid grid-cols-3 gap-4 py-2  text-gray-700 hover:text-cyan-600"
                                        >
                                            <span className="text-center">{loteProduto.produto.nome_produto}</span>
                                            <span className="text-center">{loteProduto.validade_produto ? new Date(loteProduto.validade_produto).toLocaleDateString() : 'N/A'}</span>
                                            <span className="text-center">{loteProduto.quantidade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </div>

            {
                data && (
                    <div className="pagination-controls py-4 flex justify-center items-center">
                        <button
                            className=" mx-2  text-white hover:bg-cyan-600 transition duration-300 bg-cyan-500 "
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Anterior
                        </button>
                        <span className="text-gray-600">
                            Página {page} de {data.totalPages}
                        </span>
                        <button
                            className="bg-cyan-500  text-white hover:bg-cyan-600 transition duration-300 mx-2"
                            disabled={page === data.totalPages}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Próxima
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default BatchesList;