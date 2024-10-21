import { z } from "zod";

export const batchProductSchema = z.object({
    id_produto: z.number(),
    quantidade: z.number(),
    validade_produto: z.date().optional().nullable(), // Since it's optional in your model
});

export const batchSchema = z.object({
    id_fornecedor: z.number().nullable().refine(value => value !== null, { message: "Lotes devem conter um fornecedor." }),
    produtos: z.array(batchProductSchema).min(1, "Insira pelo menos um produto."),
});

export type BatchSchema = z.infer<typeof batchSchema>;
export type BatchProductSchema = z.infer<typeof batchProductSchema>;