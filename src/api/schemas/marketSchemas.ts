import { z } from 'zod';

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    rating: z.number(),
    category: z.enum(['supplies', 'electronics', 'apparel']),
    image: z.string().url(),
});

export const cartItemSchema = z.object({
    product: productSchema,
    quantity: z.number().min(1),
});