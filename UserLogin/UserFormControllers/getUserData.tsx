import axios from 'axios';
import {z} from 'zod';
import loginSchema from '../LoginSchema/loginSchema';

type LoginSchema = z.infer<typeof loginSchema>;

const getUserData = async (data: LoginSchema): Promise<LoginSchema | null> => {
    try {
        const response = await axios.get('http://127.0.0.1:3000/users', {
            params: {
                email: data.email,
                password: data.password,
            },
        });
        
        if (response.data && response.data.length > 0) {
            return response.data[0]; 
        } else {
            throw new Error('Usuário ou senha incorretos');
        }
    } catch (error) {
        throw new Error('Erro ao realizar login');
    }
};

export default getUserData;