import SearchBar from "../../ProdutosSearchBar";
import useSearchProducts from "../../../Hooks/Products/getSearchProductbyNameHook";
import { useCallback, useEffect, useState } from "react";
import { ProductSchema } from "../../ProductForm/ProductSchema/productSchema";
import './styles.css'
interface Product extends ProductSchema {
    id_produto: number;
    total_estoque: number;
}

interface FilterValues {
    search: string;
    id_setor: number | null;
    id_categoria: number | null;
}

interface ShipmentProductsProps {
    onProductsSelected: (selectedProducts: { id_produto: number, nome_produto: string, total_estoque: number }[]) => void;
    removedProductId: number | null;
    resetKey: number;
}

const ShipmentProducts: React.FC<ShipmentProductsProps> = ({ onProductsSelected, removedProductId, resetKey }) => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null })
    const { products, totalPages, isLoading, isError } = useSearchProducts({ ...filters, page: page, limit: 10, forshipping: 1 })
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [sentProducts, setSentProducts] = useState<{ id_produto: number, nome_produto: string, total_estoque: number }[]>([]);

    useEffect(() => {
        setSelectedProducts([])
        setSentProducts([])
        setPage(1)
    }, [resetKey])

    useEffect(() => {
        if (removedProductId !== null) {
            // Remove the sent product that matches the removedProductId
            setSentProducts((prevSentProducts) =>
                prevSentProducts.filter(product => product.id_produto !== removedProductId)
            );
            // Uncheck the checkbox for the removed product if it was selected
            setSelectedProducts((prevSelected) =>
                prevSelected.filter(product => product.id_produto !== removedProductId)
            );
        }
    }, [removedProductId]);

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

    const handleCheckboxChange = (product: Product) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.some((p) => p.id_produto === product.id_produto)) {
                // Remove the product if already selected
                return prevSelected.filter((p) => p.id_produto !== product.id_produto);
            } else {
                // Add the product if not selected
                return [...prevSelected, product];
            }
        });
    };

    const handleSendSelectedProducts = () => {
        const selected = selectedProducts.map((product) => ({ id_produto: product.id_produto, nome_produto: product.nome_produto, total_estoque: product.total_estoque }));
        setSentProducts(selected)
        onProductsSelected(selected); // Send selected products to the parent component
    };

    return (
        <div>
            <h2 className="align_conf">Selecionar Produtos</h2>
            <div className="product_list">
                {/*<SearchBar onSearchTermChange={handleSearchTermChange} />*/}

                {/* Display loading state */}
                {isLoading && <p>Carregando produtos...</p>}

                {/* Display error state */}
                {isError && <p>Erro ao carregar produtos.</p>}

                {/* Display products if not loading or error */}
                {!isLoading && !isError && products.length > 0 ? (
                    <ul className="check-shipping-products" >
                        {products.map((product) => (
                            <li key={product.id_produto}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px",
                                    border: "1px dotted #ccc",
                                }}>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                    }}>
                                    <input
                                        type="checkbox"
                                        className="checkbox flex justify-between w-1/12"
                                        checked={selectedProducts.some((p) => p.id_produto === product.id_produto)}
                                        onChange={() => handleCheckboxChange(product)}
                                        disabled={sentProducts.some((p) => p.id_produto === product.id_produto)}
                                    />
                                    <div style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                                        <div>
                                            <span style={{ flexGrow: 1 }}>{product.nome_produto}</span>{" "}
                                        </div>
                                        <span style={{ marginLeft: "auto" }}>
                                            {product.total_estoque} disponíveis
                                        </span>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !isLoading && !isError && <p>Nenhum produto encontrado.</p>
                )}

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div className="page" >
                        <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                            Anterior
                        </button>
                        <span>Página {page} de {totalPages}</span>
                        <button type="button" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                            Próxima
                        </button>
                    </div>
                )}

                {/* Send selected products button */}
                <button type="button" onClick={handleSendSelectedProducts} disabled={selectedProducts.length === 0}>
                    Adicionar Produtos Selecionados
                </button>
            </div>
        </div>
    )
};

export default ShipmentProducts;