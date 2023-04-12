import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '../errors';

export default (err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({
            state: 'Failure',
            status: err.status,
            statusCode: err.statusCode,
            message: err.message,
        });
    }
};
