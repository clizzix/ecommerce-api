import { z } from 'zod';
import { createResponseSchema } from './helpers.ts';

/**
 * @openapi
 * components:
 *  schemas:
 *      CreateCategoryInput:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  example: "Electronics"
 *                  description: The name of the product category
 */

export const categoryCreateSchema = z.object({
    name: z.string(),
});

/**
 * @openapi
 * components:
 *  schemas:
 *      CategoryResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "60c72b2f9b1d8c001c8e4f3a"
 *                  description: The unique MongoDB identifier of the category
 *              name:
 *                  type: string
 *                  example: "Electronics"
 *                  description: Name of the category
 *      DeleteCategoryResponse:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: "Category deleted"
 *      ErrorResponse:
 *          type: object
 *          properties:
 *              error:
 *                  type: string
 *                  example: "Category not found"
 */

export const categoryResponseSchema = createResponseSchema({
    name: z.string(),
});
