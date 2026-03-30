import { Router } from 'express';
import {
    getOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
} from '#controllers';
import { orderCreateSchema } from '#schemas';
import { validateBody } from '#middleware';

const orderRoutes = Router();

orderRoutes
    .route('/')
    .get(getOrders)
    .post(validateBody(orderCreateSchema), createOrder);
orderRoutes
    .route('/:id')
    .get(getOrderById)
    .put(validateBody(orderCreateSchema), updateOrder)
    .delete(deleteOrder);

export default orderRoutes;
