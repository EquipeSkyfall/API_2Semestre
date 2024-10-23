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
                <img src="/Prostock.png" alt="" className=" absolute w-80 left-1/2 transform -translate-x-44 -translate-y-1/2 opacity-35" />
                <h1 className="relative text-8xl text-cyan-500 font-bold mt-28 -mb-28 z-10 font-['Afacad_Flux']">ProStock</h1>
            </div>
            <div className="flex">
                <UserForm />
            </div>
        </>
    );
}   