import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { ErrorTypes, UnAuthorizedError } from '../errors';
import { IUser } from '../interface/user.interface';

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return next();

    try {
        await passport.authenticate('jwt', (user: IUser) => {
            req.user = user;
        })(req, res, next);
    } catch (error) {
        if (error instanceof UnAuthorizedError) {
            res.status(error.statusCode).send(error.getError());
        }

        console.error(error);
        res.status(500).send('error');
    }

    next();
};

export default currentUser;
