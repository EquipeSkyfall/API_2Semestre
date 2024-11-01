import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { batchSchema, BatchSchema } from "./BatchSchema/batchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import MutationCreateBatch from "../../Hooks/Batches/postBatchCreationHook";
import BatchSupplierList from "../BatchSupplierListing";
import BatchSupplierProductList from "../BatchSupplierProductListing";
import './styles.css'

interface BatchFormProps {
    refetch: () => void;
}

const BatchForm: React.FC<BatchFormProps> = ({ refetch }) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [resetKey, setResetKey] = useState<number>(0);
    
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
        setResetKey(prev => prev + 1)
        setSuccessMessage('Lote cadastrado com sucesso!');
        
        // Limpar a mensagem após 3 segundos
        setTimeout(() => {
            setSuccessMessage('');
        }, 2000);
        refetch();        
    };

    const mutation = MutationCreateBatch(onSuccess, setError, setServerError);

    const onSubmit = (data: BatchSchema) => {
        if (data.id_fornecedor === null) {
            setError("id_fornecedor", {
                type: "manual",
                message: "O fornecedor deve ser selecionado."
            });
            return; // Prevent submission
        }

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
                {/* {successMessage && <p className="success-message">{successMessage}</p>} Removi dessa parte e coloquei no final da pagina */}
                {serverError && <p className="error-message">{serverError}</p>}

                {/*  <h2 className="color_conf">Entrada de Produtos</h2> */}

                <div className="formContainer flex flex-col text-xs md:text-base xl:flex-row justify-between gap-5">
                    <div className="insertProducts flex-1 min-w-[300px]">   
                        <BatchSupplierList refetch={() => {}} onChange={handleSupplierChange} resetKey={resetKey}/>
                    </div>    

                    <div className="dropProducts flex-1 min-w-[300px]">
                        <BatchSupplierProductList refetch={() => {}} supplierId={supplierId}/>
                            
                        <div style={{
                            marginLeft: "15px"                                
                        }}>
                            
                            <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                            >

                            {isSubmitting ? 'Carregando...' : 'Cadastrar'}
                            </button>
                            {successMessage && <p className="success-message">{successMessage}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
};

export default BatchForm;