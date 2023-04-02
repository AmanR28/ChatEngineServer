import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { ApplicationError, ErrorTypes, UnAuthorizedError } from '../errors';
import { IUser } from '../interface/user.interface';
import { IRequest } from '../interface/request.interface';

const currentUser = (req: IRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) req.JWT_ERROR = new UnAuthorizedError(ErrorTypes.TOKEN_UNAVALIABLE);

    passport.authenticate('jwt', (error: ApplicationError, user: IUser) => {
        if (error) req.JWT_ERROR = error;
        else req.JWT_USER = user;
    })(req, res, next);

    next();
};

export default currentUser;
