import { z } from 'zod';
import { createResponseSchema } from './helpers.ts';

export const categoryCreateSchema = z.object({
    name: z.string(),
});

export const categoryResponseSchema = createResponseSchema({
    name: z.string(),
});
