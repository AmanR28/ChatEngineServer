import { Request, Response } from 'express';
import { IRequest } from '../interface/request.interface';
import { ConnectionsUser } from '../models/connections.user.model';

const getProfile = (req: IRequest, res: Response) => {
    res.send(req.JWT_USER);
};

const getConnections = async (req: IRequest, res: Response) => {
    let userId = req.JWT_USER!.id!;
    let conn = await ConnectionsUser.getOrCreate(userId);
    res.send(conn);
};

const getUpdates = async (req: IRequest, res: Response) => {
    let userId = req.JWT_USER!.id!;
    let updates = await ConnectionsUser.findOne({ userId }, { updatedAt: 1 });
    console.log(updates);
    res.send(updates);
};

export default {
    getProfile,
    getConnections,
    getUpdates,
};
