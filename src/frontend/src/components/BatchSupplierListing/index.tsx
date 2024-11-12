import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useSuppliers from "../../Hooks/Supplier/useSuppliers";
import SupplierSearchBar from "../SupplierSearchBar";
import './styles.css'

interface ListaFornecedoresProps {
    refetch: () => void;
    onChange: (supplierId: number | null) => void;
    resetKey: number;
}

const ListaFornecedores: React.FC<ListaFornecedoresProps> = ({ refetch, onChange, resetKey }) => {
    const { clearErrors, formState: { errors }, setValue } = useFormContext();
    const [paginaAtual, setPagina] = useState(1);
    const [search, setSearch] = useState<string>('');
    const { data, isLoading, isError } = useSuppliers({ search, page: paginaAtual, limit: 10 });
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState<{ id: number | null; name: string | null } | null>(null);

    const [listaExpandida, setListaExpandida] = useState(true); // Inicializar como true para exibir a lista por padrão

    useEffect(() => {
        handleFornecedorSelect(null, null)
    }, [resetKey])

    const handleFornecedorSelect = (supplierId: number | null, supplierName: string | null) => {
        if (supplierId !== null) {
            clearErrors("id_fornecedor"); // Limpa o erro ao selecionar um fornecedor válido
        }
        setValue('id_fornecedor', supplierId);
        setFornecedorSelecionado({ id: supplierId, name: supplierName });

        if (onChange) {
            onChange(supplierId);
        }

        refetch();
    }

    const handleProximaPagina = () => setPagina((prev) => prev + 1);
    const handlePaginaAnterior = () => setPagina((prev) => Math.max(prev - 1, 1));

    const handleSearchTermChange = useCallback((search: string) => {
        setSearch(search);
        setPagina(1);
    }, []
    );

    return (
        <div className="required responsive">
            <h2 className="text_conf">Fornecedor</h2>

            {listaExpandida && (
                <div className="lista-fornecedores">
                    <SupplierSearchBar onSearchTermChange={handleSearchTermChange} resetKey={resetKey} />
                    {isLoading ? (
                        <p>Carregando fornecedores...</p>
                    ) : isError ? (
                        <p>Erro ao carregar fornecedores</p>
                    ) : data && data.suppliers && data.suppliers.length > 0 ? (
                        <>
                            <ul>
                                {data.suppliers.map(supplier => (
                                    <li
                                        key={supplier.id_fornecedor}
                                        onClick={() => handleFornecedorSelect(supplier.id_fornecedor, supplier.razao_social)}
                                        className="!rounded cursor-pointer p-2 m-1 border-white"                                    >
                                        {supplier.razao_social}
                                    </li>
                                ))}
                            </ul>
                            <div className="pagination">
                                <button onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>
                                    Anterior
                                </button>
                                <span>
                                    Página {paginaAtual} de {data.totalPages}
                                </span>
                                <button onClick={handleProximaPagina} disabled={paginaAtual === data.totalPages}>
                                    Próxima
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Não há fornecedores disponíveis</p>
                    )}
                </div>
            )}
        </div>
    )
};

export default ListaFornecedores;
