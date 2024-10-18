import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importando useNavigate
import signUpSchema from './SignUpSchema/signUpSchema';
import CreateUserMutation from '../../Hooks/Users/postUserCreationHook'; // Import the custom hook

// Infer the type from the schema
type SignUpSchema = z.infer<typeof signUpSchema>;

function UserForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
    });

    const navigate = useNavigate(); // Hook para navegação

    // Callback para submissão bem-sucedida
    const onSuccess = () => {
        reset();
        setSuccessMessage('Usuário registrado com sucesso!');
        navigate('/products'); // Redireciona para a rota /products
    };

    // Use the custom mutation hook
    const mutation = CreateUserMutation(onSuccess, setError, setServerError);

    const onSubmit = (data: SignUpSchema) => {
        setServerError(null); // Limpa mensagens de erro anteriores
        mutation.mutate(data);
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen ">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 border-2 bg-slate-50 shadow-md p-10 place-items-center rounded">
                {successMessage && <p className="text-green-500 font-bold">{successMessage}</p>}
                {serverError && <p className="text-red-500">{serverError}</p>}
                <input
                    {...register("name")}
                    type='text'
                    placeholder="Nome"
                    className="px-16 py-2 rounded-full shadow-md text-center placeholder-cyan-700"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                <input
                    {...register("email")}
                    type='email'
                    placeholder="Email"
                    className="px-16 py-2 rounded-full shadow-md text-center placeholder-cyan-700"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <input
                    {...register("password")}
                    type='password'
                    placeholder="Senha"
                    className="px-16 py-2 rounded-full  shadow-md text-center placeholder-cyan-700"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Repita a senha"
                    className="px-16 py-2 rounded-full shadow-md text-center placeholder-cyan-700"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                <div className="flex flex-col text-black mb-4">
                    <label className="font-bold px-3 text-center mb-3 mt-3">Cargos</label>
                    <div className="flex flex-row gap-4">
                        {['Administrador', 'Usuário', 'Gerente'].map((role) => (
                            <label key={role} className="flex items-center">
                                <input
                                    {...register("role")}
                                    type="radio"
                                    value={role}
                                    className="hidden peer" //
                                />
                                <div className="w-4 h-4 border-2 rounded-sm flex items-center justify-center mr-2 peer-checked:bg-cyan-500 hover: peer-checked:border-cyan-500 bg-white transition duration-300 ease-in-out"></div>
                                {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitaliza a primeira letra */}
                            </label>
                        ))}
                    </div>
                    {errors.role && <p className="text-red-500 flex justify-center text-sm">{errors.role.message}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-cyan-500 py-2 rounded w-full text-white animate-pulse"
                    disabled={isSubmitting} // Desabilita o botão durante o envio
                >
                    {isSubmitting ? 'Carregando...' : 'Registrar'} {/* Exibe texto de carregamento ao enviar */}
                </button>
                <Link to='/'>
                    <button className="text-cyan-700 mt-1 hover:text-cyan-500 transition duration-300 ease-in-out">Já possui uma conta?</button>
                </Link>
        </form>
        </div >
    );
}

export default UserForm;