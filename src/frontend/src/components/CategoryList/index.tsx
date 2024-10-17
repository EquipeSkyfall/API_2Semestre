import React from "react";
import { Category } from "../CategoryTypes/types";

// interface Category extends CategorySchema {
//     id_categoria: number;
// }

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
        <div className="category-list">
            <ul>
                {categories.length > 0 ? (
                    categories.map((category: Category) => (
                        <li key={category.id_categoria} className="category-item">
                            <span className="category-name">{category.nome_categoria}</span>
                            <button onClick={() => onEdit(category)} className="edit-btn">Editar</button>
                            <button onClick={() => onDelete(category.id_categoria)} className="delete-btn">Deletar</button>
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
                >Voltar</button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="pagination-btn"
                >Avançar</button>
            </div>
        </div>
    )
});

export default CategoryList;