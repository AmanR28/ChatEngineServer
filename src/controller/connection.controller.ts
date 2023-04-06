import { NextFunction, Request, Response } from 'express';
import { IRequest } from '../interface/request.interface';
import { UserConnections } from '../models/connections.user.model';
import { DirectMessages } from '../models/direct.messages.model';
import { ApplicationError, BadRequest, ErrorTypes } from '../errors';

const connections = async (req: IRequest, res: Response) => {
    let connId = req.JWT_USER?.connId!;

    let conns = await UserConnections.findById(connId, { connections: 1, _id: 0 });

    res.status(200).json({
        data: conns,
    });
};

const connect = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let connUserId = req.body.userId;
        if (!connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        let conn = await UserConnections.findById(req.JWT_USER!.connId, { connections: 1 });
        let connId = conn!.connections.get(connUserId);

        if (!connId) connId = await DirectMessages.getOrCreateId(req.JWT_USER!.id, connUserId);

        res.status(200).json({
            data: connId,
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('getConnection', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const updates = async (req: IRequest, res: Response) => {
    let userId = req.JWT_USER!.id!;
    let updates = await UserConnections.findOne({ userId }, { updatedAt: 1 });
    if (!updates) {
        return res.send('Connections Doest Exist');
    }
    res.send(updates);
};

export default {
    connections,
    connect,
    updates,
};
