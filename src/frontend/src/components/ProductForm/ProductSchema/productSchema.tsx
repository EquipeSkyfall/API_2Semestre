// productSchema.tsx
import { z } from 'zod';

export const productSchema = z.object({
    product_name: z.string().min(1, "O nome do Produto é obrigatório"),
    batch: z.string().min(1, "O lote é obrigatório"),
    description: z.string().optional(),
    brand: z.string(),
    quantity: z.number().min(1, "Quantidade deve ter pelo menos 1").positive(),
    price: z.number().min(1, "Preço deve ter pelo menos 1").positive(),
    retail_price: z.number().min(1, "Preço de Venda deve ter pelo menos 1").positive(),
    stock_location: z.string().optional().nullable(),
    id_category: z.preprocess(
        (value) => (value === undefined ? undefined : Number(value)),
        z.number().optional()
    ),
    id_sector: z.preprocess(
        (value) => (value === undefined ? undefined : Number(value)),
        z.number().optional()
    ),
    url_image: z.string().optional().nullable(),
    weight: z.preprocess(
        (value) => (value === undefined ? undefined : Number(value)),
        z.number().optional()
    ),
    height: z.preprocess(
        (value) => (value === undefined ? undefined : Number(value)),
        z.number().positive().optional()
    ),
    width: z.preprocess(
        (value) => (value === undefined? undefined : Number(value)),
        z.number().positive().optional()
    ),
});

// Type inferred from the schema
export type ProductSchema = z.infer<typeof productSchema>;