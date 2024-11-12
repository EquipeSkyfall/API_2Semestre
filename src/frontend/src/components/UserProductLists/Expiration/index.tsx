import React, { useCallback, useState, useEffect } from "react";
import { FilterValues } from "..";
import { useProductIds } from "../../../contexts/ProductsIdsContext";
import SearchBar from "../../ProdutosSearchBar";
import useAlertProducts from "../../../Hooks/Products/getAlertProductsHook";

const ExpiringList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [filters, setFilters] = useState<FilterValues>({
        search: "",
        id_setor: null,
        id_categoria: null,
    });
    const { expiringIds } = useProductIds();
    const { products, totalPages, isLoading, isError } = useAlertProducts({
        ...filters,
        page,
        limit,
        productsArray: expiringIds,
    });

    // Função para atualizar os filtros
    const handleSearchTermChange = useCallback(
        (term: string, categoryId: number | null, sectorId: number | null) => {
            setFilters({
                search: term,
                id_setor: sectorId,
                id_categoria: categoryId,
            });
            setPage(1); // Resetar para a primeira página sempre que um novo filtro for aplicado
        },
        []
    );

    // Responsivamente ajustar limite com base no tamanho da janela
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1023) {
                setLimit(6);
            } else if (window.innerWidth <= 1200) {
                setLimit(4);
            } else if (window.innerWidth <= 1500) {
                setLimit(5);
            } else {
                setLimit(6);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Definir limite inicial com base no tamanho atual da janela

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="bg-white p-5 text-sm 2xl:text-base rounded-md shadow-md flex flex-col items-center transition-all duration-300 relative 2xl:h-[30vw] lg:h-[45vw] lg:w-[25vw] md:h-[60vw] md:w-[45vw] sm:h-[70vw] sm:w-[90vw] h-[210vw] w-[80vw] md:mt-0 mt-5">
            <h2 className="text-lg 2xl:text-2xl font-semibold mb-4 text-center text-cyan-600">
                Produtos próximos da validade
            </h2>
            <SearchBar onSearchTermChange={handleSearchTermChange} />

            {isLoading && <p className="text-gray-500">Carregando produtos...</p>}
            {isError && <p className="text-red-500">Erro ao carregar produtos.</p>}

            <div className="flex-grow">
                <table className="w-full border border-gray-200 rounded-md overflow-hidden mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left font-semibold text-gray-700 border-b">
                                ID
                            </th>
                            <th className="p-2 text-left font-semibold text-gray-700 border-b">
                                Nome do Produto
                            </th>
                            <th className="p-2 text-left font-semibold text-gray-700 border-b">
                                Quantidade
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoading && !isError && products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product.id_produto}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3 border-b text-gray-600">
                                        {product.id_produto}
                                    </td>
                                    <td className="p-3 border-b text-gray-600">
                                        {product.nome_produto}
                                    </td>
                                    <td className="p-3 border-b text-gray-600">
                                        {product.total_estoque}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-3 text-center text-gray-500">
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls flex justify-between items-center mt-4 text-sm 2xl:text-base w-full">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`py-2 px-2 sm:py-2 sm:px-4 rounded ${page === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-cyan-600 text-white"
                        }`}
                >
                    Anterior
                </button>
                <span className="text-gray-600 2xl:text-base text-xs">
                    Página {page} de {totalPages}
                </span>
                <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`py-2 px-2 sm:py-2 sm:px-4 rounded ${page === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-cyan-500 hover:bg-cyan-600 text-white"
                        }`}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default ExpiringList;
