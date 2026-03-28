import { z } from 'zod';
import { createResponseSchema } from './helpers.ts';

export const userCreateSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
});

export const userResponseSchema = createResponseSchema({
    name: z.string(),
    email: z.email(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
