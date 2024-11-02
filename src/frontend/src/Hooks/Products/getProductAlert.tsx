import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAlertProducts = async () => {
    const [lowStockResponse, expiringResponse] = await Promise.all([
        axios.get('http://127.0.0.1:3000/products/stock'),
        axios.get('http://127.0.0.1:3000/products/expiring'),
    ]);

    return {
        lowStock: lowStockResponse.data,
        expiring: expiringResponse.data,
    };
};

const useFetchAlertProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchAlertProducts,
    });
};

export default useFetchAlertProducts;