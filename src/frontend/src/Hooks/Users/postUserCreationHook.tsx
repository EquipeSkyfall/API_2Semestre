import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import  signUpSchema  from '../../components/UserForm/SignUpSchema/signUpSchema'
import  {z} from 'zod'
import { UseFormSetError } from 'react-hook-form';
type SignUpSchema = z.infer<typeof signUpSchema>;

const postUserData = async (data: SignUpSchema): Promise<SignUpSchema> => {
    const response = await axios.post('http://127.0.0.1:3000/users', data);
    return response.data;
  };
  

const MutationCreateUser = (
  onSuccessCallback: (data: SignUpSchema) => void,
  setError: UseFormSetError<SignUpSchema>, 
  setServerError: (message: string) => void
) => {
  return useMutation<SignUpSchema, AxiosError, SignUpSchema>({
    mutationFn: postUserData,
    onSuccess: (data) => {
      console.log('Data submitted successfully:', data);
      onSuccessCallback(data);
    },
    onError: (error) => {
      if (error.response) {
        const responseData = error.response.data as { message?: string };
        if (error.response.status === 400 && responseData.message) {
          setError('email', { message: responseData.message }); // This will now be correctly typed
        } else {
          setServerError('An unexpected error occurred.'); // Generic error message
        }
      } else {
        setServerError('An unexpected error occurred.');
      }
    },
  });
};

export default MutationCreateUser;
