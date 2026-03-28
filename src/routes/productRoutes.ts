import { Router } from 'express';
import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
} from '#controllers';
import { productCreateSchema } from '#schemas';
import { validateBody } from '#middleware';

const productRoutes = Router();

productRoutes
    .route('/')
    .get(getProducts)
    .post(validateBody(productCreateSchema), createProduct);
productRoutes
    .route('/:id')
    .get(getProductById)
    .put(validateBody(productCreateSchema), updateProduct)
    .delete(deleteProduct);

export default productRoutes;
