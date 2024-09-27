import React from "react";
import FetchAllUsers from "../../Hooks/Users/fetchAllUsersHook"; // Adjust the path as necessary

const DisplayAllUsers: React.FC = () => {
  const { data, error, isLoading, refetch } = FetchAllUsers();

  if (isLoading) return <div>Loading...</div>; // Consider adding a spinner or skeleton

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button> {/* Retry button for better UX */}
      </div>
    );
  }

  return (
    <div>
      {data?.map(user => (
        <div key={user.id} className="user-card"> {/* You can style this div as needed */}
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayAllUsers;
