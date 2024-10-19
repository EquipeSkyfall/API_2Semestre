import { z } from "zod";

export const batchProductSchema = z.object({
    id_produto: z.number(),
    quantidade: z.number(),
    validade_produto: z.date().optional().nullable(), // Since it's optional in your model
});

export const batchSchema = z.object({
    id_fornecedor: z.number(),
    data_compra: z.date(),
    produtos: z.array(batchProductSchema).min(1, "At least one product is required"),
});

export type BatchSchema = z.infer<typeof batchSchema>;
export type BatchProductSchema = z.infer<typeof batchProductSchema>;