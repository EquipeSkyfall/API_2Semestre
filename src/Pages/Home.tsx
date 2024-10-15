import UsersList from "../components/Teste/displayUsers";
import UserForm from "../components/UserForm";



export default function Home(){
    
    return (
    <>
    <div className="flex">

    <UserForm></UserForm>
    <UsersList></UsersList>
    </div>
    </>)
}