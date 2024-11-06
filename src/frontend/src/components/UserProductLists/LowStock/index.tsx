import React, { useCallback, useState } from "react";
import { FilterValues } from "..";
import useSearchProducts from "../../../Hooks/Products/getSearchProductbyNameHook";
import { useProductIds } from "../../../contexts/ProductsIdsContext";
import SearchBar from "../../ProdutosSearchBar";

const LowStockList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null });
    const { lowStockIds } = useProductIds();
    const { products, totalPages, isLoading, isError } = useSearchProducts({ ...filters, page: page, limit: 10, productsArray: lowStockIds });

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
            <SearchBar onSearchTermChange={handleSearchTermChange} />

            {/* Display loading state */}
            {isLoading && <p>Carregando produtos...</p>}

            {/* Display error state */}
            {isError && <p>Erro ao carregar produtos.</p>}

            {/* Display products if not loading or error */}
            {!isLoading && !isError && products.length > 0 ? (
                
        </>
    );
};

export default LowStockList;