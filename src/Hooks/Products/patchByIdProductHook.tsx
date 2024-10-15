import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Product {
    id_produto: number;   
    nome_produto: string;  
    descricao_produto?: string;
    marca_produto: string; 
    modelo_produto?: string; 
    preco_venda: number; 
    altura_produto?: number; 
    largura_produto?: number;   
    comprimento_produto?: number;
    localizacao_estoque?: string;
    permalink_imagem?: string; 
    peso_produto?: number;  
    id_categoria?: number;    
    id_setor?: number;       
}

// Hook para atualizar o produto
const useUpdateProduct = () => {
    return useMutation<Product, Error, Product>({
        mutationFn: async (product: Product) => {
            // Alterando o endpoint para refletir o campo id_produto
            const { data } = await axios.patch<Product>(`http://127.0.0.1:3000/products/${id.produto}`, product);
            return data;
        },
    });
};

export default useUpdateProduct;
