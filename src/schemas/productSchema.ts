import { z } from 'zod';
import { createResponseSchema, populatedField } from './helpers.ts';

/**
 * @openapi
 * components:
 *  schemas:
 *      CreateProductInput:
 *          type: object
 *          required:
 *              - name
 *              - description
 *              - price
 *              - categoryId
 *          properties:
 *              name:
 *                  type: string
 *                  minLength: 1
 *                  example: "Wireless Headphones"
 *                  description: The name of the product
 *              description:
 *                  type: string
 *                  minLength: 5
 *                  example: "Over-ear noise cancelling headphones"
 *                  description: A short description of the product
 *              price:
 *                  type: number
 *                  minimum: 0
 *                  example: 49.99
 *                  description: Price of the product in the store currency
 *              categoryId:
 *                  type: string
 *                  example: "60c72b2f9b1d8c001c8e4f3a"
 *                  description: The MongoDB ObjectId of the product's category
 */

export const productCreateSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(5, 'Description is too short'),
    price: z.number().min(0, 'Price cannot be negative'),
    categoryId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID format'),
});

/**
 * @openapi
 * components:
 *  schemas:
 *      ProductResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "60c72b2f9b1d8c001c8e4f3a"
 *                  description: The unique MongoDB identifier of the product
 *              name:
 *                  type: string
 *                  example: "Wireless Headphones"
 *                  description: The name of the product
 *              description:
 *                  type: string
 *                  example: "Over-ear noise cancelling headphones"
 *                  description: A short description of the product
 *              price:
 *                  type: number
 *                  example: 49.99
 *                  description: Price of the product
 *              categoryId:
 *                  oneOf:
 *                      - type: string
 *                        example: "60c72b2f9b1d8c001c8e4f3a"
 *                      - $ref: '#/components/schemas/CategoryResponse'
 *                  description: The category reference (ID string or populated category object)
 *      DeleteProductResponse:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: "Product deleted"
 */

export const productResponseSchema = createResponseSchema({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    categoryId: populatedField,
});
