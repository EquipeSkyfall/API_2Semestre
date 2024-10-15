//fetchAllProductsHook.tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the type for the user data
interface Product {
    id: number;
    product_name: string;
    description?: string;
    batch: string;
    brand: string;
    quantity: number;
    price: number;
    retail_price: number;
    stock_location?: string;
    id_category?: number;
    id_sector?: number;
    url_image?: string;
    weight?: number;
    height?: number;
    width?: number;
  }

const FetchAllProducts = () => {
    return useQuery<Product[], Error>({
      queryKey: ['ProductsData'],
      queryFn: async () => {
        const { data } = await axios.get('http://127.0.0.1:3000/products');
        
        return data;
      },
    });
  };
  
  export default FetchAllProducts;
