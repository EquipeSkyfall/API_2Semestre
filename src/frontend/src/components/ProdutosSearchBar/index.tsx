import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import CategorySelect from '../CategorySelect';
import SectorSelect from '../SectorSelect';
import './styles.css';

interface SearchBarProps {
    onSearchTermChange: (term: string, categoryId: number | null, sectorId: number | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchTermChange }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [sectorId, setSectorId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState(searchTerm);
    const [categoryValue, setCategoryValue] = useState(categoryId);
    const [sectorValue, setSectorValue] = useState(sectorId);
    const methods = useForm();

    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        setCategoryValue(categoryValue);
    }, [categoryValue]);

    useEffect(() => {
        setSectorValue(sectorValue);
    }, [sectorValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleCategoryChange = (id: number | null) => {
        setCategoryValue(id);
    };

    const handleSectorChange = (id: number | null) => {
        setSectorValue(id);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchTermChange(inputValue, categoryValue, sectorValue);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, categoryValue, sectorValue, onSearchTermChange]);

    return (
        <FormProvider {...methods}>
            <div className='flex flex-col items-center space-y-4'>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Pesquisar"
                    className="p-2 border rounded-md mx-auto w-2/3"
                />

                {/* Adicionando flex-row para colocar Categoria e Setor lado a lado */}
                <div className="flex space-x-4 ">
                    <div className="text-center flex-1">
                        <CategorySelect refetch={() => { }} onChange={handleCategoryChange} />
                    </div>
                    <div className="text-center flex-1">
                        <SectorSelect refetch={() => { }} onChange={handleSectorChange} />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default SearchBar;
