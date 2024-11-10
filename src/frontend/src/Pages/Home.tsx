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
            <div className="overflow-hidden">
            <div className="text-center">
                <img src="/Prostock.png" alt="" className="absolute w-72 sm:w-80 left-1/2 transform -translate-y-44 sm:-translate-y-42 sm:-translate-x-44 -translate-x-40 opacity-35" />
                <h1 className="relative text-6xl sm:text-8xl text-cyan-500 font-bold mt-24 sm:mt-40 -mb- sm:-mb-28 z-10 font-['Afacad_Flux']">ProStock</h1>
            </div>
            <div className="flex">
                <UserForm />
            </div>
        </div >
        </>
    );
}   