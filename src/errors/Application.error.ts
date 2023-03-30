import errorTypes from './errorTypes';

export class ApplicationError extends Error {
    public statusCode: number;
    public message: string;

    constructor(statusCode: number, message: errorTypes | string) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.message = message;
    }

    public getError() {
        return {
            name: this.name,
            message: this.message,
        };
    }
}
