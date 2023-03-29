import errorConstants from '../constants/error.constant';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IGoogleAuth, GoogleAuth } from '../models/google.auth.model';
import { IUser } from '../interface/user.interface';
import { IResult } from '../interface/result.interface';

export enum TokenType {
    AUTH = 'AUTH',
}

export interface IJwtToken {
    expiry: string;
    type: string;
    id: number;
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

    // Process Token
    process: (jwtToken: IJwtToken): IResult<IUser> => {
        if (!jwtToken.expiry || new Date(jwtToken.expiry).getTime() < Date.now()) {
            return { result: errorConstants.TOKEN_EXPIRED };
        }

        if (jwtToken.type !== 'TYPE_AUTH') {
            return { result: errorConstants.TOKEN_INVALID };
        }

        const user: IUser = {
            id: jwtToken.id,
        };

        return { result: null, data: user };
    },
};
