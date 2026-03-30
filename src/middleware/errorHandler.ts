import { type ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    process.env.NODE_ENV !== 'production' &&
        console.error(`\x1b[31m${err.stack}\x1b[0m`);
    if (err instanceof MongooseError.CastError) {
        res.status(400).json({ message: 'Invalid ID format' });
        return;
    }
    if (err instanceof MongoServerError && err.code === 11000) {
        res.status(409).json({ message: 'Ressource already exists' });
        return;
    }
    if (err instanceof Error) {
        if (err.cause) {
            const cause = err.cause as { status: number };
            res.status(cause.status).json({ message: err.message });
            return;
        }
        res.status(500).json({ message: err.message });
        return;
    }
    res.status(500).json({ message: 'Internal server error' });
    return;
};

export default errorHandler;
