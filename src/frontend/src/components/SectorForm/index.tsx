import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { sectorSchema, SectorSchema } from "./SectorSchema/sectorSchema";
import { Sector } from "../SectorTypes/types";
import MutationCreateSector from "../../Hooks/Sectors/postSectorCreationHook";
import useUpdateSector from "../../Hooks/Sectors/patchSectorByIdHook";
import './styles.css'

interface SectorFormProps {
    refetch: () => void;
    editingSector?: Sector | null;
    setIsEditing?: (isEditing: boolean) => void;
    onCancelEdit: () => void;
}

const SectorForm: React.FC<SectorFormProps> = ({ refetch, editingSector, setIsEditing, onCancelEdit }) => {
    const [serverError, setServerError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset, setValue } = useForm<SectorSchema>({
        resolver: zodResolver(sectorSchema),
        defaultValues: {
            nome_setor: editingSector?.nome_setor || '',
        }
    });

    const onSuccess = () => {
        reset();
        setSuccessMessage('Setor cadastrado com sucesso!');
        refetch();
        if (setIsEditing) setIsEditing(false)
    };

    const mutation = MutationCreateSector(onSuccess, setError, setServerError)
    const updateMutation = useUpdateSector()

    useEffect(() => {
        if (editingSector) {
            setValue("nome_setor", editingSector.nome_setor)
        } else {
            reset()
        }
    }, [editingSector, setValue, reset]);
    
    const onSubmit = (data: SectorSchema) => {
        setServerError(null);
        setSuccessMessage(null);
        if (editingSector) {
            updateMutation.mutate({
                ...data,
                id_setor: editingSector.id_setor,
            }, {
                onSuccess: () => {
                    onSuccess();
                },
                onError: (error: any) => {
                    setServerError('Erro ao atualizar setor.')
                }
            })
        } else {
            mutation.mutate(data);
        }
    };

    const onError = (errors: any) => {
        console.error('Zod validation errors:', errors)
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="sector-form"
        >
            {successMessage && <p className="success-message">{successMessage}</p>}
            {serverError && <p className="error-message">{serverError}</p>}

            <h2>{editingSector ? 'Editar Setor' : 'Cadastrar Setor'}</h2>

            <div className="form-fields-grid">
                <div className="form-field required">
                    <label htmlFor="nome_setor">Nome do Setor</label>
                    <input
                        {...register("nome_setor")}
                        type="text"
                        id="nome_setor"
                    />
                    {errors.nome_setor && <p className="error-message">{errors.nome_setor.message}</p>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Carregando...' : (editingSector ? 'Salvar Alterações' : 'Cadastrar')}
                </button>

                {editingSector && (
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                            reset();
                            onCancelEdit();
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    )
};

export default SectorForm;