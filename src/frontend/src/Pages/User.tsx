// UsersPage.js
// import { useState } from 'react';
import UserSearchBar from '../components/UserSearchBar';
import UserInfo from '../components/UserInfo';
import useGetUser from '../Hooks/Users/getUserHook';
import UserProductsList from '../components/UserProductLists';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const { data: user, isLoading, error } = useGetUser();
    // const [page, setPage] = useState(1);

    // const [query, setQuery] = useState("");
    if (isLoading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar Usuários</p>;
    // console.log(user)

    return (
        <div className="users-page p-5">
            <div className='lg:flex justify-center space-x-4'>
            <div className='flex justify-start'>
            {user.role === 'Administrador'? 
            <Link to='/cadastrar'>
                    <button className="text-cyan-700 mt-1 text-xl sm:text-lg hover:text-cyan-500 transition duration-300 ease-in-out">Criar Conta </button>
                </Link>:<div></div>}
        </div>
                <div className='flex flex-col'>
                    {user.role === 'Gerente' || user.role === 'Administrador' ? (<>
                        <h1 className='text-cyan-600 font-["Afacad_Flux"] mr-0 text-center text-2xl xl:text-4xl md:mt-0 !mt-10 '>Lista de Usuários</h1>
                        <UserSearchBar />
                    </>
                    ) : <></>}
                </div>
                <div className='flex flex-col'>
                    {user.role === 'Gerente' ? (<>
                        <h1 className='text-cyan-600 font-["Afacad_Flux"] mr-0 text-center text-2xl xl:text-4xl md:mt-0 !mt-10'>Alertas do Sistema</h1>
                        <UserProductsList />
                    </>
                    ) : <></>}
                </div>
                <div className='flex flex-col'>
                    <h1 className=' text-cyan-600 font-["Afacad_Flux"] mr-0 text-center text-2xl xl:text-4xl md:mt-0 !mt-10'>Informações do Usuário</h1>
                    <UserInfo />
                </div>
            </div >
          
        </div>
    );
};

export default UsersPage;
