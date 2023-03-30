import errorTypes from './errorTypes';

import { ApplicationError } from './Application.error';

export class UnAuthorizedError extends ApplicationError {
    constructor(message: errorTypes | string) {
        super(401, message);
    }
}
