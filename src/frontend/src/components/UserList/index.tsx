import { useState } from "react";
import useGetUsers from "../../Hooks/Users/fetchAllUsersHook";
import EditUserButton from "../UserEditButton";
import useGetUser from "../../Hooks/Users/getUserHook";
import useDeleteUser from "../../Hooks/Users/deleteUserHook";

const UsersList = ({ query }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetUsers({ page, searchTerm: query });
  const { data: currentUser } = useGetUser();
  const deleteUserMutation = useDeleteUser();

  const USERS_PER_PAGE = 5;

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os usuários</p>;

  const handleDelete = (id) => {
    if (window.confirm("Você tem certeza que gostaria de deletar este usuário?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col justify-between h-full pt-4">
      <ul className="flex-grow">
        {data?.users?.length > 0 ? (
          data.users.slice(0, USERS_PER_PAGE).map((user) =>
            currentUser.id !== user.id ? (
              <li key={user.id} className="border-b p-2 flex justify-between items-center">
                <span className="hover:text-cyan-600">{user.name}</span>
                {(currentUser.role === "Administrador" && user.role !== "Administrador") ? (
                  <div className="space-x-5">
                    <div className="absolute">
                      <EditUserButton user={user} currentUser={currentUser} />
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDelete(user.id)}
                    >
                      Deletar
                    </button>
                  </div>
                ) : null}
              </li>
            ) : null
          )
        ) : (
          <li>Nenhum usuário disponível</li>
        )}
      </ul>

      {data && (
        <div className="pagination-controls py-4 flex justify-center items-center mt-4">
          <button
            className={`mx-2 px-4 py-2 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-500 text-white hover:bg-cyan-600"
              }`}
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {page} de {data.totalPages}
          </span>
          <button
            className={`mx-2 px-4 py-2 rounded ${page === data.totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-500 text-white hover:bg-cyan-600"
              }`}
            disabled={page === data.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersList;