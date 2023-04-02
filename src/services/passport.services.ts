import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config';
import { IJwtToken, JwtToken } from '../utils/token.utils';

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.JWT_TOKEN.SECRET_KEY!,
            passReqToCallback: true,
        },
        async (req: Request, jwtToken: IJwtToken, next: Function) => {
            let data = JwtToken.process(jwtToken);
            next(data.error, data.user);
        }
    )
);

passport.use(
    'google',
    new GoogleStrategy(
        {
            clientID: config.GOOGLE.CLIENT_ID!,
            clientSecret: config.GOOGLE.CLIENT_SECRET!,
            callbackURL: config.GOOGLE.CALLBACK,
            passReqToCallback: true,
        },
        function verify(
            req: Request,
            accessToken: string,
            rf: string,
            tokens: any,
            profile: any,
            cb: Function
        ) {
            const user = {
                id: profile.id,
            };

            return cb(null, user);
        }
    )
);
