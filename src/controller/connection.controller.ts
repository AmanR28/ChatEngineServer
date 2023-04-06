import { NextFunction, Request, Response } from 'express';
import { IRequest } from '../interface/request.interface';
import { UserConnections } from '../models/connections.user.model';
import { DirectMessages } from '../models/direct.messages.model';
import { ApplicationError } from '../errors';

const getConnections = async (req: IRequest, res: Response) => {
    let userId = req.JWT_USER!.id!;
    let conns = await UserConnections.getOrCreate(userId);

    return res.send(conns);
};

const getConnection = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let user = req.JWT_USER!;

        let connUserId = req.body.userId;

        if (!connUserId) throw new Error('MISSING FIELD');

        let userId1, userId2;
        if (user.id < connUserId) {
            userId1 = user.id;
            userId2 = connUserId;
        } else {
            userId1 = connUserId;
            userId2 = user.id;
        }

        let connId = await user.connections!.getConnection(connUserId);
        if (!connId) {
            console.log('not');
            connId = await DirectMessages.getOrCreate(userId1, userId2);
            await UserConnections.updateOne(
                { userId: user.id },
                { $set: { [`connections.${connUserId}`]: connId } }
            );
        }

        res.send(connId);
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('getConnection', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const getUpdates = async (req: IRequest, res: Response) => {
    let userId = req.JWT_USER!.id!;
    let updates = await UserConnections.findOne({ userId }, { updatedAt: 1 });
    if (!updates) {
        return res.send('Connections Doest Exist');
    }
    res.send(updates);
};

export default {
    getConnections,
    getConnection,
    getUpdates,
};
