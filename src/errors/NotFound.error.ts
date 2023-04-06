import errorTypes from './errorTypes';

import { ApplicationError } from './Application.error';

export class NotFound extends ApplicationError {
    constructor(message: errorTypes | string) {
        super(message, errorTypes.NOT_FOUND, 404);
    }
}
