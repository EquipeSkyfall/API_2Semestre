import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { batchSchema, BatchSchema } from "./BatchSchema/batchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import MutationCreateBatch from "../../Hooks/Batches/postBatchCreationHook";
import BatchSupplierList from "./BatchSupplierListing";
import BatchSupplierProductList from "./BatchSupplierProductListing";

interface BatchFormProps {
    refetch: () => void;
}

const BatchForm: React.FC<BatchFormProps> = ({ refetch }) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [supplierId, setSupplierId] = useState<number | null>(null);
    
    const methods = useForm<BatchSchema>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            produtos: []
        }
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = methods

    const handleSupplierChange = (id: number | null) => {
        setSupplierId(id)
    }

    const onSuccess = () => {
        reset()
        setSuccessMessage('Lote cadastrado com sucesso!');
        refetch()
    };

    const mutation = MutationCreateBatch(onSuccess, setError, setServerError);

    const onSubmit = (data: BatchSchema) => {
        setServerError(null);
        setSuccessMessage(null);

        mutation.mutate(data);
    };

    const onError = (errors: any) => {
        console.error('Zod validation errors:', errors)
    };

    useEffect(() => {
        console.log("supplierId changed:", supplierId);
    }, [supplierId]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="batch-form"
            >
                {successMessage && <p className="success-message">{successMessage}</p>}
                {serverError && <p className="error-message">{serverError}</p>}

                <h2>Entrada de Produtos</h2>

                <label>
                    Data de Compra:
                    <input className="form-field required"
                        {...register("data_compra", { valueAsDate: true })}
                        type="date"
                        id="data_compra"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                </label>

                <BatchSupplierList refetch={refetch} onChange={handleSupplierChange} />

                <BatchSupplierProductList refetch={refetch} supplierId={supplierId} />

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Carregando...' : 'Cadastrar'}
                </button>
            </form>
        </FormProvider>
    )
};

export default BatchForm;