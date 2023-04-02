import errorTypes from './errorTypes';

export class ApplicationError extends Error {
    public statusCode: number;
    public message: string;
    public status: string;

    constructor(message: errorTypes | string, status: errorTypes, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    }
}
