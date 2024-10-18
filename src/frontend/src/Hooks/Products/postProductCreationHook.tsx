import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import  {productSchema}  from '../../components/ProductForm/ProductSchema/productSchema'
import  {z} from 'zod'
import { UseFormSetError } from 'react-hook-form';
type createProductSchema = z.infer<typeof productSchema>;

const postProductData = async (data: createProductSchema): Promise<createProductSchema> => {
  const response = await axios.post('http://127.0.0.1:3000/products', data);
  return response.data;
};
  

const MutationCreateProduct = (
  onSuccessCallback: (data: createProductSchema) => void,
  setError: UseFormSetError<createProductSchema>, 
  setServerError: (message: string) => void
) => {
  return useMutation<createProductSchema, AxiosError, createProductSchema>({
    mutationFn: postProductData,
    onSuccess: (data) => {
      console.log('Data submitted successfully:', data);
      onSuccessCallback(data);
    },
    onError: (error) => {
      if (error.response) {
        const responseData = error.response.data as { message?: string };
        if (error.response.status === 400 && responseData.message) {
        //   setError('email', { message: responseData.message }); // This will now be correctly typed
        console.log('Failed to create product (setError)')
        } else {
          setServerError('An unexpected error occurred.'); // Generic error message
        }
      } else {
        setServerError('An unexpected error occurred.');
      }
    },
  });
};

export default MutationCreateProduct;