import { ErrorTypes, UnAuthorizedError } from '../errors';
import { IRequest, Response, NextFunction } from '../interface/request.interface';
import { UserProfile } from '../models/profile.user.model';
import { JwtToken, TokenType } from '../utils/token.utils';

const isBot = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnAuthorizedError(ErrorTypes.TOKEN_UNAVAILABLE);

        let { error, payload } = JwtToken.process(token);

        if (error) throw error;

        console.log(payload);

        if (payload.type != TokenType.BOT) throw new UnAuthorizedError(ErrorTypes.TOKEN_INVALID);

        req.JWT_BOT = payload.id;
        next();
    } catch (error) {
        next(error);
    }
};

export default isBot;
