import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config';

interface JwtToken {
    expiry: string;
    type: string;
    id: number;
}

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.JWT_TOKEN.SECRET_KEY!,
            passReqToCallback: true,
        },
        async (req: Request, jwtToken: JwtToken, next: Function) => {
            if (!jwtToken.expiry || new Date(jwtToken.expiry).getTime() < Date.now()) {
                return next('TOKEN_EXPIRED');
            }

            if (jwtToken.type !== 'TYPE_AUTH') {
                return next('INVALID_TOKEN');
            }

            const user = 'Hi';

            if (!user) {
                return next('INVALID_TOKEN');
            }

            return next(undefined, user);
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
        function verify(req: Request, accessToken: string, rf: string, tokens: any, profile: any, cb: Function) {
            const user = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            };
            return cb(null, user);
        }
    )
);
