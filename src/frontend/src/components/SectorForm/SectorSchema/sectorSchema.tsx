import { z } from 'zod'

export const sectorSchema = z.object({
    nome_setor: z.string().min(1, "Nome do setor é obrigatório.")
});

export type SectorSchema = z.infer<typeof sectorSchema>