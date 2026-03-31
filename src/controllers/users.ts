import type { RequestHandler } from 'express';
import type { UserType } from '#types';
import { User } from '#models';
import type { z } from 'zod';
import { Types } from 'mongoose';
import type { userCreateSchema } from '#schemas';

type UserInputDTO = z.infer<typeof userCreateSchema>;
type UserOutDTO = UserInputDTO & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};
type IdParams = { id: string };

/**
 * @openapi
 * /api/users:
 *  get:
 *      summary: Get all users
 *      tags:
 *          - Users
 *      responses:
 *          200:
 *              description: A list of all users sorted by creation date (newest first)
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/UserResponse'
 *  post:
 *      summary: Create a new user
 *      tags:
 *          - Users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          201:
 *              description: User created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserResponse'
 *          400:
 *              description: Missing required fields or email already in use
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 * /api/users/{id}:
 *  get:
 *      summary: Get a user by ID
 *      tags:
 *          - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the user
 *      responses:
 *          200:
 *              description: The requested user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserResponse'
 *          400:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  put:
 *      summary: Update a user by ID
 *      tags:
 *          - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          200:
 *              description: User updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserResponse'
 *          400:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  delete:
 *      summary: Delete a user by ID
 *      tags:
 *          - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the user
 *      responses:
 *          200:
 *              description: User deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteUserResponse'
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

export const getUsers: RequestHandler<unknown, UserOutDTO[]> = async (
    _req,
    res,
    next,
) => {
    try {
        const users = await User.find().lean().sort({ createdAt: -1 });
        res.json(users);
    } catch (error: unknown) {
        next(error);
    }
};

export const createUser: RequestHandler<
    unknown,
    unknown,
    UserInputDTO
> = async (req, res, next) => {
    try {
        const { name, email, password } = req.body as UserType;
        if (!name || !email || !password)
            return res
                .status(400)
                .json({ error: 'Name, email and password are required' });
        const found = await User.findOne({ email });
        if (found)
            return res.status(400).json({ error: 'User already exists' });
        const user = await User.create(req.body satisfies UserInputDTO);
        res.status(201).json(user);
    } catch (error: unknown) {
        next(error);
    }
};

export const getUserById: RequestHandler<IdParams, UserInputDTO> = async (
    req,
    res,
    next,
) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            throw new Error('User not found', { cause: { status: 400 } });
        res.status(200).json(user);
    } catch (error: unknown) {
        next(error);
    }
};

export const updateUser: RequestHandler<
    IdParams,
    UserOutDTO,
    UserInputDTO
> = async (req, res, next) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated)
            throw new Error('User not found', { cause: { status: 400 } });
        res.status(200).json(updated);
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteUser: RequestHandler<IdParams, { message: string }> = async (
    req,
    res,
    next,
) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted)
            throw new Error('User not found', { cause: { status: 404 } });
        res.status(200).json({ message: 'User deleted' });
    } catch (error: unknown) {
        next(error);
    }
};
