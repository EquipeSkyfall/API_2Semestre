import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useGetSupplierProducts, { SupplierProduct } from "../../../Hooks/Supplier/useGetSupplierProducts";
import SearchBar from "../../ProdutosSearchBar";
import { BatchProductSchema } from "../BatchSchema/batchSchema";

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
    const { formState: {errors}, setValue } = useFormContext();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null })
    const [selectedProducts, setSelectedProducts] = useState<SupplierProduct[]>([]);
    const [addedProducts, setAddedProducts] = useState<BatchProductSchema[]>([]);
    const [isVisible, setIsVisible] = useState(true);
    
    const { data, isLoading, isError } = useGetSupplierProducts(supplierId, { ...filters, page: page, limit: 10 });

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    useEffect(() => {
        setAddedProducts([])
    }, [supplierId]);
    useEffect(() => {
        setValue('produtos', addedProducts)
    }, [addedProducts]);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
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
    
        toggleVisibility();
        setSelectedProducts([]);
    };

    const handleInputChange = (id_produto: number, field: string, value: any) => {
        setAddedProducts(prevAddedProducts => {
            const updatedProducts = prevAddedProducts.map(product => {
                if (product.id_produto === id_produto) {
                    return {
                        ...product,
                        [field]: field === 'quantidade' ? parseInt(value) : value, // Ensure quantity is parsed as an integer
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

    const availableProducts = data?.products.filter(product => 
        !addedProducts.some(added => added.id_produto === product.id_produto)
    ) || [];
    
    return (
        <div>
            <h2>Produtos do Fornecedor</h2>

            <button onClick={toggleVisibility}>
                {isVisible ? 'Esconder Produtos' : 'Mostrar Produtos'}
            </button>

            {isVisible && (
                <>
                    {isLoading && <p>Carregando...</p>}
                    {isError && <p>Erro ao carregar produtos.</p>}

                    <SearchBar onSearchTermChange={handleSearchTermChange} />

                    {availableProducts.length > 0 ? (
                        <div>
                            {availableProducts.map(product => (
                                <div key={product.id_produto}>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.some(p => p.id_produto === product.id_produto)}
                                        onChange={() => toggleProductSelection(product)}
                                    />
                                    {product.produto.nome_produto} Preço Custo: R${Number(product.preco_custo).toFixed(2)}
                                </div>
                            ))}
                            
                            {/* Pagination Controls */}
                            <div className="pagination">
                                <button onClick={handlePrevPage} disabled={page === 1}>
                                    Previous
                                </button>
                                <span>
                                    Page {data?.currentPage} of {data?.totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === data?.totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Não há produtos para adicionar.</p>
                    )}

                    <button onClick={handleAddProducts} disabled={selectedProducts.length === 0}>
                        Adicionar Produto(s)
                    </button>
                </>
            )}

            <div>
                <h3>Produtos no lote:</h3>
                {addedProducts.length > 0 && (
                    <ul>
                        {addedProducts.map(product => {
                            const originalProduct = data?.products.find(p => p.id_produto === product.id_produto);
                            return (
                                <li key={product.id_produto}>
                                    <div>
                                        <strong>{originalProduct?.produto.nome_produto || 'Produto Desconhecido'}</strong> {/* Display product name */}

                                        <label>
                                            Validade:
                                            <input
                                                className="form-field"
                                                type="date"
                                                id={`validade_${product.id_produto}`} // Use product ID for uniqueness
                                                value={product.validade_produto ? product.validade_produto.toISOString().slice(0, 10) : ''} // Format date
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
                                        <button onClick={() => handleRemoveProduct(product)}>
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