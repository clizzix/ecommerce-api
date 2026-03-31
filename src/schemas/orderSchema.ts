import { z } from 'zod';
import { createResponseSchema, populatedField } from './helpers.ts';

/**
 * @openapi
 * components:
 *  schemas:
 *      CreateOrderInput:
 *          type: object
 *          required:
 *              - userId
 *              - products
 *          properties:
 *              userId:
 *                  type: string
 *                  example: "60c72b2f9b1d8c001c8e4f3a"
 *                  description: The unique MongoDB identifier for the User
 *              products:
 *                  type: array
 *                  minItems: 1
 *                  description: List of products of the order
 *                  items:
 *                      type: object
 *                      required:
 *                          - productId
 *                          - quantity
 *                      properties:
 *                          productId:
 *                              type: string
 *                              example: "60c72b2f9b1d8c001c8e4f3a"
 *                              description: The products unique Id
 *                          quantity:
 *                              type: integer
 *                              minimum: 1
 *                              description: Number of Products
 *                              example: 2
 *
 */

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
});

/**
 * @openapi
 * components:
 *  schemas:
 *      OrderResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "60c72b2f9b1d8c001c8e4f3a"
 *                  description: The unique MongoDB identifier of the order
 *              userId:
 *                  oneOf:
 *                      - type: string
 *                        example: "60c72b2f9b1d8c001c8e4f3a"
 *                      - $ref: '#/components/schemas/UserResponse'
 *                  description: The user reference (ID string or populated user object)
 *              products:
 *                  type: array
 *                  description: List of products in the order
 *                  items:
 *                      type: object
 *                      properties:
 *                          productId:
 *                              oneOf:
 *                                  - type: string
 *                                    example: "60c72b2f9b1d8c001c8e4f3a"
 *                                  - $ref: '#/components/schemas/ProductResponse'
 *                              description: The product reference (ID string or populated product object)
 *                          quantity:
 *                              type: integer
 *                              minimum: 1
 *                              example: 2
 *                              description: Number of units ordered
 *              total:
 *                  type: number
 *                  example: 99.98
 *                  description: Total price calculated from all products and quantities
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  example: "2024-01-15T10:30:00.000Z"
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  example: "2024-01-15T10:30:00.000Z"
 *      DeleteOrderResponse:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: "Order deleted"
 */
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
