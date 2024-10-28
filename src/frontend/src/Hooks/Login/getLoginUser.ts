import {useMutation} from "@tanstack/react-query";
import axios from "axios"
interface LoginCredentials{
    email: string;
    password:string;
}

const login = async (credentials)=>{
    // console.log(credentials)
    const {data} = await axios.post('http://127.0.0.1:3000/users/login', credentials,{withCredentials:true});
    
    return data
}

const useUserLogin = () =>{
    return useMutation<Error,LoginCredentials>({
        mutationFn: login,
        onSuccess:(data) =>{
          
            sessionStorage.setItem('expiration',data.expiration)
            console.log(data.data.user.role)
            console.log(new Date(data.expiration).toLocaleString())
        },
        onError:(error)=>{
            console.log(error)
            const message = error.response?.data?.message
            throw new Error(message)
        }


    })

}

export default useUserLogin;