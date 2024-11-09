import React, { useState, useMemo } from 'react';
import { Sector } from '../SectorTypes/types';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface SectorListProps {
    sectors: Sector[];
    currentPage: number;
    totalPages: number;
    handlePageChange: (newPage: number) => void;
    onDelete: (id_setor: number) => void;
    onEdit: (sector: Sector) => void;
}

const SectorList: React.FC<SectorListProps> = ({
    sectors,
    currentPage,
    totalPages,
    handlePageChange,
    onDelete,
    onEdit,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtra os setores com base no termo de pesquisa
    const filteredSectors = useMemo(() => {
        return sectors.filter(sector =>
            sector.nome_setor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sector.nome_setor && sector.nome_setor.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, sectors]);

    return (
        <div className="mt-8">
            {/* Barra de pesquisa */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Pesquisar setores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-1/2"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse bg-white shadow-sm rounded-lg">
                    <thead>
                        <tr className="bg-cyan-500">
                            <th className="px-4 py-2 text-left text-sm font-semibold text-white">Nome do Setor</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-white">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSectors.length > 0 ? (
                            filteredSectors.map((sector: Sector) => (
                                <tr key={sector.id_setor} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-700" title={sector.nome_setor}>
                                        {sector.nome_setor}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        <button onClick={() => onEdit(sector)} className="text-blue-500 hover:text-blue-700 mr-2">
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </button>
                                        <button onClick={() => onDelete(sector.id_setor)} className="text-red-500 hover:text-red-700">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-4 py-2 text-center text-gray-500">Não há setores registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
            <div className="flex justify-start items-center mt-4 space-x-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-300"
                >
                    Voltar
                </button>
                <span className="text-sm text-gray-600">{totalPages > 0 ? `Página ${currentPage} de ${totalPages}` : ''}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-700 disabled:bg-gray-300"
                >
                    Avançar
                </button>
            </div>
        </div>
    );
};

export default SectorList;
