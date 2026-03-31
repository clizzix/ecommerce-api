import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { Types } from 'mongoose';
import type { OrderType } from '#types';
import { Order, Product } from '#models';
import { orderResponseSchema, type orderCreateSchema } from '#schemas';

type OrderInputDTO = z.infer<typeof orderCreateSchema>;
type OrderOutputDTO = z.infer<typeof orderResponseSchema>;
type IdParams = { id: string };

/**
 * @openapi
 * /api/orders:
 *  get:
 *      summary: Get all orders
 *      tags:
 *          - Orders
 *      responses:
 *          200:
 *              description: A list of all orders sorted by creation date (newest first), with userId and products populated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/OrderResponse'
 *  post:
 *      summary: Create a new order
 *      tags:
 *          - Orders
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateOrderInput'
 *      responses:
 *          201:
 *              description: Order created successfully, total is calculated server-side
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/OrderResponse'
 *          400:
 *              description: One or more products not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 * /api/orders/{id}:
 *  get:
 *      summary: Get an order by ID
 *      tags:
 *          - Orders
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the order
 *      responses:
 *          200:
 *              description: The requested order with userId and products populated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/OrderResponse'
 *          400:
 *              description: Order not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  put:
 *      summary: Update an order by ID
 *      tags:
 *          - Orders
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the order
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateOrderInput'
 *      responses:
 *          200:
 *              description: Order updated successfully, total is recalculated server-side
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/OrderResponse'
 *          400:
 *              description: Order not found or one or more products not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 *  delete:
 *      summary: Delete an order by ID
 *      tags:
 *          - Orders
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                type: string
 *            description: The MongoDB ObjectId of the order
 *      responses:
 *          200:
 *              description: Order deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteOrderResponse'
 *          404:
 *              description: Order not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ErrorResponse'
 */

export const getOrders: RequestHandler<unknown, OrderOutputDTO[]> = async (
    req,
    res,
    next,
) => {
    try {
        const orders = await Order.find()
            .populate('userId')
            .populate('products.productId')
            .sort({ createdAt: -1 })
            .lean();
        res.json(orderResponseSchema.array().parse(orders));
    } catch (error) {
        next(error);
    }
};

export const createOrder: RequestHandler<
    unknown,
    unknown,
    OrderInputDTO
> = async (req, res, next) => {
    try {
        const { userId, products } = req.body satisfies OrderInputDTO;

        const productIds = products.map((p) => p.productId);
        const allProducts = await Product.find({ _id: { $in: productIds } });

        if (allProducts.length !== productIds.length)
            return res
                .status(400)
                .json({ error: 'One or more products not found' });

        const total = products.reduce((sum, { productId, quantity }) => {
            const product = allProducts.find(
                (p) => p._id.toString() === productId,
            );
            return sum + product!.price * quantity;
        }, 0);

        const order = await Order.create({ userId, products, total });
        res.status(201).json(orderResponseSchema.parse(order));
    } catch (error: unknown) {
        next(error);
    }
};

export const getOrderById: RequestHandler<IdParams, OrderOutputDTO> = async (
    req,
    res,
    next,
) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId')
            .populate('products.productId')
            .lean();
        if (!order)
            throw new Error('No Order found', { cause: { status: 400 } });
        res.status(200).json(orderResponseSchema.parse(order));
    } catch (error: unknown) {
        next(error);
    }
};

export const updateOrder: RequestHandler<
    IdParams,
    OrderOutputDTO,
    OrderInputDTO
> = async (req, res, next) => {
    try {
        const { userId, products } = req.body satisfies OrderInputDTO;

        const productIds = products.map((p) => p.productId);
        const allProducts = await Product.find({ _id: { $in: productIds } });

        if (allProducts.length !== productIds.length)
            throw new Error('One or more products not found', {
                cause: { status: 400 },
            });

        const total = products.reduce((sum, { productId, quantity }) => {
            const product = allProducts.find(
                (p) => p._id.toString() === productId,
            );
            return sum + product!.price * quantity;
        }, 0);
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { userId, products, total },
            {
                new: true,
            },
        );
        if (!updated)
            throw new Error('Order not found', { cause: { status: 400 } });
        res.status(200).json(orderResponseSchema.parse(updated));
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteOrder: RequestHandler<
    IdParams,
    { message: string }
> = async (req, res, next) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);
        if (!deleted)
            throw new Error('Order not found', { cause: { status: 404 } });
        res.status(200).json({ message: 'Order deleted' });
    } catch (error: unknown) {
        next(error);
    }
};
