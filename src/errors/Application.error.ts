import errorTypes from './errorTypes';

import debug from 'debug';
const DEBUG = debug('dev');

export class ApplicationError extends Error {
    public statusCode: number;
    public message: string;
    public status: string;

    constructor(message: errorTypes | string, status: errorTypes, statusCode: number) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    }
}
