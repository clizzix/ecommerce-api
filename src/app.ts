import '#db';
import express from 'express';
import cors from 'cors';
import { userRoutes, productRoutes } from '#routes';
import { errorHandler, notFoundHandler } from '#middleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    }),
);

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(port, () =>
    console.log(
        `\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`,
    ),
);
