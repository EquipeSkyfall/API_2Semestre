import React, { useCallback, useState } from "react";
import { FilterValues } from "..";
import { useProductIds } from "../../../contexts/ProductsIdsContext";
import SearchBar from "../../ProdutosSearchBar";
import useAlertProducts from "../../../Hooks/Products/getAlertProductsHook";

const LowStockList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null });
    const { lowStockIds } = useProductIds();
    const { products, totalPages, isLoading, isError } = useAlertProducts({ ...filters, page: page, limit: 6, productsArray: lowStockIds });

    const handleSearchTermChange = useCallback(
        (term: string, categoryId: number | null, sectorId: number | null) => {
            setFilters({
                search: term,
                id_setor: sectorId,
                id_categoria: categoryId,
            });
            setPage(1); // Reset to the first page on new search
        },
        []
    );

    return (
        <div className="bg-white p-5 rounded-md shadow-md flex flex-col items-center transition-all duration-300 relative h-[30vw] w-[25vw]">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-600">Produtos com Estoque Baixo</h2>
            <SearchBar onSearchTermChange={handleSearchTermChange} className="w-full" />
            {/* Display loading state */}
            {isLoading && <p>Carregando produtos...</p>}

            {/* Display error state */}
            {isError && <p>Erro ao carregar produtos.</p>}

            <table className="w-full border border-gray-200 rounded-md overflow-hidden mt-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 text-left font-semibold text-gray-700 border-b">ID</th>
                        <th className="p-2 text-left font-semibold text-gray-700 border-b">Nome do Produto</th>
                        <th className="p-2 text-left font-semibold text-gray-700 border-b">Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && !isError && products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id_produto} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 border-b text-gray-600">{product.id_produto}</td>
                                <td className="p-3 border-b text-gray-600">{product.nome_produto}</td>
                                <td className="p-3 border-b text-gray-600">{product.total_estoque}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="p-3 text-center text-gray-500">Nenhum produto encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-between pagination-controls items-center mt-4 w-full">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`mx-2 py-2 px-4 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600 text-white"}`}
                >
                    Anterior
                </button>
                <span className="text-gray-600">Página {page} de {totalPages}</span>
                <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`mx-2 py-2 px-4 rounded ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600 text-white"}`}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default LowStockList;