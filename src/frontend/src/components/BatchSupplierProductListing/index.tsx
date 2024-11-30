import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useGetSupplierProducts, { SupplierProduct } from "../../Hooks/Supplier/useGetSupplierProducts";
import SearchBar from "../ProdutosSearchBar";
import { BatchProductSchema } from "../BatchForm/BatchSchema/batchSchema";
import './styles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface FilterValues {
    search: string;
    id_setor: number | null;
    id_categoria: number | null;
}

interface BatchSupplierProductListProps {
    refetch: () => void;
    supplierId: number | null;
}

interface BatchProductsNames {
    id_produto: number
    nome_produto: string;
}

const BatchSupplierProductList: React.FC<BatchSupplierProductListProps> = ({ refetch, supplierId }) => {
    const { clearErrors, formState: { errors }, setValue } = useFormContext();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', id_setor: null, id_categoria: null })
    const [selectedProducts, setSelectedProducts] = useState<SupplierProduct[]>([]);
    const [addedProductsNames, setAddedProductsNames] = useState<BatchProductsNames[]>([]);
    const [addedProducts, setAddedProducts] = useState<BatchProductSchema[]>([]);
    const [availableProducts, setAvailableProducts] = useState<SupplierProduct[]>([])
    const [isVisible, setIsVisible] = useState(true);

    const { data, isLoading, isError } = useGetSupplierProducts(supplierId, { ...filters, page: page, limit: 10 });

    useEffect(() => {
        const newAddedProductsNames = addedProducts.map(product => {
            const originalProduct = data?.products.find(p => p.id_produto === product.id_produto);
            return {
                id_produto: product.id_produto,
                nome_produto: originalProduct?.produto.nome_produto || "Produto Desconhecido",
            };
        });
        setAddedProductsNames(newAddedProductsNames);
    }, [addedProducts]);

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
        setAddedProductsNames([])
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
        <div>
            <h2 className="text-cyan-600 font-['Afacad_Flux']">Produtos do Fornecedor</h2>

            <button className="button-show-products mt-7" type="button" onClick={toggleVisibility}>
                {isVisible ? 'Esconder Produtos' : 'Mostrar Produtos'}
            </button>

            {isVisible && (
                <div className="supplier-checkbox">
                    <div className="dimension_conf ">
                        <SearchBar onSearchTermChange={handleSearchTermChange} />
                    </div>
                    {availableProducts.length > 0 ? (
                        <>
                            {isLoading && <p>Carregando...</p>}
                            {isError && <p className="error-message" >Erro ao carregar produtos.</p>}
                            {availableProducts.map(product => (
                                <div key={product.id_produto}
                                    style={{
                                        display: "flex",
                                        width: '100%',
                                        alignItems: "center",
                                        padding: "8px",
                                        border: "1px dotted #ccc"
                                    }}
                                >
                                    <input
                                        style={{ width: 'fit-content' }}
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedProducts.some(p => p.id_produto === product.id_produto)}
                                        onChange={() => toggleProductSelection(product)}
                                        disabled={addedProducts.some((p) => p.id_produto === product.id_produto)}
                                    />
                                    <div style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                                        <span style={{ flexGrow: 1 }}>{product.produto.nome_produto}</span>
                                        <div className="flex justify-between w-1/5 ">
                                            <span style={{ marginRight: "auto"}}>
                                                Preço: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_custo)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pagination">
                                <button type="button" onClick={handlePrevPage} disabled={page === 1}>
                                    Anterior
                                </button>
                                <span>
                                    Página {data?.currentPage} de {data?.totalPages}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={page === data?.totalPages}
                                >
                                    Próximo
                                </button>
                            </div>

                            <div className="add-products" >
                                <button type="button" className="button-add-products" onClick={handleAddProducts} disabled={selectedProducts.length === 0}>
                                    Adicionar Produto(s)
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="error-message" >Não há produtos para adicionar.</p>
                    )}
                </div>
            )}

            <div className="dimension_conf">
                <h2 className="text-cyan-600 font-['Afacad_Flux']">
                    Produtos no lote: {errors.produtos && <span className="error-message">{errors.produtos.message}</span>}
                </h2>
                {addedProducts.length > 0 && (

                    <ul className="container"
                        style={{ border: '1px solid #ccc', padding: '20px' }}
                    >

                        <li className="row">
                            <span>Produto</span>
                            <span>Validade</span>
                            <span>Quantidade</span>
                            <span></span>
                        </li>

                        {addedProducts.map(product => {
                            const originalProduct = addedProductsNames.find(p => p.id_produto === product.id_produto);
                            return (
                                <li className="row" key={product.id_produto}
                                >

                                    <strong>
                                        {originalProduct?.nome_produto || "Produto Desconhecido"}
                                    </strong>


                                    <input
                                        type="date"
                                        id={`validade_${product.id_produto}`}
                                        value={
                                            product.validade_produto
                                                ? new Date(product.validade_produto)
                                                    .toISOString()
                                                    .slice(0, 10)
                                                : ""
                                        }
                                        min={new Date(Date.now() + 86400000)
                                            .toISOString()
                                            .slice(0, 10)}
                                        onChange={(e) =>
                                            handleInputChange(
                                                product.id_produto,
                                                "validade_produto",
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            padding: "5px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            maxWidth: "120px",
                                        }}

                                        className="teste md:text-xs"
                                    />



                                    <input
                                        type="number"
                                        min="1"
                                        id={`quantidade_${product.id_produto}`}
                                        value={product.quantidade}
                                        onChange={(e) =>
                                            handleInputChange(
                                                product.id_produto,
                                                "quantidade",
                                                e.target.value
                                            )
                                        }
                                        style={{
                                            padding: "5px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            maxWidth: "40px",
                                        }}

                                        className="test md:text-xs"
                                    />


                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(product)}
                                        className="button-remove-products"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>

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