import UserForm from "../components/UserForm";
import { useEffect } from "react";


export default function Home() {

    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);
    return (
        <>
            <div className="text-center">
                <img src="/Prostock.png" alt="" className="absolute w-72 sm:w-80 left-1/2 transform -translate-y-1/2 -translate-x-40 sm:-translate-x-44 opacity-35" />
                <h1 className="relative text-5xl sm:text-8xl text-cyan-500 font-bold mt-28 sm:mt-40 mb-24 sm:-mb-28 z-10 font-['Afacad_Flux']">ProStock</h1>
            </div>
            <div className="flex">
                <UserForm />
            </div>
        </>
    );
}   