import passport from 'passport';
import { Router } from 'express';
import authController from '../controller/auth.controller';

const router = Router();

router.get(
    '/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
    }),
    authController.googleAuth
);

export default router;
