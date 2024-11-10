import React, { useState, useMemo, useEffect } from "react";
import { Category } from "../CategoryTypes/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

interface CategoryListProps {
    searchTerm: (search: string) => void;
    categories: Category[];
    currentPage: number;
    totalPages: number;
    handlePageChange: (newPage: number) => void;
    onDelete: (id_categoria: number) => void;
    onEdit: (category: Category) => void;
    successMessage?: string;
}

const CategoryList: React.FC<CategoryListProps> = React.memo(({
    searchTerm,
    categories,
    currentPage,
    totalPages,
    handlePageChange,
    onDelete,
    onEdit,
    successMessage,
}) => {
    const [search, setSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            searchTerm(search);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search, searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <div className="mt-8">
            {/* Exibe a mensagem de sucesso, se existir */}
            {successMessage && (
                <div className="bg-green-500 text-white text-center p-2 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {/* Barra de pesquisa */}
            <div className="form-field mb-4">
                <input
                    type="text"
                    placeholder="Pesquisar categorias..."
                    value={search}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-1/2"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse bg-white shadow-sm rounded-lg">
                    <thead>
                        <tr className="bg-cyan-500">
                            <th className="px-4 py-2 text-left text-sm font-semibold text-white w-1/4 sm:w-1/3">Nome</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-white w-1/2 sm:w-1/3">Descrição</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-white w-1/4 sm:w-1/3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category: Category) => (
                                <tr key={category.id_categoria} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-700 truncate" style={{ maxWidth: '200px' }} title={category.nome_categoria}>
                                        {category.nome_categoria}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700 truncate" style={{ maxWidth: '300px' }} title={category.descricao_categoria}>
                                        {category.descricao_categoria}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700 flex items-center gap-2">
                                        <button onClick={() => onEdit(category)} className="text-blue-500 hover:text-blue-700">
                                            <FontAwesomeIcon icon={faPencilAlt} />
                                        </button>
                                        <button onClick={() => onDelete(category.id_categoria)} className="text-red-500 hover:text-red-700">
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">Não há categorias registradas.</td>
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
});

export default CategoryList;
