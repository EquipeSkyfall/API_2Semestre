import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { categorySchema } from '../../components/CategoryForm/CategorySchema/categorySchema'
import { z } from 'zod'
import { UseFormSetError } from 'react-hook-form'

type createCategorySchema = z.infer<typeof categorySchema>

const postCategoryData = async ( data: createCategorySchema ): Promise<createCategorySchema> => {
    console.log('Data being sent:', data);
    const response = await axios.post('http://127.0.0.1:3000/categories', data)
    return response.data
}

const MutationCreateCategory = (
    onSuccessCallback: ( data: createCategorySchema ) => void,
    setError: UseFormSetError<createCategorySchema>,
    setServerError: ( message: string ) => void
) => {
    return useMutation<createCategorySchema, AxiosError, createCategorySchema>({
        mutationFn: postCategoryData,
        onSuccess: ( data ) => {
            console.log('Data submitted successfully:', data)
            onSuccessCallback(data)
        },
        onError: (error) => {
            if (error.response) {
                console.error('Error response:', error.response);
                const responseData = error.response.data as { message?: string }
                if ( error.response.status === 400 && responseData.message ) {
                    console.log('Failed to create category (setError)')
                } else {
                    setServerError('An unexpected error occurred.')
                }
            } else {
                setServerError('An unexpected error occurred.')
            }
        }
    })
}

export default MutationCreateCategory