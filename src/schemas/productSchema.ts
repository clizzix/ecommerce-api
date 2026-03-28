import { z } from 'zod';
import { createResponseSchema, populatedField } from './helpers.ts';

export const productCreateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(5, 'Description is too short'),
    price: z.number().min(0, 'Price cannot be negative'),
    categoryId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID format'),
});

export const productResponseSchema = createResponseSchema({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    categoryId: populatedField,
});
