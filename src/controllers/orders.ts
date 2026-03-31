import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { Types } from 'mongoose';
import type { OrderType } from '#types';
import { Order, Product } from '#models';
import { orderResponseSchema, type orderCreateSchema } from '#schemas';

type OrderInputDTO = z.infer<typeof orderCreateSchema>;
type OrderOutputDTO = z.infer<typeof orderResponseSchema>;
type IdParams = { id: string };

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
