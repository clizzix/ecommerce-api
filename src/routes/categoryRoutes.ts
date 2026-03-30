import { Router } from 'express';
import {
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '#controllers';
import { categoryCreateSchema } from '#schemas';
import { validateBody } from '#middleware';

const categoryRoutes = Router();

categoryRoutes
    .route('/')
    .get(getCategories)
    .post(validateBody(categoryCreateSchema), createCategory);
categoryRoutes
    .route('/:id')
    .get(getCategoryById)
    .put(validateBody(categoryCreateSchema), updateCategory)
    .delete(deleteCategory);

export default categoryRoutes;
