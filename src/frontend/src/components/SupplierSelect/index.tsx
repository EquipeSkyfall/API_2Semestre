import { useFormContext } from "react-hook-form";
import useSuppliers from "../../Hooks/Supplier/useSuppliers";
import { useEffect } from "react";
import './styles.css';

interface SupplierSelectProps {
    refetch: () => void;
    onChange?: (supplierId: number | null) => void;
}

const SupplierSelect: React.FC<SupplierSelectProps> = ({ refetch, onChange }) => {
    const { register, formState: { errors }, setValue } = useFormContext();
    const { data, isLoading, isError } = useSuppliers({search: '', page: 1, limit: 'all'})
    const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId: number | null = event.target.value ? Number(event.target.value) : null;
        
        setValue('id_fornecedor', selectedId)

        if (onChange) {
            onChange(selectedId)
        }

        refetch()
    };

    return (
        <div className="form-field optional">
            <label htmlFor="id_fornecedor"></label>
            <select
                {...register('id_fornecedor')}
                onChange={handleSupplierChange}
                className="supplier-select"
            >
                <option className="title-supplier">Fornecedor</option>
                {isLoading ? (
                    <option disabled> Carregando fornecedores...</option>
                ) : isError ? (
                    <option disabled>Erro ao carregar fornecedores</option>
                ) : data?.suppliers && data.suppliers.length > 0 ? (
                    data?.suppliers.map(supplier => (
                        <option key={supplier.id_fornecedor} value={supplier.id_fornecedor}>
                            {supplier.razao_social}
                        </option>
                    ))
                ) : (
                    <option disabled>Não há fornecedores disponíveis</option>
                )}
            </select>
        </div>
    );
};

export default SupplierSelect;