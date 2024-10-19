import { z } from "zod";

export const shipmentProductSchema = z.object({
    id_produto: z.number(),
    id_lote: z.number(),
    quantidade_retirada: z.number().min(1, "Retirar no mínimo um produto.")
});

export const shipmentSchema = z.object({
    motivo_saida: z.string(),
    produtos: z.array(shipmentProductSchema).min(1, "Saída deve conter no mínimo um produto.")
});

export type ShipmentSchema = z.infer<typeof shipmentSchema>;
export type ShipmentProductSchema = z.infer<typeof shipmentProductSchema>;