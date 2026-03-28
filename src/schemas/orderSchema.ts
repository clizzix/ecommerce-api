import { z } from 'zod';
import { createResponseSchema, populatedField } from './helpers.ts';

export const orderCreateSchema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format'),
    products: z
        .array(
            z.object({
                productId: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
                quantity: z
                    .number()
                    .int()
                    .min(1, 'Quantity needs to be at least 1'),
            }),
        )
        .min(1, 'Order must contain at least one product'),
    total: z.number().min(0, 'Total cannot be negative'),
});

export const orderResponseSchema = createResponseSchema({
    userId: populatedField,
    products: z.array(
        z.object({
            productId: populatedField,
            quantity: z.number(),
        }),
    ),
    total: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
