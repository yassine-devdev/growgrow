import { ErrorRequestHandler } from 'express';
import logger from '../../utils/logger';

interface AppError extends Error {
    statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const appErr = err as AppError;
    logger.error(appErr.stack || appErr.message);

    const statusCode = appErr.statusCode || 500;
    const message = appErr.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
