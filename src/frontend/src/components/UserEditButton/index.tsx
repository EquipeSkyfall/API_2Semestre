import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useUpdateUser from '../../Hooks/Users/patchUserHook';

const EditUserButton = ({ user,currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: user.name,
            email: user.email,
            oldPassword: '',
            password: '',
        },
    });
    const { mutate: updateUser, isError, isSuccess, error } = useUpdateUser();
    // console.log(currentUser)
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const onSubmit = (data) => {
        updateUser(
            { ...data, id: user.id },
            {
                onError: (error) => {
                    // Handle error responses from the backend
                    if (error.response.data.message.includes("Email already exists")) {
                        setError("email", { type: "manual", message: "This email is already taken" });
                    }
                    if (error.response.data.message.includes("Incorrect old password")) {
                        setError("oldPassword", { type: "manual", message: "Incorrect old password" });
                    }
                },
            }
        );
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            {...register('email', { 
                                required: 'Email is required', 
                                pattern: { 
                                    value: /^\S+@\S+$/i, 
                                    message: 'Invalid email address' 
                                } 
                            })}
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>
                    
                    {currentUser.role !== "Administrador" || currentUser.id === user.id? <div>
                        <label>Old Password</label>
                        <input
                            type="password"
                            {...register('oldPassword', { required: 'Old password is required' })}
                        />
                        {errors.oldPassword && <p>{errors.oldPassword.message}</p>}
                    </div> : <div></div> }
                    

                    <div>
                        <label>New Password</label>
                        <input
                            type="password"
                            {...register('password', { minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                        />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => { reset(); handleEditClick(); }}>Cancel</button>
                </form>
            ) : (
                <div>
                    {/* <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p> */}
                    
                    <button onClick={handleEditClick}>Edit</button>
                </div>
            )}
            {isError && <p>Error updating user</p>}
            {/* {isSuccess && <p>User updated successfully</p>} */}
        </div>
    );
};

export default EditUserButton;
