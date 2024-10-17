import { z } from 'zod'

export const categorySchema = z.object({
    nome_categoria: z.string().min(1, "Nome da categoria é obrigarório."),
    descricao_categoria: z.string().optional()
});

export type CategorySchema = z.infer<typeof categorySchema>