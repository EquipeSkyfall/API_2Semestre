import React, { useCallback, useState } from "react";
import { FilterValues } from "..";
import { useProductIds } from "../../../contexts/ProductsIdsContext";
import SearchBar from "../../ProdutosSearchBar";
import useAlertProducts from "../../../Hooks/Products/getAlertProductsHook";

const LowStockList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null });
    const { lowStockIds } = useProductIds();
    const { products, totalPages, isLoading, isError } = useAlertProducts({ ...filters, page: page, limit: 10, productsArray: lowStockIds });

    const handleSearchTermChange = useCallback(
        (term: string, categoryId: number | null, sectorId: number | null) => {
            setFilters({
                search: term,
                id_setor: sectorId,
                id_categoria: categoryId,
            })
            setPage(1); // Reset to the first page on new search
        },
        []
    );

    return (
        <>
            <h2>Produtos com Estoque Baixo</h2>
            <SearchBar onSearchTermChange={handleSearchTermChange} />

            {/* Display loading state */}
            {isLoading && <p>Carregando produtos...</p>}

            {/* Display error state */}
            {isError && <p>Erro ao carregar produtos.</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome do Produto</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && !isError && products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id_produto}>
                                <td>{product.id_produto}</td>
                                <td>{product.nome_produto}</td>
                                <td>{product.total_estoque}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>Nenhum produto encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="page" >
                <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    Anterior
                </button>
                <span>Página {page} de {totalPages}</span>
                <button type="button" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                    Próxima
                </button>
            </div>
        </>
    );
};

export default LowStockList;