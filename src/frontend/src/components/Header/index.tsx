import { Link } from "react-router-dom";




function Header(){
    return(
        <header className="flex justify-end border-b-2 border-black py-5 bg-slate-500">
         
         <span className="flex gap-10 mx-10">
        
        <button className="border border-white text-white bg-black">Login</button>
         <Link to='/signUpPage'> <button className="border border-white text-white bg-black">Cadastro</button></Link>
            </span>   
        </header>


    )
}

export default Header;