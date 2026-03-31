import type { RequestHandler } from 'express';
import type { ProductType } from '#types';
import { Product, Category } from '#models';
import type { z } from 'zod';
import { productCreateSchema, productResponseSchema } from '#schemas';

type ProductInputDTO = z.infer<typeof productCreateSchema>;
type ProductOutputDTO = z.infer<typeof productResponseSchema>;
type IdParams = { id: string };

/**
 * @openapi
 * /api/products:
 *  get:
 *      summary: Get all products
 *      tags:
 *          - Products
 *      responses:
 *          200:
 *              description: A list of all products sorted by creation date (newest first)
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/ProductResponse'
 *  post:
 *      summary: Create a new product
 *      tags:
 *          - Products
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateProductInput'
 *      responses:
 *          201:
 *              description: Product created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProductResponse'
 *          400:
 *              description: Missing required fields, product already exists, or category not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the product
 *      responses:
 *          200:
 *              description: The requested product
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProductResponse'
 *          400:
 *              description: Product not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  put:
 *      summary: Update a product by ID
 *      tags:
 *          - Products
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the product
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateProductInput'
 *      responses:
 *          200:
 *              description: Product updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProductResponse'
 *          400:
 *              description: Product or category not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  delete:
 *      summary: Delete a product by ID
 *      tags:
 *          - Products
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the product
 *      responses:
 *          200:
 *              description: Product deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteProductResponse'
 *          404:
 *              description: Product not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

export const getProducts: RequestHandler<unknown, ProductOutputDTO[]> = async (
    _req,
    res,
    next,
) => {
    try {
        const products = await Product.find().lean().sort({ createdAt: -1 });
        res.json(productResponseSchema.array().parse(products));
    } catch (error: unknown) {
        next(error);
    }
};

export const createProduct: RequestHandler<
    unknown,
    unknown,
    ProductInputDTO
> = async (req, res, next) => {
    try {
        const { name, description, price, categoryId } =
            req.body as ProductType;
        if (!name || !description || !price || !categoryId)
            return res.status(400).json({
                error: 'Name, description, price and category are required',
            });
        const found = await Product.findOne({ name });
        if (found)
            return res.status(400).json({ error: 'Product allready exists' });
        const category = await Category.findById(categoryId);
        if (!category)
            return res.status(400).json({ error: 'Category does not exist' });
        const product = await Product.create(
            req.body satisfies ProductInputDTO,
        );
        res.status(201).json(productResponseSchema.parse(product.toObject()));
    } catch (error: unknown) {
        next(error);
    }
};

export const getProductById: RequestHandler<
    IdParams,
    ProductOutputDTO
> = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product)
            throw new Error('Product not found', { cause: { status: 400 } });
        res.status(200).json(productResponseSchema.parse(product));
    } catch (error: unknown) {
        next(error);
    }
};

export const updateProduct: RequestHandler<
    IdParams,
    ProductOutputDTO,
    ProductInputDTO
> = async (req, res, next) => {
    try {
        const categoryExists = await Category.exists({
            _id: req.body.categoryId,
        });
        if (!categoryExists)
            throw new Error('Category not found', { cause: { status: 400 } });
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' },
        );
        if (!updated)
            throw new Error('Product not found', { cause: { status: 400 } });
        res.status(200).json(productResponseSchema.parse(updated.toObject()));
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteProduct: RequestHandler<
    IdParams,
    { message: string }
> = async (req, res, next) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted)
            throw new Error('Product not found', { cause: { status: 404 } });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {}
};
