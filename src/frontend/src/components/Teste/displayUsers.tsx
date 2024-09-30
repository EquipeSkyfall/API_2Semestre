import React from 'react';
import FetchAllUsers from '../../Hooks/Users/fetchAllUsersHook';
 // Adjust the import path as needed

const UsersList: React.FC = () => {
    const { data: users, isLoading, isError, error } = FetchAllUsers();

    if (isLoading) {
        return <div>Loading users...</div>;
    }

    if (isError) {
        return <div>Error: {error?.message}</div>;
    }

    return (
        <div>
            <h1>Users List</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList;
