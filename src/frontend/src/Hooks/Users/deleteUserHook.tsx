import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async (id) => {
      await axios.delete(`http://127.0.0.1:3000/users/${id}`, { withCredentials: true });
    },
      onSuccess: () => {
        // Invalidate and refetch the users list
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    
});
};

export default useDeleteUser;
