import { ApplicationError, ErrorTypes, UnAuthorizedError } from '../errors';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../interface/user.interface';

export enum TokenType {
    AUTH = 'AUTH',
}

export interface IJwtToken {
    expiry: string;
    type: string;
    id: string;
}

export const JwtToken = {
    // Create Token
    create: (type: TokenType, id: string) => {
        const payload = {
            id,
            type,
            expiry: new Date(Date.now() + config.JWT_TOKEN.EXPIRE_TIME),
        };
        let token = jwt.sign(payload, config.JWT_TOKEN.SECRET_KEY!);
        return token;
    },

    process: (token: string): { error: ApplicationError | null; user?: IUser | null } => {
        let jwtToken = jwt.verify(token, config.JWT_TOKEN.SECRET_KEY!) as IJwtToken;
        if (!jwtToken.expiry || new Date(jwtToken.expiry).getTime() < Date.now())
            return { error: new UnAuthorizedError(ErrorTypes.TOKEN_EXPIRED) };

        if (jwtToken.type !== TokenType.AUTH)
            return { error: new UnAuthorizedError(ErrorTypes.TOKEN_EXPIRED) };

        const user: IUser = {
            id: jwtToken.id,
        };

        return { error: null, user };
    },
};
