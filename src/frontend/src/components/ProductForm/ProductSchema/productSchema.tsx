// productSchema.tsx
import { z } from 'zod';

export const productSchema = z.object({
    product_name: z.string().min(1, "Product name is required"),
    batch: z.string().min(1, "Batch is required"),
    description: z.string().optional(),
    brand: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1").positive(),
    price: z.number().min(1, "Price must be at least 1").positive(),
    retail_price: z.number().min(1, "Retail price must be at least 1").positive(),
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