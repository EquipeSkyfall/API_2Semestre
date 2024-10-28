import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useGetSupplierProducts, { SupplierProduct } from "../../Hooks/Supplier/useGetSupplierProducts";
import SearchBar from "../ProdutosSearchBar";
import { BatchProductSchema } from "../BatchForm/BatchSchema/batchSchema";
import './styles.css'

interface FilterValues {
    search: string;
    id_setor: number | null;
    id_categoria: number | null;
}

interface BatchSupplierProductListProps {
    refetch: () => void;
    supplierId: number | null;
}

const BatchSupplierProductList: React.FC<BatchSupplierProductListProps> = ({ refetch, supplierId }) => {
    const { clearErrors, formState: { errors }, setValue } = useFormContext();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null })
    const [selectedProducts, setSelectedProducts] = useState<SupplierProduct[]>([]);
    const [addedProducts, setAddedProducts] = useState<BatchProductSchema[]>([]);
    const [availableProducts, setAvailableProducts] = useState<SupplierProduct[]>([])
    const [isVisible, setIsVisible] = useState(true);

    const { data, isLoading, isError } = useGetSupplierProducts(supplierId, { ...filters, page: page, limit: 10 });

    useEffect(() => {
        if (data && data.products) {
            setAvailableProducts(data.products);
        } else {
            setAvailableProducts([]); // Ensure it is an empty array if no products
        }
    }, [data]);

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    useEffect(() => {
        setAddedProducts([])
        setSelectedProducts([])
        setIsVisible(true)
    }, [supplierId]);
    useEffect(() => {
        setValue('produtos', addedProducts)
    }, [addedProducts]);

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };

    const toggleProductSelection = (product: SupplierProduct) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.find(p => p.id_produto === product.id_produto)) {
                return prevSelected.filter(p => p.id_produto !== product.id_produto);
            }
            return [...prevSelected, product];
        });
    };

    const handleRemoveProduct = (product: BatchProductSchema) => {
        setAddedProducts(prev => prev.filter(p => p.id_produto !== product.id_produto));
    };

    const handleAddProducts = () => {
        const newProducts: BatchProductSchema[] = selectedProducts.map(product => {
            const quantidadeInput = document.getElementById(`quantidade_${product.id_produto}`) as HTMLInputElement;
            const validadeInput = document.getElementById(`validade_${product.id_produto}`) as HTMLInputElement;

            return {
                id_produto: product.id_produto,
                quantidade: parseInt(quantidadeInput?.value || '1'), // Capture quantity
                validade_produto: validadeInput?.value ? new Date(validadeInput.value) : null, // Capture validity date
            };
        });

        setAddedProducts(prevAddedProducts => [
            ...prevAddedProducts,
            ...newProducts,
        ]);

        clearErrors("produtos");

        toggleVisibility();
        setSelectedProducts([]);
    };

    const handleInputChange = (id_produto: number, field: string, value: any) => {
        setAddedProducts(prevAddedProducts => {
            const updatedProducts = prevAddedProducts.map(product => {
                if (product.id_produto === id_produto) {
                    return {
                        ...product,
                        [field]: field === 'quantidade'
                            ? parseInt(value)
                            : field === 'validade_produto'
                                ? new Date(value) // Convert 'validade_produto' to a Date object
                                : value,
                    };
                }
                return product;
            });

            return updatedProducts; // Return the updated state
        });
    };

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
        <div className="Supplier-Products">
            <h2>Produtos do Fornecedor</h2>

            <button className="button-show-products" type="button" onClick={toggleVisibility}>
                {isVisible ? 'Esconder Produtos' : 'Mostrar Produtos'}
            </button>

            {isVisible && (
                <>
                    {availableProducts.length > 0 ? (
                        <div className="supplier-checkbox" >
                            {isLoading && <p>Carregando...</p>}
                            {isError && <p className="error-message" >Erro ao carregar produtos.</p>}
                            <div className="dimension_conf">
                                <SearchBar onSearchTermChange={handleSearchTermChange} />
                            </div>
                            {availableProducts.map(product => (
                                <div key={product.id_produto}>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedProducts.some(p => p.id_produto === product.id_produto)}
                                        onChange={() => toggleProductSelection(product)}
                                        disabled={addedProducts.some((p) => p.id_produto === product.id_produto)}
                                    />
                                    {product.produto.nome_produto} - Preço Custo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_custo)}
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            <div className="pagination">
                                <button onClick={handlePrevPage} disabled={page === 1}>
                                    Anterior
                                </button>
                                <span>
                                    Página {data?.currentPage} de {data?.totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === data?.totalPages}
                                >
                                    Próximo
                                </button>
                            </div>
                            <div className="add-products" >
                                <button className="button-add-products" onClick={handleAddProducts} disabled={selectedProducts.length === 0}>
                                    Adicionar Produto(s)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="error-message" >Não há produtos para adicionar.</p>
                    )}
                </>
            )}

            <div className="dimension_conf">
                <h2>Produtos no lote: {errors.produtos && <span className="error-message">{errors.produtos.message}</span>}</h2>
                {addedProducts.length > 0 && (
                    <ul>
                        {addedProducts.map(product => {
                            const originalProduct = data?.products.find(p => p.id_produto === product.id_produto);
                            return (
                                <li key={product.id_produto}>
                                    <div className="dimension_conf Batch-Products">
                                        <strong>{originalProduct?.produto.nome_produto || 'Produto Desconhecido'}</strong> {/* Display product name */}

                                        <label>
                                            Validade:
                                            <input
                                                className="form-field"
                                                type="date"
                                                id={`validade_${product.id_produto}`} // Use product ID for uniqueness
                                                value={product.validade_produto && !isNaN(new Date(product.validade_produto).getTime())
                                                    ? new Date(product.validade_produto).toISOString().slice(0, 10)
                                                    : ''}
                                                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                                                onChange={(e) => handleInputChange(product.id_produto, 'validade_produto', e.target.value)} // Call input change handler
                                            />
                                        </label>

                                        <label>
                                            Quantidade:
                                            <input
                                                className="form-field required"
                                                type="number"
                                                min="1"
                                                id={`quantidade_${product.id_produto}`} // Use product ID for uniqueness
                                                value={product.quantidade} // Controlled input
                                                onChange={(e) => handleInputChange(product.id_produto, 'quantidade', e.target.value)} // Call input change handler
                                            />
                                        </label>
                                        {/* Remove Product Button */}
                                        <button className="button-remove-products" onClick={() => handleRemoveProduct(product)}>
                                            Remover
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BatchSupplierProductList;