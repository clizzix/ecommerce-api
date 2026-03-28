import { z } from 'zod';
export * from './categorySchema.ts';
export * from './orderSchema.ts';
export * from './productSchema.ts';
export * from './userSchema.ts';

export const createResponseSchema = <T extends z.ZodRawShape>(shape: T) => {
    return z
        .object(shape)
        .extend({
            _id: z.any(),
            __v: z.any().optional(),
            password: z.string().optional(),
        })
        .transform((data) => {
            const { _id, __v, password, ...rest } = data as Record<string, any>;
            return {
                ...rest,
                id: _id.toString() ?? '',
            };
        });
};

export const populatedField = z
    .union([z.string(), z.object({ _id: z.any() }).passthrough()])
    .transform((val) => {
        if (val && typeof val === 'object' && '_id' in val) {
            const { _id, password, __v, ...rest } = val;
            return {
                ...rest,
                id: _id.toString(),
            };
        }
        return val.toString();
    });
