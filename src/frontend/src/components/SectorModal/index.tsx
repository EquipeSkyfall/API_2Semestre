import React, { useState, useEffect } from "react";
import SectorList from "../SectorList";
import useDeleteSector from "../../Hooks/Sectors/deleteSectorByIdHook";
import FetchAllSectors from "../../Hooks/Sectors/fetchAllSectorsHook";
import { Sector } from "../SectorTypes/types";
import SectorForm from "../SectorForm";
import './styles.css';

interface SectorModalProps {
    setIsSectorModalOpen: (isOpen: boolean) => void;
    refetch: () => void;
}

const SectorModal: React.FC<SectorModalProps> = ({ setIsSectorModalOpen, refetch }) => {
    const [editingSector, setEditingSector] = useState<Sector | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const deleteSectorMutation = useDeleteSector();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    const { sectors, totalPages, refetch: refetchSectors } = FetchAllSectors(currentPage, itemsPerPage);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [sectorToDelete, setSectorToDelete] = useState<number | null>(null);

    useEffect(() => {
        refetchSectors();
    }, [currentPage, isEditing]);

    const closeModal = () => {
        setIsSectorModalOpen(false);
        refetch();
    };

    const handleEdit = (sector: Sector) => {
        setEditingSector(sector);
        setIsEditing(true);
    };

    const handleDelete = (id_setor: number) => {
        setSectorToDelete(id_setor);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (sectorToDelete !== null) {
            try {
                await deleteSectorMutation.mutateAsync(sectorToDelete);
                refetch();
                refetchSectors();
                setShowConfirmModal(false); // Fecha o modal após a confirmação
            } catch (error) {
                console.error('Erro tentando deletar setor:', error);
            }
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false); // Fecha o modal sem deletar
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-4xl p-6 relative">
                {/* Botão de fechar modal (X) no canto superior direito do modal */}
                <button className="close-button-sector" onClick={closeModal}>
                    <i className="fa fa-times" />
                </button>

                <div className="flex flex-row space-x-4">
                    {/* Formulário de Setor */}
                    <div className="w-1/2">
                        <SectorForm
                            refetch={refetchSectors}
                            editingSector={editingSector}
                            setIsEditing={setIsEditing}
                            onCancelEdit={() => setEditingSector(null)}
                        />
                    </div>

                    {/* Lista de Setores */}
                    <div className="w-1/2">
                        <SectorList
                            sectors={sectors}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={setCurrentPage}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de confirmação de exclusão */}
            {showConfirmModal && (
                <div className="fixed inset-0 flex justify-center items-center z-60">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
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
    );
};

export default SectorModal;
