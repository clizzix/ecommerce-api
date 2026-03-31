import { z } from 'zod';

export const createResponseSchema = <T extends z.ZodRawShape>(shape: T) => {
    return z
        .object(shape)
        .extend({
            _id: z.any(),
            password: z.string().optional(),
        })
        .transform((data) => {
            const { _id, password, ...rest } = data as Record<string, any>;
            return {
                ...rest,
                id: _id.toString() ?? '',
            };
        });
};

export const populatedField = z.preprocess((val) => {
    if (typeof val === 'string') return val;
    if (!val || typeof val !== 'object') return String(val ?? '');

    const obj = val as Record<string, any>;

    if (obj._bsontype === 'ObjectId') return obj.toString();
    if (typeof obj.toHexString === 'function') return obj.toHexString();

    if (obj._id !== undefined) {
        const { _id, password, ...rest } = obj;
        return { ...rest, id: String(_id) };
    }

    return val;
}, z.any());
