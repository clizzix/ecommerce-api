import { Router } from 'express';
import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from '#controllers';
import { userCreateSchema } from '#schemas';
import { validateBody } from '#middleware';

const userRoutes = Router();

userRoutes
    .route('/')
    .get(getUsers)
    .post(validateBody(userCreateSchema), createUser);
userRoutes
    .route('/:id')
    .get(getUserById)
    .put(validateBody(userCreateSchema), updateUser)
    .delete(deleteUser);

export default userRoutes;
