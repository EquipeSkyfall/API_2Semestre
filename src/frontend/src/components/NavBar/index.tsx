import { Link } from "react-router-dom"

export default function NavBar(){
    return(
        <nav className="bg-slate-600 flex justify-around text-white">
          <Link to='/'><button >Home</button></Link>
          <Link to='/products'><button >Produtos</button></Link>
          <Link to='/teste'><button >Histórico</button></Link>
          <Link to='/teste'><button >Movimentações</button></Link>
          <Link to='/teste'><button >Relatórios</button></Link>
        </nav>
    )

}