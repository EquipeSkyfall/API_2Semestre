import React, { useState, useEffect } from "react";
import SectorList from "../SectorList";
import useDeleteSector from "../../Hooks/Sectors/deleteSectorByIdHook";
import useUpdateSector from "../../Hooks/Sectors/patchSectorByIdHook";
import FetchAllSectors from "../../Hooks/Sectors/fetchAllSectorsHook";
import { Sector } from "../SectorTypes/types";
import SectorForm from "../SectorForm";
import './styles.css'

interface SectorModalProps {
    setIsSectorModalOpen: (isOpen: boolean) => void;
    refetch: () => void;
}

const SectorModal: React.FC<SectorModalProps> = ({
    setIsSectorModalOpen,
    refetch,
}) => {
    const [editingSector, setEditingSector] = useState<Sector | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const deleteSectorMutation = useDeleteSector()
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const { sectors, totalPages, isLoading, isError, refetch: refetchSectors } = FetchAllSectors(currentPage, itemsPerPage)

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

    const handleDelete = async (id_setor: number) => {
        if (window.confirm('Tem certeza que deseja deletar esse setor?')) {
            try {
                console.log(id_setor)
                await deleteSectorMutation.mutateAsync(id_setor)
                refetch()
                refetchSectors()
            } catch (error) {
                console.error('Erro tentando deletar setor:', error)
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={closeModal}>X</button>
                <h1>Setores</h1>

                {/* Listagem */}
                <SectorList
                    sectors={sectors}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={10}
                    handlePageChange={setCurrentPage}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />

                {/* Cadastro | Edição */}
                <SectorForm refetch={() => {
                        refetch();
                        refetchSectors();
                    }}
                    editingSector={editingSector}
                    setIsEditing={setIsEditing}
                    onCancelEdit={() => {
                        setEditingSector(null);
                        setIsEditing(false);
                    }}
                />
            </div>
        </div>
    )
};

export default SectorModal;