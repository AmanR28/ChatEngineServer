import { Request, Response } from 'express';
import { GoogleAuth, IGoogleAuth } from '../models/google.auth.model';
import { JwtToken, TokenType } from '../utils/token.utils';

const googleAuth = async (req: Request, res: Response) => {
    const googleUser = req.user as { id: string };
    const googleId = googleUser.id;

    const user: IGoogleAuth = await GoogleAuth.getOrCreate(googleId);

    res.send({
        token: JwtToken.create(TokenType.AUTH, user.userId),
        user: user,
    });
};

export default {
    googleAuth,
};
