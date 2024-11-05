import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FetchAllSectors from "../../Hooks/Sectors/fetchAllSectorsHook";
import "./sectorselect.css"; 

interface SectorSelectProps {
    refetch: () => void;
    onChange?: (sectorId: number | null) => void;
    defaultValue?: number | null;
}

const SectorSelect: React.FC<SectorSelectProps> = ({ defaultValue, refetch, onChange }) => {
    const { register, setValue } = useFormContext();
    const { sectors, isLoading, isError, refetch: refetchSectors } = FetchAllSectors(1);

    const handleSectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId: number | null = event.target.value ? Number(event.target.value) : null;

        setValue('id_setor', selectedId);

        if (onChange) {
            onChange(selectedId);
        }

        refetch();
    };

    useEffect(() => {
        refetchSectors();
        if (defaultValue) {
            setValue('id_setor', defaultValue);
        }
    }, [defaultValue, setValue, refetch]);

    return (
        <div className="form-field-setor">
            <label htmlFor="id_setor"></label>
            <select
                {...register('id_setor')}
                id="id_setor"
                defaultValue={defaultValue || ''}
                onChange={handleSectorChange}
                className="select-field"
            >
                <option value="">Setor</option>
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
        </div>
    );
};

export default SectorSelect;
