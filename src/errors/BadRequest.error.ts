import errorTypes from './errorTypes';

import { ApplicationError } from './Application.error';

export class BadRequest extends ApplicationError {
    constructor(message: errorTypes | string) {
        super(message, errorTypes.BAD_REQUEST, 401);
    }
}
