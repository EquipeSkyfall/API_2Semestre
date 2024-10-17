import UserForm from "../components/UserForm";



export default function Home() {
    return (
        <>
            <div className="text-center">
                <img src="/Prostock.png" alt="" className=" absolute w-52 left-1/2 right-96 transform -translate-x-28 -translate-y-1/2 opacity-35" />
                <h1 className="relative text-6xl text-cyan-500 font-bold mt-24 -mb-20 z-10">ProStock</h1>
            </div>
            <div className="flex">
                <UserForm />
            </div>
        </>
    );
}   