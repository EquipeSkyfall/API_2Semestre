import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useSuppliers from "../../Hooks/Supplier/useSuppliers";
import SupplierSearchBar from "../SupplierSearchBar";
import './styles.css'

interface BatchSupplierListProps {
    refetch: () => void;
    onChange: (supplierId: number | null) => void;
    resetKey: number;
}

interface FilterValues {
    search: string;
    cidade: string;
    estado: string;
}

const BatchSupplierList: React.FC<BatchSupplierListProps> = ({ refetch, onChange, resetKey }) => {
    const { clearErrors, formState: { errors }, setValue } = useFormContext();
    const [currentPage, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', cidade: '', estado: '' });
    const { data, isLoading, isError } = useSuppliers({...filters, page: currentPage, limit: 10});
    const [selectedSupplier, setSelectedSupplier] = useState<{ id: number | null; name: string | null } | null>(null);

    const [isExpanded, setIsExpanded] = useState(false); // For controlling list visibility

    useEffect(() => {
        handleSupplierSelect(null,null)
    }, [resetKey])

    // When supplier is selected, show its name and store the supplier ID in the form
    const handleSupplierSelect = (supplierId: number | null, supplierName: string | null) => {
        if (supplierId !== null) {
            clearErrors("id_fornecedor"); // Clear the error when a valid supplier is selected
        }
        setValue('id_fornecedor', supplierId);
        setSelectedSupplier({ id: supplierId, name: supplierName });
        toggleList();

        if (onChange) {
            onChange(supplierId);
        }

        refetch();
    }

    const handleNextPage = () => setPage((prev) => prev + 1);
    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    const toggleList = () => {
        setIsExpanded(!isExpanded);
    }

    const handleSearchTermChange = (search: string, cidade: string, estado: string) => {
        setFilters({ search, cidade, estado });
    };

    return (
        <div className="form-field required">
            <label htmlFor="id_fornecedor">Fornecedor</label>
            <SupplierSearchBar onSearchTermChange={handleSearchTermChange} resetKey={resetKey} />

            <input
                id="nome_fornecedor"
                type="text"
                value={selectedSupplier?.name || ''} // ID as value
                placeholder="Selecione um fornecedor"
                readOnly // Make the input read-only since it will be filled by selection
                onClick={toggleList}
            />
            {errors.id_fornecedor && <span className="error-message">{errors.id_fornecedor.message}</span>}
            
            {/* Supplier list, collapsible */}
            {isExpanded && (
                <div className="supplier-list">
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
                                        onClick={() => handleSupplierSelect(supplier.id_fornecedor, supplier.razao_social)}
                                        style={{ cursor: 'pointer', padding: '5px', border: '1px solid white', margin: '5px 0' }}
                                    >
                                        {supplier.razao_social}
                                    </li>
                                ))}
                            </ul>
                            <div className="pagination">
                                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {data.totalPages}
                                </span>
                                <button onClick={handleNextPage} disabled={currentPage === data.totalPages}>
                                    Next
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

export default BatchSupplierList;