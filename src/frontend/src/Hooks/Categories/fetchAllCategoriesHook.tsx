import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Category } from "../../components/CategoryTypes/types";
import { useNavigate, useLocation } from "react-router-dom";

interface CategoriesResponse {
    categories: Category[];
    totalPages: number;
    totalCategories: number;
}

const FetchAllCategories = (search: string, page: number, limit: number | string = 'all') => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data = { categories: [], totalPages: 1, totalCategories: 0 }, isLoading, isError, refetch } = useQuery<CategoriesResponse>({
        queryKey: ['CategoriesData', page, limit],
        queryFn: async () => {
            
            
            try{
            const response = await axios.get(`http://127.0.0.1:3000/categories?search=${search}&page=${page}&limit=${limit}`,{withCredentials:true})
            return response.data || { categories: [], totalPages: 1, totalCategories: 0 }
            }catch(error){
                if (axios.isAxiosError(error)){
                    const errorResponse = error.response;
                if (errorResponse?.status === 401) {
                    console.log('Unauthorized access - redirecting or handling as necessary');
                    sessionStorage.clear()
                    navigate('/', { state: { from: location }, replace: true });
                     
                }
            }}
        
        },
        retry: false,
    });

    return {
        categories: data.categories,
        totalPages: data.totalPages,
        totalCategories: data.totalCategories,
        isLoading,
        isError,
        refetch
    }
};

export default FetchAllCategories;