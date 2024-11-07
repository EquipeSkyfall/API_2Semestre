import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-50 p-4 mb-5 shadow-lg relative">
      <div className="flex items-center justify-between lg:justify-normal">
        <img
          src="/Prostock.png"
          width={120}
          className=" -mt-10 -mb-5"
          alt="Logo"
        />
        {/* Botão de Menu Hamburguer */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
          >
            {/* Ícone do hamburguer */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        <div
          className={` absolute z-50 shadow-lg end-0 lg:end-auto bg-slate-50 transition-all duration-300 ease-in-out ${isOpen
            ? "top-full opacity-100"
            : "top-0 lg:opacity-100 opacity-0 max-h-0 overflow-hidden lg:overflow-visible"
            }`}>
          <div className="flex flex-col lg:flex-row mr gap-0 lg:gap-8 lg:place-items-start items-end mt-0 p-2 lg:pr-0 lg:p-2 lg:ml-36 lg:text-lg ">
            <Link to='/products'>
              <button className="lg:hover:border-r-transparent hover:border-r-4 lg:hover:border-b-4 hover:border-r-cyan-400 lg:hover:border-b-cyan-400 lg:pb-2 -mr-2  lg:-mr-0 bordernav">Produtos</button>
            </Link>
            <Link to='/Historico'>
              <button className="lg:hover:border-r-transparent hover:border-r-4 lg:hover:border-b-4 hover:border-r-cyan-400 lg:hover:border-b-cyan-400 lg:pb-2 -mr-2  lg:-mr-0 bordernav">Histórico</button>
            </Link>
            <Link to='/Movimentacao'>
              <button className="lg:hover:border-r-transparent hover:border-r-4 lg:hover:border-b-4 hover:border-r-cyan-400 lg:hover:border-b-cyan-400 lg:pb-2 -mr-2  lg:-mr-0 bordernav">Movimentações</button>
            </Link>
            <Link to='/Report'>
              <button className="lg:hover:border-r-transparent hover:border-r-4 lg:hover:border-b-4 hover:border-r-cyan-400 lg:hover:border-b-cyan-400 lg:pb-2 -mr-2  lg:-mr-0 bordernav">Relatórios</button>
            </Link>
            <Link to='/Fornecedor'>
              <button className="lg:hover:border-r-transparent hover:border-r-4 lg:hover:border-b-4 hover:border-r-cyan-400 lg:hover:border-b-cyan-400 lg:pb-2 -mr-2  lg:-mr-0 bordernav">Fornecedores</button>
            </Link>
            <Link to='/usuario'>
              <button className="lg:hover:border-r-transparent hover:border-r-4 lg:hover:border-b-4 hover:border-r-cyan-400 lg:hover:border-b-cyan-400 lg:pb-2 -mr-2  lg:-mr-0 bordernav">Usuários</button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
