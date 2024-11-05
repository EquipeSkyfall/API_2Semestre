// UsersPage.js
// import { useState } from 'react';
import UserSearchBar from '../components/UserSearchBar';
import UserInfo from '../components/UserInfo';
import useGetUser from '../Hooks/Users/getUserHook';

const UsersPage = () => {
    const { data: user, isLoading, error } = useGetUser();
    // const [page, setPage] = useState(1);
    
    // const [query, setQuery] = useState("");
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading users</p>;
    // console.log(user)
    
    return (
        <div className="users-page">
            
            {user.role === 'Gerente' || user.role === 'Administrador'? (<>
                <h1>Lista de Usuários</h1>
                <UserSearchBar />
            </>
            ): <div></div>}
            <h2>Informações do Usuário</h2> 
            <UserInfo/>
          
        </div>
    );
};

export default UsersPage;
