import { useState, useEffect } from "react";
import useGetUsers from "../../Hooks/Users/fetchAllUsersHook";
import EditUserButton from "../UserEditButton";
import useGetUser from "../../Hooks/Users/getUserHook";
import useDeleteUser from "../../Hooks/Users/deleteUserHook";

const UsersList = ({ query }) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9); // Definindo limite inicial de usuários por página

    const { data, isLoading, error } = useGetUsers({ page, limit, searchTerm: query });
    const { data: currentUser } = useGetUser();
    const deleteUserMutation = useDeleteUser();

    // Ajuste do limite de listagem com base na largura da tela
    useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth <= 768) {
              setLimit(7);
          }else if (window.innerWidth <= 1023) {
              setLimit(7);
          }
           else {
              setLimit(7);
          }
      };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
        <div className="flex flex-col justify-between pt-4 ">
            <ul className="flex-grow">
                {data?.users?.length > 0 ? (
                    data.users.map((user) =>
                        currentUser.id !== user.id ? (
                            <li key={user.id} className="border-b p-2 flex justify-between items-center">
                                <span className="hover:text-cyan-600">{user.name}</span>
                                {(currentUser.role === "Administrador" && user.role !== "Administrador") ? (
                                    <div className="space-x-5">
                                        <div className="absolute mt-2">
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
                <div className="pagination-controls flex justify-between items-center mt-2 text-sm 2xl:text-base w-full">
                    <button
                        className={`mx-3 py-2 px-2 sm:py-2 sm:px-4 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-500 text-white hover:bg-cyan-600"}`}
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Anterior
                    </button>
                    <span className="text-gray-600 2xl:text-base text-xs">
                        Página {page} de {data.totalPages}
                    </span>
                    <button
                        className={`mx-3 px-2 py-2 rounded ${page === data.totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-cyan-500 text-white hover:bg-cyan-600"}`}
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