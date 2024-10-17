import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginSchema from './LoginSchema/loginSchema';
import getUserData from './UserFormControllers/getUserData';
type LoginSchema = z.infer<typeof loginSchema>;

function LoginForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: LoginSchema) => {
        setServerError(null);
        try {
            const user = await getUserData(data);
            if (user) {
                reset();
                setSuccessMessage('Login realizado com sucesso!');
                navigate('/products');
            }
        } catch (error: any) {
            setServerError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen pl-96 ml-40 ">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 border-2 bg-slate-50 shadow-md p-11 place-items-center rounded">
                <label className='text-2xl text-cyan-500 font-bold -mt-5 mb-5'>Entrar</label>
                {successMessage && <p className="text-green-500 font-bold">{successMessage}</p>}
                {serverError && <p className="text-red-500">{serverError}</p>}
                <input
                    {...register("email")}
                    type='email'
                    placeholder="Email"
                    className="px-16 py-2 rounded-full shadow-md text-center"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <input
                    {...register("password")}
                    type='password'
                    placeholder="Senha"
                    className="px-16 py-2 rounded-full shadow-md text-center"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                <button
                    type="submit"
                    className="bg-cyan-500 py-2 rounded w-full text-white animate-pulse"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Carregando...' : 'Entrar'}
                </button>
                <Link to='/cadastrar'>
                    <button className="text-black mt-1 hover:text-cyan-500 transition duration-300 ease-in-out">Criar Conta </button>
                </Link>
            </form>
        </div>
    );
}

export default LoginForm;