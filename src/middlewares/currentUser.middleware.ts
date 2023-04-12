import { ErrorTypes, UnAuthorizedError } from '../errors';
import { IRequest, Response, NextFunction } from '../interface/request.interface';
import { UserProfile } from '../models/profile.user.model';
import { JwtToken } from '../utils/token.utils';

const currentUser = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            req.JWT_ERROR = new UnAuthorizedError(ErrorTypes.TOKEN_UNAVAILABLE);
            return next();
        }

        let payload = JwtToken.process(token);

        if (payload.error) req.JWT_ERROR = payload.error;
        else {
            req.JWT_USER = payload.user;
            await UserProfile.updateOne(
                { userId: req.JWT_USER?.id },
                { $set: { lastSeen: new Date() } }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};

export default currentUser;
