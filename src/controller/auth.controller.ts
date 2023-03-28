import { Request, Response } from 'express';

const google = async (req: Request, res: Response) => {
    const user = req.user!;
    res.json({ user });
};

export default {
    googleAuth: google,
};
