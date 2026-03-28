import { z } from 'zod';
import { createResponseSchema } from '#schemas';

export const categoryCreateSchema = z.object({
    name: z.string(),
});

export const categoryResponseSchema = createResponseSchema({
    name: z.string(),
});
