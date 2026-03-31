import type { RequestHandler } from 'express';
import type { CategoryType } from '#types';
import { Category } from '#models';
import type { z } from 'zod';
import { Types } from 'mongoose';
import type { categoryCreateSchema } from '#schemas';

type CategoryInputDTO = z.infer<typeof categoryCreateSchema>;
type CategoryOutputDTO = CategoryInputDTO & {
    _id: Types.ObjectId;
};
type IdParams = { id: string };

/**
 * @openapi
 * /api/categories:
 *  get:
 *      summary: Get all categories
 *      tags:
 *          - Categories
 *      responses:
 *          200:
 *              description: A list of all categories
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/CategoryResponse'
 *  post:
 *      summary: Create a new category
 *      tags:
 *          - Categories
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateCategoryInput'
 *      responses:
 *          201:
 *              description: Category created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CategoryResponse'
 *          400:
 *              description: Category name is missing or already exists
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 * /api/categories/{id}:
 *  get:
 *      summary: Get a category by ID
 *      tags:
 *          - Categories
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the category
 *      responses:
 *          200:
 *              description: The requested category
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CategoryResponse'
 *          400:
 *              description: Category not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  put:
 *      summary: Update a category by ID
 *      tags:
 *          - Categories
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the category
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateCategoryInput'
 *      responses:
 *          200:
 *              description: Category updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CategoryResponse'
 *          400:
 *              description: Category not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  delete:
 *      summary: Delete a category by ID
 *      tags:
 *          - Categories
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the category
 *      responses:
 *          200:
 *              description: Category deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteCategoryResponse'
 *          404:
 *              description: Category not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

export const getCategories: RequestHandler<
    unknown,
    CategoryOutputDTO[]
> = async (req, res, next) => {
    try {
        const categories = await Category.find().lean();
        res.json(categories);
    } catch (error: unknown) {
        next(error);
    }
};

export const createCategory: RequestHandler<
    unknown,
    unknown,
    CategoryInputDTO
> = async (req, res, next) => {
    try {
        const { name } = req.body as CategoryType;
        if (!name)
            return res.status(400).json({ error: 'Category name is required' });
        const found = await Category.findOne({ name });
        if (found)
            return res.status(400).json({ error: 'Category already exists' });
        const category = await Category.create(
            req.body satisfies CategoryInputDTO,
        );
        res.status(201).json(category);
    } catch (error: unknown) {
        next(error);
    }
};

export const getCategoryById: RequestHandler<
    IdParams,
    CategoryInputDTO
> = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category)
            throw new Error('Category not found', { cause: { status: 400 } });
        res.status(200).json(category);
    } catch (error: unknown) {
        next(error);
    }
};

export const updateCategory: RequestHandler<
    IdParams,
    CategoryOutputDTO,
    CategoryInputDTO
> = async (req, res, next) => {
    try {
        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!updated)
            throw new Error('Category not found', { cause: { status: 400 } });
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory: RequestHandler<
    IdParams,
    { message: string }
> = async (req, res, next) => {
    try {
        const deleted = await Category.findByIdAndDelete(req.params.id);
        if (!deleted)
            throw new Error('Category not found', { cause: { status: 404 } });
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        next(error);
    }
};
