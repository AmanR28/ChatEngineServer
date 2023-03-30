import { Request, Response } from 'express';

const userInfo = (req: Request, res: Response) => {
    res.send(req.user);
};

export default {
    userInfo,
};
