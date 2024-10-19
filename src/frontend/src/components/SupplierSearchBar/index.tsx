import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface SearchBarProps {
    onSearchTermChange: (search: string, cidade: string, estado: string) => void;
    resetKey: number;
}

const SupplierSearchBar: React.FC<SearchBarProps> = ({ onSearchTermChange, resetKey }) => {
    const [razaoValue, setRazaoValue] = useState<string>('');
    const [cidadeValue, setCidadeValue] = useState<string>('');
    const [estadoValue, setEstadoValue] = useState<string>('');
    const methods = useForm();
    const { reset } = methods

    useEffect(() => {
        setRazaoValue('');
        setCidadeValue('');
        setEstadoValue('');
        reset();
    }, [resetKey])

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchTermChange(razaoValue, cidadeValue, estadoValue);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [razaoValue, cidadeValue, estadoValue, onSearchTermChange]);

    const handleRazaoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRazaoValue(event.target.value);
    };

    const handleCidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCidadeValue(event.target.value);
    };

    const handleEstadoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEstadoValue(event.target.value);
    };

    return (
        <FormProvider {...methods}>
            <div>
                <div className="form-field">
                    Razão Social: 
                    <input
                        type="text"
                        value={razaoValue}
                        onChange={handleRazaoChange}
                        placeholder="Pesquisar..."
                    />
                </div>

                <div className="form-field">
                    Cidade: 
                    <input
                        type="text"
                        value={cidadeValue}
                        onChange={handleCidadeChange}
                        placeholder="Pesquisar..."
                    />
                </div>

                <div className="form-field">
                    Estado: 
                    <input
                        type="text"
                        value={estadoValue}
                        onChange={handleEstadoChange}
                        placeholder="Pesquisar..."
                    />
                </div>
            </div>
        </FormProvider>
    );
};

export default SupplierSearchBar;