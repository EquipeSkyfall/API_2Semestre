import React, { useState, useEffect } from "react";
import useGetLogs from "../../Hooks/Logs/getLogs";

const LogList: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [debouncedDate, setDebouncedDate] = useState<string>('');
    const [page, setPage] = useState(1);
    const limit = 11;

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

    if (isLoading) return <p>Carregando Logs...</p>;
    if (isError) return <p>Erro ao Carregar Logs</p>;

    return (
        <div>
            <h2>Logs do Sistema</h2>

            <div>
                <label htmlFor="datePicker">Selecione uma data:</label>
                <input
                    type="date"
                    id="datePicker"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Data do processo</th>
                        <th>ID Usuário</th>
                        <th>Nome Usuário</th>
                        <th>Ação</th>
                        <th>ID Objeto</th>
                        <th>Nome Objeto</th>
                        {/* <th>Nome</th> */}
                    </tr>
                </thead>
                <tbody>
                    {data?.enrichedLogs.map((log, index) => (
                        <tr key={log.id_log}>
                            <td>{log.data_processo}</td>
                            <td>{log.id_user}</td>
                            <td>{log.users.name}</td>
                            <td>{log.action_type}</td>
                            <td>{log.id_categoria || log.id_setor || log.id_produto || log.id_fornecedor || log.id_lote || log.id_saida || log.id_affected_user}</td>
                            <td>{log.nome_categoria || log.nome_setor || log.nome_produto || log.nome_fornecedor || log.nome_affected_user || '---'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {
                data && (
                    <div>
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {page} de {data.totalPages}
                        </span>
                        <button
                            disabled={page === data.totalPages}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Próxima
                        </button>
                    </div>
                )
            }
        </div>
    )
};

export default LogList;