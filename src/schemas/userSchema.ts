import { z } from 'zod';
import { createResponseSchema } from './helpers.ts';

/**
 * @openapi
 * components:
 *  schemas:
 *      CreateUserInput:
 *          type: object
 *          required:
 *              - name
 *              - email
 *              - password
 *          properties:
 *              name:
 *                  type: string
 *                  minLength: 2
 *                  example: "Jane Doe"
 *                  description: The user's full name
 *              email:
 *                  type: string
 *                  format: email
 *                  example: "jane@example.com"
 *                  description: The user's email address
 *              password:
 *                  type: string
 *                  minLength: 8
 *                  example: "s3cr3tPass"
 *                  description: The user's password
 */

export const userCreateSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
});

/**
 * @openapi
 * components:
 *  schemas:
 *      UserResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "60c72b2f9b1d8c001c8e4f3a"
 *                  description: The unique MongoDB identifier of the user
 *              name:
 *                  type: string
 *                  example: "Jane Doe"
 *                  description: The user's full name
 *              email:
 *                  type: string
 *                  format: email
 *                  example: "jane@example.com"
 *                  description: The user's email address
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  example: "2024-01-15T10:30:00.000Z"
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  example: "2024-01-15T10:30:00.000Z"
 *      DeleteUserResponse:
 *          type: object
 *          properties:
 *              message:
 *                  type: string
 *                  example: "User deleted"
 */

export const userResponseSchema = createResponseSchema({
    name: z.string(),
    email: z.email(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
