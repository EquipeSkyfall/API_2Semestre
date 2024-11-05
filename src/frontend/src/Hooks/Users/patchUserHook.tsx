import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user) => {
            const { data } = await axios.patch(`http://127.0.0.1:3000/users/${user.id}`, user,{withCredentials: true});
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ['users'] });
            return data;

        },
    });
};

export default useUpdateUser;
