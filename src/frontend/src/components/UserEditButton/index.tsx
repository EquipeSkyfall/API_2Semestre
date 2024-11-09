import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useUpdateUser from '../../Hooks/Users/patchUserHook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

const EditUserButton = ({ user, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: user.name,
            email: user.email,
            oldPassword: '',
            password: '',
        },
    });
    const { mutate: updateUser, isError } = useUpdateUser();

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit = (data) => {
        updateUser(
            { ...data, id: user.id },
            {
                onError: (error) => {
                    if (error.response.data.message.includes("Este email já existe!")) {
                        setError("email", { type: "manual", message: "Esse email já está cadastrado" });
                    }
                    if (error.response.data.message.includes("Senha antiga incorreta!")) {
                        setError("oldPassword", { type: "manual", message: "Senha antiga incorreta" });
                    }
                },
            }
        );
        setIsEditing(false);
    };

    return (
        <div>
            <button onClick={handleEditClick} className='py-1 px-1 rounded transition duration-300'>
                <FontAwesomeIcon className='text-cyan-500 text-xl hover:text-cyan-600 duration-300' icon={faPencil} />
            </button>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-['Afacad_Flux']">
                    <div className="relative bg-white rounded-lg shadow-lg p-8 w-[90vw] max-w-md">
                        <button onClick={handleEditClick} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                            ✕
                        </button>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <h2 className="text-2xl font-semibold text-center text-cyan-600">Editar Usuário</h2>
                            <div>
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Nome é obrigatório' })}
                                    className='rounded-md border border-cyan-700 py-2 px-3 w-full'
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email é obrigatório',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Formato de email inválido'
                                        }
                                    })}
                                    className='rounded-md border border-cyan-700 py-2 px-3 w-full'
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                            {(currentUser.role !== "Administrador" || currentUser.id === user.id) && (
                                <div>
                                    <label>Senha Antiga:</label>
                                    <input
                                        type="password"
                                        {...register('oldPassword', { required: 'Senha antiga é obrigatório' })}
                                        className='rounded-md border border-cyan-700 py-2 px-3 w-full'
                                    />
                                    {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}
                                </div>
                            )}
                            <div>
                                <label>Nova Senha:</label>
                                <input
                                    type="password"
                                    {...register('password', { minLength: { value: 6, message: 'A senha precisa ter pelo menos 6 caracteres' } })}
                                    className='rounded-md border border-cyan-700 py-2 px-3 w-full'
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                            <div className='text-end space-x-3'>
                                <button type="submit" disabled={isSubmitting} className='py-2 px-4 bg-green-600 hover:bg-green-700 transition duration-300 text-white'>
                                    {isSubmitting ? "Salvando..." : "Salvar"}
                                </button>
                                <button type="button" onClick={() => { reset(); handleEditClick(); }} className='py-2 px-4 bg-red-600 hover:bg-red-700 transition duration-300 text-white'>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                        {isError && <p className="text-red-500 text-sm mt-2">Erro ao atualizar usuário</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditUserButton;