import React from 'react';
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
    return (
        <div>
            <h1 className="text-center mb-4">Lista de Setores</h1>
            <div className="sector-list bg-[#f9f9f9] rounded-lg p-4 shadow-md">
                <ul className="space-y-2">
                    {sectors.length > 0 ? (
                        sectors.map((sector) => (
                            <li
                                key={sector.id_setor}
                                className="sector-item flex justify-between items-center p-2 border-b last:border-none"
                            >
                                <span className="sector-name font-medium">
                                    {sector.nome_setor}
                                </span>
                                <div className="category-actions space-x-2">
                                    <button
                                        onClick={() => onEdit(sector)}
                                        className="edit-btn"
                                        style={{ color: '#22d3ee' }} // Azul claro
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(sector.id_setor)}
                                        className="delete-btn"
                                        style={{ color: '#f44336' }} // Vermelho
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-center text-gray-500">Não há setores registrados.</li>
                    )}
                </ul>

                <div className="pagination-controls flex justify-between items-center pt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Voltar
                    </button>
                    <span>
                        {totalPages > 0 && `Página ${currentPage} de ${totalPages}`}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="pagination-btn px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Avançar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SectorList;
