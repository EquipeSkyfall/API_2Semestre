import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-slate-50 flex items-center gap-12 p-4 mb-5 text-black border-b-slate-100 pb-0 -mt-2 shadow-md">
      <img src="/Prostock.png" width={120}  className=" -mt-10 -mb-5" alt="Logo" />
      <Link to='/products'>
        <button className="hover:border-b-4 hover:border-b-cyan-400 pb-2 bordernav">Produtos</button>
      </Link>
      <Link to='/Historico'>
        <button className="hover:border-b-4 hover:border-b-cyan-400 pb-2 bordernav">Histórico</button>
      </Link>
      <Link to='/teste'>
        <button className="hover:border-b-4 hover:border-b-cyan-400 pb-2 bordernav">Movimentações</button>
      </Link>
      <Link to='/Relatorio'>
        <button className="hover:border-b-4 hover:border-b-cyan-400 pb-2 bordernav">Relatórios</button>
      </Link>
    </nav>
  );
}
