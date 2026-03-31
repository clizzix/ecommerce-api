import '#db';
import express from 'express';
import cors from 'cors';
import {
    userRoutes,
    productRoutes,
    categoryRoutes,
    orderRoutes,
    docsRoutes,
} from '#routes';
import { errorHandler, notFoundHandler } from '#middleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    }),
);

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/docs', docsRoutes);
app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log(
        `\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`,
    );
    console.log(
        `\x1b[36mOpenAPI JSON served at  http://localhost:${port}/api/docs/openapi.json\x1b[0m`,
    );
    console.log(
        `\x1b[33mSwagger UI served at http://localhost:${port}/api/docs\x1b[0m`,
    );
});
