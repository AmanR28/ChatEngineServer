import { Request, Response } from 'express';
import { GoogleAuth, IGoogleAuth } from '../models/google.auth.model';

const googleAuth = async (req: Request, res: Response) => {
    const googleUser = req.user as { id: string };
    const googleId = googleUser.id;

    const user: IGoogleAuth =
        (await GoogleAuth.findOne({ googleId })) ||
        (await GoogleAuth.createWithGoogleId(googleId));

    res.send(user);
};

export default {
    googleAuth,
};
