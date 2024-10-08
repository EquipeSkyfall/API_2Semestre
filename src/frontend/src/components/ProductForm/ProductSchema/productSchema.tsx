// productSchema.tsx
import { z } from 'zod';

export const productSchema = z.object({
    nome_produto: z.string().min(1, "Product name is required"),
    descricao_produto: z.string().optional(),
    marca_produto: z.string().optional(),
    modelo_produto: z.string().optional(),
    preco_venda: z.number().min("Invalid price.").positive(),
    altura_produto: z.number().min("Invalid height.").positive(),
    largura_produto: z.number().min("Invalid width.").positive(),
    comprimento_produto: z.number().min("Invalid depth.").positive(),
    localizacao_estoque: z.string().optional(),
    permalink_imagem: z.string().optional(),
    peso_produto: z.number().min("Invalid weight.").positive(),
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