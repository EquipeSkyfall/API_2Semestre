import React from "react";
import { Sector } from "../SectorTypes/types";

interface SectorListProps {
    sectors: Sector[];
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    handlePageChange: (newPage: number) => void;
    onDelete: (id_setor: number) => void;
    onEdit: (sector: Sector) => void;
}

const SectorList: React.FC<SectorListProps> = React.memo(({
    sectors,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    onDelete,
    onEdit,
}) => {
    return (
        <div className="sector-list">
            <ul>
                {sectors.length > 0 ? (
                    sectors.map((sector: Sector) => (
                        <li key={sector.id_setor} className="sector-item">
                            <span className="sector-name">{sector.nome_setor}</span>
                            <button onClick={() => onEdit(sector)} className="edit-btn">Editar</button>
                            <button onClick={() => onDelete(sector.id_setor)} className="delete-btn">Deletar</button>
                        </li>
                    ))
                ) : (
                    <li>Não há setores registrados.</li>
                )}
            </ul>

            {/* Paginação */}
            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                >Voltar</button>
                <span>{totalPages > 0 ? `Página ${currentPage} de ${totalPages}` : ''}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="pagination-btn"
                >Avançar</button>
            </div>
        </div>
    )
});

export default SectorList;