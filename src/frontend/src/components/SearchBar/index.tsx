import React, { useEffect, useState } from 'react';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    const [inputValue, setInputValue] = useState(searchTerm);

    useEffect(() => {
        setInputValue(searchTerm); // Update input value when searchTerm changes
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(inputValue); // Set search term after 300ms
        }, 300);

        return () => {
            clearTimeout(handler); // Cleanup timeout
        };
    }, [inputValue, setSearchTerm]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // Update input value
    };

    return (
        <input
            type="text"
            value={inputValue}
            onChange={handleChange} // Handle input change
            placeholder="Search for products..."
        />
    );
};

export default SearchBar;
