import { NextFunction, Request, Response } from 'express';
import { IRequest } from '../interface/request.interface';
import { ConnectionsUser } from '../models/connections.user.model';
import { DirectMessages } from '../models/direct.messages.model';
import { ApplicationError } from '../errors';

const getProfile = (req: IRequest, res: Response) => {
    res.send(req.JWT_USER);
};

export default {
    getProfile,
};
