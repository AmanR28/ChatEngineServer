import { Request, Response } from 'express';
import { IRequest } from '../interface/request.interface';

const userInfo = (req: IRequest, res: Response) => {
    res.send(req.JWT_USER);
};

export default {
    userInfo,
};
