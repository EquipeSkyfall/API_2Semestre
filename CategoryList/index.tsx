import React from "react";
import { Category } from "../CategoryTypes/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import './styles.css';

interface CategoryListProps {
    categories: Category[];
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    handlePageChange: (newPage: number) => void;
    onDelete: (id_categoria: number) => void;
    onEdit: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = React.memo(({
    categories,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    onDelete,
    onEdit,
}) => {
    return (
        <>
            <div>
                <h1 className="text-center mb-4">Lista de Categorias</h1>
            </div>
            <div className="category-list">
                <ul>
                    {categories.length > 0 ? (
                        categories.map((category: Category) => (
                            <li key={category.id_categoria} className="category-item">
                                <span className="category-name truncate" title={category.nome_categoria}>
                                    {category.nome_categoria} |{" "}
                                    <span className="truncate" title={category.descricao_categoria}>
                                        {category.descricao_categoria}
                                    </span>
                                </span>
                                <div className="category-actions">
                                    <button onClick={() => onEdit(category)} className="edit-btn">
                                        <FontAwesomeIcon icon={faPencilAlt} className="edit-icon" />
                                    </button>
                                    <button onClick={() => onDelete(category.id_categoria)} className="delete-btn">
                                        <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>Não há categorias registradas.</li>
                    )}
                </ul>

                {/* Paginação */}
                <div className="pagination-controls">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Voltar
                    </button>
                    <span>{totalPages > 0 ? `Página ${currentPage} de ${totalPages}` : ''}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="pagination-btn"
                    >
                        Avançar
                    </button>
                </div>
            </div>
        </>
    );
});

export default CategoryList;
