import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FetchAllSectors from "../../Hooks/Sectors/fetchAllSectorsHook";

interface SectorSelectProps {
    setIsSectorModalOpen: (isOpen: boolean) => void;
    refetch: () => void;
}

const SectorSelect: React.FC<SectorSelectProps> = ({ setIsSectorModalOpen, refetch }) => {
    const { register, formState: { errors } } = useFormContext();
    const { sectors, isLoading, isError, refetch: refetchSectors } = FetchAllSectors(1, 10);

    useEffect(() => {
        refetchSectors();
    }, [refetch]);

    return (
        <div className="form-field optional">
            <label htmlFor="id_setor">Setor</label>
            <select
                {...register('id_setor')}
                id="id_setor"
            >
                <option value="">Selecione um setor</option>
                {isLoading ? (
                    <option disabled>Carregando setores...</option>
                ) : isError ? (
                    <option disabled>Erro ao carregar setores</option>
                ) : sectors && sectors.length > 0 ? (
                    sectors.map(sector => (
                        <option key={sector.id_setor} value={sector.id_setor}>
                            {sector.nome_setor}
                        </option>
                    ))
                ) : (
                    <option disabled>Não há setores disponíveis</option>
                )}
            </select>
            <button type="button" onClick={() => setIsSectorModalOpen(true)}>
                Gerenciar Setores
            </button>
        </div>
    )
};

export default SectorSelect;