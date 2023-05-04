import { NextFunction, Request, Response } from 'express';
import { IRequest } from '../interface/request.interface';
import { UserConnections } from '../models/connections.user.model';
import { DirectMessages } from '../models/direct.messages.model';
import { ApplicationError, BadRequest, ErrorTypes, NotFound, UnAuthorizedError } from '../errors';
import { connTypes } from '../interface/types.connections.interface';
import { IGroupMessages, GroupMessages } from '../models/group.messages.model';
import { randomInt } from 'crypto';
import { Bots } from '../models/bots.models';
import { BotMessages } from '../models/bots.messages.model';

const connections = async (req: IRequest, res: Response) => {
    let connId = req.JWT_USER?.connsId!;

    let conns = await UserConnections.findById(connId, {
        directConnections: 1,
        groupConnections: 1,
        botConnections: 1,
        _id: 0,
    });

    res.status(200).json({
        data: conns,
    });
};

const updates = async (req: IRequest, res: Response) => {
    let userId = req.JWT_USER!.id!;
    let updates = await UserConnections.findOne({ userId }, { updatedAt: 1, updates: 1 });
    if (!updates) {
        return res.send('Connections Doest Exist');
    }
    res.send(updates);
};

const connectDirect = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let connUserId = req.body.userId;

        if (!connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        let conn = await UserConnections.findById(req.JWT_USER!.connsId, { directConnections: 1 });

        let connId = conn!.directConnections.get(connUserId);
        if (!connId) connId = await DirectMessages.getOrCreateId(req.JWT_USER!.id, connUserId);

        res.status(200).json({
            data: {
                connId: connId,
            },
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('getConnection', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const connectGroup = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let connId: string = req.body.connId;
        let state: string;

        if (connId) {
            let conn = await GroupMessages.findOne({ connId });
            if (!conn) throw new NotFound('Group Not Found');
            if (!conn.users.includes(req.JWT_USER!.id)) {
                conn.users.push(req.JWT_USER!.id);
                await conn.save();
                let updates = 'groupConnections.' + connId;
                await UserConnections.updateOne(
                    { userId: req.JWT_USER?.id },
                    { $set: { [updates]: connId } }
                );
                state = 'ADDED TO GROUP';
            } else state = 'ALREADY IN GROUP';
        } else {
            connId = '_G' + req.JWT_USER!.id + randomInt(1000);
            await GroupMessages.create({
                connId,
                users: [req.JWT_USER?.id],
                messages: {},
            });
            await UserConnections.updateOne(
                { userId: req.JWT_USER?.id },
                { $set: { groupConnections: { [connId]: connId } } }
            );
            state = 'CREATED GROUP';
        }

        return res.status(200).send({
            data: {
                connId,
                state,
            },
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('getConnection', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const connectBot = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { botId } = req.body;
        if (!botId) throw new BadRequest('Missing BotId');

        let userId = req.JWT_USER!.id;

        const bot = await Bots.findOne({ botId });
        if (!bot) throw new NotFound('Missing Bot');

        let conn = await UserConnections.findById(req.JWT_USER!.connsId);

        let connId = conn?.botConnections.get(botId);

        if (!connId) {
            connId = userId + botId + randomInt(1000);
            await BotMessages.create({
                connId,
                userId,
                botId,
            });

            conn?.botConnections.set(botId, connId);
            await conn?.save();

            bot.connections.set(connId, userId);
            await bot.save();
        }

        return res.status(200).json({
            data: {
                connId,
            },
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('getConnection', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

export default {
    connections,
    updates,
    connectDirect,
    connectGroup,
    connectBot,
};
