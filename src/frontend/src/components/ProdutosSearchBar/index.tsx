// SearchBar.tsx
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import CategorySelect from '../CategorySelect';
import SectorSelect from '../SectorSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './produtossearchbar.css';

interface SearchBarProps {
    onSearchTermChange: (term: string, categoryId: number | null, sectorId: number | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchTermChange }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [sectorId, setSectorId] = useState<number | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const methods = useForm();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (id: number | null) => {
        setCategoryId(id);
    };

    const handleSectorChange = (id: number | null) => {
        setSectorId(id);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchTermChange(searchTerm, categoryId, sectorId);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, categoryId, sectorId, onSearchTermChange]);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    // Para fechar o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.querySelector('.dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <FormProvider {...methods}>
            <div className="searchbar-wrapper w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Pesquisar"
                    className="searchbar w-[65%]"
                />
                <div className="dropdown">
                    <button onClick={toggleDropdown} className="dropdown-button">
                        Selecionar <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-content">
                            <CategorySelect refetch={() => { }} onChange={handleCategoryChange} />
                            <SectorSelect refetch={() => { }} onChange={handleSectorChange} />
                        </div>
                    )}
                </div>
            </div>

            
        </FormProvider>
    );
};

export default SearchBar;
