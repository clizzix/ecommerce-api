import type { RequestHandler } from 'express';

const notFoundHandler: RequestHandler = (req, res, next) => {
    next(new Error('Not found', { cause: { status: 404 } }));
};

export default notFoundHandler;
