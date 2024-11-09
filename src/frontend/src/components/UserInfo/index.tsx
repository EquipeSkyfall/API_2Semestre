import useGetUser from '../../Hooks/Users/getUserHook';
import EditUserButton from '../UserEditButton';
import { useState } from 'react';

function UserInfo() {
  const { data: user, isLoading, error } = useGetUser();
  const [isEditing, setIsEditing] = useState(false); // Estado para controle de edição

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar as informações do usuário</p>;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div
      className='bg-white p-5 rounded-md shadow-md flex text-xl flex-col items-start duration-300 relative h-[15vw] w-[20vw]'
    >
      <div className="mb-2">
        <p className="font-semibold">Nome:</p>
        <p>{user.name}</p>
      </div>
      <div className="mb-2">
        <p className="font-semibold">Email:</p>
        <p>{user.email}</p>
      </div>
      <div>
        <p className="font-semibold">ID:</p>
        <p>{user.id}</p>
      </div>
      {/* Ícone para abrir/fechar o formulário de edição */}
      <div className="absolute top-[5%] left-[90%]" onClick={handleEditToggle}>
        <EditUserButton user={user} currentUser={user} />
      </div>
    </div>
  );
}

export default UserInfo;
