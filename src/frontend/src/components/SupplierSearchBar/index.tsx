import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface SearchBarProps {
    onSearchTermChange: (search: string) => void;
    resetKey?: number;
}

const SupplierSearchBar: React.FC<SearchBarProps> = ({ onSearchTermChange, resetKey }) => {
    const [search, setSearch] = useState<string>('');
    const methods = useForm();
    const { reset } = methods

    useEffect(() => {
        setSearch('');
        reset();
    }, [resetKey])

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchTermChange(search);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search, onSearchTermChange]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <FormProvider {...methods}>
            <div>
                <div className="form-field">
                    Buscar: 
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Pesquisar por nome, cidade ou estado..."
                        className="mb-5"
                    />
                </div>
            </div>
        </FormProvider>
    );
};

export default SupplierSearchBar;