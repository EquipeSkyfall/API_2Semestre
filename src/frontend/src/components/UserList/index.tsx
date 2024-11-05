import { useState } from "react";
import useGetUsers from "../../Hooks/Users/fetchAllUsersHook";
import EditUserButton from "../UserEditButton";
import useGetUser from "../../Hooks/Users/getUserHook";
import useDeleteUser from "../../Hooks/Users/deleteUserHook";

const UsersList = ({ query }) => {
  const [page, setPage] = useState(1);
  // const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
  const { data, isLoading, error } = useGetUsers({ page, searchTerm: query });
  const { data: currentUser } = useGetUser();
  const deleteUserMutation = useDeleteUser();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;
  // console.log(currentUser)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };
  return (
    <>
      <ul>
        {data?.users?.length > 0 ? (
          data.users.map((user) => (
            currentUser.id !== user.id ? (
              <li key={user.id}>
                <span>{user.name}</span>
                {(currentUser.role === "Administrador" && user.role !== "Administrador") ? (
                  <>
                    <EditUserButton 
                      user={user} 
                      currentUser={currentUser} 
                    />
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                ) : null}
              </li>
            ) : null
          ))
        ) : (
          <li>No users available</li>
        )}
      </ul>
      
      <div className="pagination">
        {Array.from({ length: data.totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            disabled={index + 1 === page}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default UsersList;
