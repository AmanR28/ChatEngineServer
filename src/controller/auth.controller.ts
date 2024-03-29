import { Request, Response } from 'express';
import { AuthGoogle } from '../models/google.auth.model';
import { JwtToken, TokenType } from '../utils/token.utils';
import { UserProfile } from '../models/profile.user.model';
import { IRequest } from '../interface/request.interface';
import { passportGoogle } from '../interface/google.passport.interface';
import config from '../config';

const validate = async (req: IRequest, res: Response) => {
    res.send(req.JWT_USER);
};

const googleAuth = async (req: Request, res: Response) => {
    const user = req.user as passportGoogle;

    const userAuth = await AuthGoogle.findOne({ googleId: user.googleId });

    let userId: string = userAuth ? userAuth.userId : '';

    if (!userAuth) {
        userId = user.name.split(' ')[0] + user.googleId.slice(-3);
        await UserProfile.create({
            userId: userId,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        });
        await AuthGoogle.create({
            googleId: user.googleId,
            userId: userId,
        });
    } else {
        await UserProfile.updateOne({ userId }, { $set: { lastSeen: new Date() } });
    }

    // return res.send({
    //     token: JwtToken.create(TokenType.AUTH, userId),
    // });
    let redirectPath =
        config.WEB_URL +
        'token?token=' +
        JwtToken.create(TokenType.AUTH, userId) +
        '&userId=' +
        userId +
        '&name=' +
        user.name +
        '&avatar=' +
        user.avatar;
    res.redirect(redirectPath);
};

export default {
    validate,
    googleAuth,
};
