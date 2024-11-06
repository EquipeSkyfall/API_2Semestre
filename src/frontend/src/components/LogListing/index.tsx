import React, { useState, useEffect } from "react";
import useGetLogs from "../../Hooks/Logs/getLogs";

const LogList: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [debouncedDate, setDebouncedDate] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const limit = 7;

    const { data, isLoading, isError } = useGetLogs(debouncedDate, page, limit);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedDate(selectedDate);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [selectedDate]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        setPage(1); // Reset to the first page on date change
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button
                onClick={openModal}
                className="absolute top-32 right-6 px-5 py-3 bg-cyan-400 hover:bg-cyan-500   transition duration-300 text-white border-none rounded-md cursor-pointer">
                Ver Logs
            </button>

            {isModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex !justify-end" onClick={closeModal}>
                    <div
                        className="modal-content justify-start items-end h-full p-6 fixed overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}>
                        <button className="close-button absolute top-4 right-4" onClick={closeModal}>X</button>
                        <div className="overflow-">
                            <h2 className="font-semibold font-['Afacad_Flux'] text-cyan-600 mb-4">Logs do Sistema</h2>
                            <div className="mb-4">
                                <label htmlFor="datePicker" className="block font-medium mb-1">Selecione uma data:</label>
                                <input
                                    type="date"
                                    id="datePicker"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="border text-center rounded-md p-2 w-full"
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <p>Carregando Logs...</p>
                        ) : isError ? (
                            <p>Erro ao Carregar Logs</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th>Data do processo</th>
                                        <th>ID Usuário</th>
                                        <th>Nome Usuário</th>
                                        <th>Ação</th>
                                        <th>ID Objeto</th>
                                        <th>Nome Objeto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.enrichedLogs.map((log) => (
                                        <tr key={log.id_log}>
                                            <td className="pt-4">{log.data_processo}</td>
                                            <td className="pt-4">{log.id_user}</td>
                                            <td className="pt-4">{log.users.name}</td>
                                            <td className="pt-4">{log.action_type}</td>
                                            <td className="pt-4">{log.id_categoria || log.id_setor || log.id_produto || log.id_fornecedor || log.id_lote || log.id_saida || log.id_affected_user}</td>
                                            <td className="pt-4">{log.nome_categoria || log.nome_setor || log.nome_produto || log.nome_fornecedor || log.nome_affected_user || '---'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
        
                        {data && (
                            <div className="flex justify-between items-center w-11/12 py-4 fixed bottom-0">
                                <button
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}
                                    className="px-4 py-2 text-white bg-cyan-400 hover:bg-cyan-600 transition duration-300 rounded-md disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                <span>
                                    Página {page} de {data.totalPages}
                                </span>
                                <button
                                    disabled={page === data.totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                    className="px-4 py-2 text-white bg-cyan-400 hover:bg-cyan-600 transition duration-300 rounded-md disabled:opacity-50"
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            )
            }
        </div >
    );
};

export default LogList;