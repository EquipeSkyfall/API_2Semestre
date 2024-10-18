import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import CategorySelect from '../CategorySelect';
import SectorSelect from '../SectorSelect';

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
        setInputValue(searchTerm); // Update input value when searchTerm changes
    }, [searchTerm]);
    useEffect(() => {
        setCategoryValue(categoryValue); // Update input value when searchTerm changes
    }, [searchTerm]);
    useEffect(() => {
        setSectorValue(sectorValue); // Update input value when searchTerm changes
    }, [searchTerm]);

    // Handler for changes in input and selects
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // Update input value
    };

    const handleCategoryChange = (id: number | null) => {
        setCategoryValue(id); // Call the parent handler with new categoryId
    };

    const handleSectorChange = (id: number | null) => {
        setSectorValue(id); // Call the parent handler with new sectorId
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchTermChange(inputValue, categoryValue, sectorValue); // Call the parent handler
        }, 300);

        return () => {
            clearTimeout(handler); // Cleanup timeout
        };
    }, [inputValue, categoryValue, sectorValue, onSearchTermChange]);

    return (
        <FormProvider {...methods}>
            <div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange} // Handle input change
                    placeholder="Search for products..."
                />
                <CategorySelect refetch={() => {}} onChange={handleCategoryChange} />
                <SectorSelect refetch={() => {}} onChange={handleSectorChange} />
            </div>
        </FormProvider>
    );
};

export default SearchBar;
