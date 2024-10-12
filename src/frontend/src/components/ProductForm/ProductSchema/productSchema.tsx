// productSchema.tsx
import { z } from 'zod';

export const productSchema = z.object({
    nome_produto: z.string().min(1, "Nome do Produto é obrigatório"),
    descricao_produto: z.string().optional(),
    marca_produto: z.string().optional(),
    modelo_produto: z.string().optional(),
    preco_venda: z.number().min("Preço Invalido.").positive(),
    altura_produto: z.number().min("Largura Invalida.").positive(),
    largura_produto: z.number().min("Altura Invalida.").positive(),
    comprimento_produto: z.number().min("Profundidade Invalida.").positive(),
    localizacao_estoque: z.string().optional(),
    permalink_imagem: z.string().optional(),
    peso_produto: z.number().min("Peso Invalido.").positive(),
    id_categoria: z.preprocess(
        (value) => (value === '' ? null : Number(value)),
        z.number().optional().nullable()
    ),
    id_setor: z.preprocess(
        (value) => (value === '' ? null : Number(value)),
        z.number().optional().nullable()
    )
});

// Type inferred from the schema
export type ProductSchema = z.infer<typeof productSchema>;
