import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { ApplicationError, ErrorTypes, UnAuthorizedError } from '../errors';
import { IUser } from '../interface/user.interface';
import { IRequest } from '../interface/request.interface';

const isAuth = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        if (req.JWT_ERROR) throw req.JWT_ERROR;
        if (!req.JWT_USER) throw new Error('User Not Here');
        next();
    } catch (error) {
        if (req.JWT_ERROR instanceof UnAuthorizedError) {
            next(error);
        } else {
            console.log(error);
            next(new Error('SYSTEM FAILURE'));
        }
    }
};

export default isAuth;
