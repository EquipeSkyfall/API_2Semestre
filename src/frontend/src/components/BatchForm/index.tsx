import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { batchSchema, BatchSchema } from "./BatchSchema/batchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import MutationCreateBatch from "../../Hooks/Batches/postBatchCreationHook";

interface BatchFormProps {
    refetch: () => void;
}

const BatchForm: React.FC<BatchFormProps> = ({ refetch }) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const methods = useForm<BatchSchema>({
        resolver: zodResolver(batchSchema)
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = methods

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

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="batch-form"
            >
                {successMessage && <p className="success-message">{successMessage}</p>}
                {serverError && <p className="error-message">{serverError}</p>}

                <h2>Entrada de Produtos</h2>

                
            </form>
        </FormProvider>
    )
};

export default BatchForm;