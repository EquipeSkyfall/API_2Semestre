import axios, { AxiosError } from "axios";
import { z } from "zod";
import { batchSchema } from "../../components/BatchForm/BatchSchema/batchSchema";
import { UseFormSetError } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

type createBatchSchema = z.infer<typeof batchSchema>;

const postBatchData = async (data: createBatchSchema): Promise<createBatchSchema> => {
    const response = await axios.post('http://127.0.0.1:3000/batches', data);
    return response.data;
};

const MutationCreateBatch = (
    onSuccessCallback: (data: createBatchSchema) => void,
    setError: UseFormSetError<createBatchSchema>,
    setServerError: (message: string) => void,
) => {
    return useMutation<createBatchSchema, AxiosError, createBatchSchema>({
        mutationFn: postBatchData,
        onSuccess: (data) => {
            console.log('Data submitted successfully:', data);
            onSuccessCallback(data);
        },
        onError: (error) => {
            if (error.response) {
                const responseData = error.response.data as { message?: string };
                if (error.response.status === 400 && responseData.message) {
                    console.log('Failed to create batch.')
                } else {
                    setServerError('An unexpected error occurred.');
                }
            } else {
                setServerError('An unexpected error occurred.');
            }
        }
    })
};

export default MutationCreateBatch;