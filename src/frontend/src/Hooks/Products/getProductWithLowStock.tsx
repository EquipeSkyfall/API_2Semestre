import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { ProductSchema } from "./getSearchProductbyNameHook"

const fetchLowStock = () => {
    return useQuery<ProductSchema[], Error>({
        queryKey: ['products', 'lowStock'],
        queryFn: async () => {
            const {data} = await axios.get('http://127.0.0.1:3000/products/stock')
            return data;
        }
    })
};

export default fetchLowStock;