import React from 'react';

interface SearchBarProps {
    searchTerm: string; // Current search term
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>; // Function to update the search term
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
            className="search-input" // You can add custom styles here
        />
    );
};

export default SearchBar;
