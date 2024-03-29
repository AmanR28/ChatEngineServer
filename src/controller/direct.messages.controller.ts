import { IRequest, NextFunction, Response } from '../interface/request.interface';
import { ApplicationError, BadRequest, ErrorTypes, NotFound, UnAuthorizedError } from '../errors';
import { DirectMessages, IMessage, msgType } from '../models/direct.messages.model';
import { UserConnections } from '../models/connections.user.model';
import { ObjectId } from 'mongoose';
import { DisappearMessage } from '../models/disappering.messages.model';
import config from '../config';
import { connTypes } from '../interface/types.connections.interface';

const getConnection = async (id: ObjectId, connUserId: string) => {
    const connIds = await UserConnections.findById(id, {
        directConnections: 1,
    });
    const connId = connIds?.directConnections.get(connUserId);
    if (!connId) throw new NotFound(ErrorTypes.CONNECTION_NOT_FOUND);

    return await DirectMessages.findOne({ connId });
};

const send = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { message, connUserId, isDisappearing } = req.body;
        if (!message || !connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await getConnection(req.JWT_USER!.connsId!, connUserId);

        const msg: IMessage = {
            msgId: '',
            type: msgType.TEXT,
            msg: message,
            sendBy: req.JWT_USER!.id,
            sendAt: new Date(),
        };

        const msgId = await conn!.send(msg);

        if (isDisappearing) {
            DisappearMessage.create({
                msgId,
                type: connTypes.DIRECT,
                connId: conn!.connId,
                expiry: new Date(Date.now() + config.MESSAGES.DISAPPEAR_TIME),
            });
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: msg,
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const sendFile = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { message, connUserId, type, isDisappearing } = req.body;
        if (!message || !connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await getConnection(req.JWT_USER!.connsId!, connUserId);

        const msg: IMessage = {
            msgId: '',
            type,
            msg: message,
            sendBy: req.JWT_USER!.id,
            sendAt: new Date(),
        };

        const msgId = await conn!.send(msg);

        if (isDisappearing) {
            DisappearMessage.create({
                msgId,
                type: connTypes.DIRECT,
                connId: conn!.connId,
                expiry: new Date(Date.now() + config.MESSAGES.DISAPPEAR_TIME),
            });
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: msg,
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { msgId, connUserId } = req.body;
        if (!msgId || !connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await getConnection(req.JWT_USER!.connsId!, connUserId);

        const msg = conn!.messages.get(msgId);

        if (!msg) throw new NotFound(ErrorTypes.MESSAGE_NOT_FOUND);

        res.status(200).json({
            status: 'SUCCESS',
            data: msg,
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const getAll = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { connUserId } = req.body;
        if (!connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await getConnection(req.JWT_USER!.connsId!, connUserId);

        res.status(200).json({
            status: 'SUCCESS',
            data: conn!.messages,
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const read = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { msgId, connUserId } = req.body;
        if (!msgId || !connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const result = await UserConnections.updateOne(
            { userId: req.JWT_USER!.id },
            { $pull: { [`updates.${connUserId}`]: msgId } }
        );

        if (!result.modifiedCount) throw new NotFound(ErrorTypes.MESSAGE_NOT_FOUND);

        res.status(200).json({
            status: 'SUCCESS',
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const readAll = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { connUserId } = req.body;
        if (!connUserId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        await UserConnections.updateOne(
            { userId: req.JWT_USER!.id },
            { $unset: { [`updates.${connUserId}`]: '' } }
        );

        res.status(200).json({
            status: 'SUCCESS',
            data: 'OK',
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

export default {
    send,
    sendFile,
    get,
    getAll,
    read,
    readAll,
};
