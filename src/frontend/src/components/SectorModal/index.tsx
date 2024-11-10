import React, { useState, useEffect, useCallback } from 'react';
import SectorList from '../SectorList';
import useDeleteSector from '../../Hooks/Sectors/deleteSectorByIdHook';
import FetchAllSectors from '../../Hooks/Sectors/fetchAllSectorsHook';
import { Sector } from '../SectorTypes/types';
import SectorForm from '../SectorForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import './sectormodal.css';

interface SectorModalProps {
    setIsSectorModalOpen: (isOpen: boolean) => void;
    refetch: () => void;
}

const SectorModal: React.FC<SectorModalProps> = ({
    setIsSectorModalOpen,
    refetch,
}) => {
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [editingSector, setEditingSector] = useState<Sector | null>(null);
    const deleteSectorMutation = useDeleteSector();
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const { sectors, totalPages, isLoading, isError, refetch: refetchSectors } = FetchAllSectors(search, currentPage, itemsPerPage);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sectorToDelete, setSectorToDelete] = useState<number | null>(null);

    const handleSearchTermChange = useCallback((search: string) => {
        setSearch(search);
        setCurrentPage(1);
      },[]
    );

    useEffect(() => {
        refetchSectors();
    }, [currentPage, search]);

    const closeModal = () => {
        setIsSectorModalOpen(false);
        refetch();
    };

    const handleEdit = (sector: Sector) => {
        setEditingSector(sector);
        setIsFormVisible(true);
    };

    const handleDelete = (id_sector: number) => {
        setSectorToDelete(id_sector);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (sectorToDelete !== null) {
            try {
                await deleteSectorMutation.mutateAsync(sectorToDelete);
                refetch();
                refetchSectors();
                setShowConfirmModal(false);
            } catch (error) {
                console.error('Erro tentando deletar setor:', error);
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
    };

    const handleSuccess = () => {
        setEditingSector(null);
        refetch();
        refetchSectors();
    };

    const getModalTitle = () => {
        return editingSector ? 'Editar Setor' : isFormVisible ? 'Criar Novo Setor' : 'Lista de Setores';
    };

    const getButtonStyle = (isFormButton: boolean) => {
        if (editingSector) return 'bg-gray-300 text-gray-800';

        return isFormButton
            ? isFormVisible ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-800'
            : !isFormVisible ? 'bg-cyan-500 text-white' : 'bg-gray-300 text-gray-800';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-4 sm:p-6 md:p-8 relative" style={{ height: '80vh', maxHeight: '600px' }}>
                <button className="fechar absolute top-4 right-4" onClick={closeModal}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                
                <h1 className="text-xl sm:text-2xl md:text-3xl mb-4">{getModalTitle()}</h1>

                <div className="flex justify-start mb-4 space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md ${getButtonStyle(true)}`}
                        onClick={() => setIsFormVisible(true)}
                    >
                        Criar Novo Setor
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${getButtonStyle(false)}`}
                        onClick={() => setIsFormVisible(false)}
                    >
                        Ver Lista de Setores
                    </button>
                </div>

                {isFormVisible ? (
                    <SectorForm
                        refetch={handleSuccess}
                        editingSector={editingSector}
                        onCancelEdit={() => {
                            setEditingSector(null);
                            setIsFormVisible(false);
                        }}
                    />
                ) : (
                    <SectorList
                        searchTerm={handleSearchTermChange}
                        sectors={sectors}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={setCurrentPage}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                )}

                {showConfirmModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-60 bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
                            <h2 className="text-center text-xl mb-4">Confirmação de Exclusão</h2>
                            <p className="text-center mb-4">Tem certeza que deseja excluir este setor?</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Sim
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SectorModal;
