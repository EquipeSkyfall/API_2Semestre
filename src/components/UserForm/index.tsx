import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
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

    // Callback for successful submission
    const onSuccess = () => {
        reset();
        setSuccessMessage('User registered successfully!');
        
    };

    // Use the custom mutation hook
    const mutation = CreateUserMutation(onSuccess, setError, setServerError);

    const onSubmit = (data: SignUpSchema) => {   
        setServerError(null); // Clear previous error messages
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2 border-2 border-black bg-slate-500 p-10 place-items-center rounded">
            {successMessage && <p className="text-green-500 font-bold">{successMessage}</p>}
            {serverError && <p className="text-red-500">{serverError}</p>}
            <input
                {...register("name")}
                type='text'
                placeholder="Name"
                className="px-4 py-2 rounded"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <input
                {...register("email")}
                type='email'
                placeholder="Email"
                className="px-4 py-2 rounded"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
                {...register("password")}
                type='password'
                placeholder="Password"
                className="px-4 py-2 rounded"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm password"
                className="px-4 py-2 rounded"
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

            <div className="flex flex-col text-white mb-4">
                <label className="font-bold">Role:</label>
                {['admin', 'user', 'manager'].map((role) => (
                    <label key={role}>
                        <input
                            {...register("role")}
                            type="radio"
                            value={role}
                            className="mr-2"
                        />
                        {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize first letter */}
                    </label>
                ))}
                {errors.role && <p className="text-red-500">{errors.role.message}</p>}
            </div>

            <button
                type="submit"
                className="bg-slate-400 border-black disabled:bg-gray-500 py-2 rounded"
                disabled={isSubmitting} // Disable button when submitting
            >
                {isSubmitting ? 'Loading...' : 'Submit'} {/* Show loading text when submitting */}
            </button>
        </form>
    );
}

export default UserForm;
