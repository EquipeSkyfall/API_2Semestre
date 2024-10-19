import { useState } from "react";
import { useFormContext } from "react-hook-form";
import useSuppliers from "../../../Hooks/Supplier/useSuppliers";
import SupplierSearchBar from "../../SupplierSearchBar";

interface BatchSupplierListProps {
    refetch: () => void;
    onChange: (supplierId: number | null) => void;
}

interface FilterValues {
    search: string;
    cidade: string;
    estado: string;
}

const BatchSupplierList: React.FC<BatchSupplierListProps> = ({ refetch, onChange }) => {
    const { formState: { errors }, setValue, reset } = useFormContext();
    const [currentPage, setPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({ search: '', cidade: '', estado: '' });
    const { data, isLoading, isError } = useSuppliers({...filters, page: currentPage, limit: 10});
    const [selectedSupplier, setSelectedSupplier] = useState<{ id: number; name: string } | null>(null);

    const [isExpanded, setIsExpanded] = useState(false); // For controlling list visibility

    // When supplier is selected, show its name and store the supplier ID in the form
    const handleSupplierSelect = (supplierId: number, supplierName: string) => {
        setValue('id_fornecedor', supplierId); // Store id_fornecedor in the form
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
            <SupplierSearchBar onSearchTermChange={handleSearchTermChange} />

            {selectedSupplier && (
                <div>
                    <strong>Fornecedor Selecionado: </strong>
                    {selectedSupplier.name}
                </div>
            )}
            
            {/* Toggle button for expanding/collapsing supplier list */}
            <button type="button" onClick={toggleList}>
                {isExpanded ? 'Esconder Fornecedores' : 'Mostrar Fornecedores'}
            </button>
            
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
                                        style={{ cursor: 'pointer', padding: '5px', border: '1px solid black', margin: '5px 0' }}
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