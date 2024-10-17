import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { sectorSchema } from "../../components/SectorForm/SectorSchema/sectorSchema";
import { z } from "zod";
import { UseFormSetError } from "react-hook-form";

type createSectorSchema = z.infer<typeof sectorSchema>

const postSectorData = async ( data: createSectorSchema ): Promise<createSectorSchema> => {
    console.log('Data being sent:', data)
    const response = await axios.post('http://127.0.0.1:3000/sectors', data)
    return response.data
}

const MutationCreateSector = (
    onSuccessCallback: ( data: createSectorSchema ) => void,
    setError: UseFormSetError<createSectorSchema>,
    setServerError: ( message: string ) => void
) => {
    return useMutation<createSectorSchema, AxiosError, createSectorSchema>({
        mutationFn: postSectorData,
        onSuccess: ( data ) => {
            console.log('Data submitted successfully:', data)
            onSuccessCallback(data)
        },
        onError: (error) => {
            if (error.response) {
                console.error('Error response:', error.response)
                const responseData = error.response.data as { message?: string }
                if( error.response.status === 400 && responseData.message ) {
                    console.log('Failed to create category (setError)')
                } else {
                    setServerError('An unexpected error occurred.')
                }
            } else {
                setServerError('An unexpected error occurred.')
            }
        }
    })
};

export default MutationCreateSector