import { Request, Response, NextFunction } from 'express';
import { ApplicationError, ErrorTypes, UnAuthorizedError } from '../errors';
import { IRequest } from '../interface/request.interface';
import { UserConnections } from '../models/connections.user.model';
import { UserProfile } from '../models/profile.user.model';

const isAuth = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        console.log('Auth User', req.JWT_USER);
        if (req.JWT_ERROR) throw req.JWT_ERROR;
        if (!req.JWT_USER) throw new Error('User Not Here');

        req.JWT_USER.connId = await UserConnections.getOrCreateId(req.JWT_USER.id);
        req.JWT_USER.profileId = await UserProfile.getOrCreateId(req.JWT_USER.id);

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
