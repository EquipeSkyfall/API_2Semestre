import axios from 'axios';
import signUpSchema from '../SignUpSchema/signUpSchema';
import {z} from 'zod'
type SignUpSchema = z.infer<typeof signUpSchema>;

const postUserData = async (data: SignUpSchema): Promise<SignUpSchema> => {
    const response = await axios.post('http://127.0.0.1:3000/users', data);
    return response.data;
  };
  
export default postUserData;