import passport from 'passport';
import { Request } from '../interface/request.interface';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../config';
import { passportGoogle } from '../interface/google.passport.interface';

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
            console.log(profile);
            const user: passportGoogle = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
            };

            return cb(null, user);
        }
    )
);
