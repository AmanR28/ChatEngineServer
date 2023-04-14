import { IRequest, NextFunction, Response } from '../interface/request.interface';
import { ApplicationError, BadRequest, ErrorTypes, NotFound, UnAuthorizedError } from '../errors';
import { UserConnections } from '../models/connections.user.model';
import { ObjectId } from 'mongoose';
import { GroupMessages, IMessage, msgType } from '../models/group.messages.model';
import { DisappearMessage } from '../models/disappering.messages.model';
import { connTypes } from '../interface/types.connections.interface';
import config from '../config';

const validateConnection = async (uid: string, cId: string) => {
    const conn = await GroupMessages.findOne({ connId: cId });
    if (!conn) throw new NotFound(ErrorTypes.CONNECTION_NOT_FOUND);
    if (!conn.users.includes(uid)) throw new UnAuthorizedError('Not Connected');
    return conn;
};

const send = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { message, connId, isDisappearing } = req.body;
        if (!message || !connId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await validateConnection(req.JWT_USER!.id, connId);

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
                type: connTypes.GROUP,
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
        let { message, connId, type, isDisappearing } = req.body;
        if (!message || !connId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await validateConnection(req.JWT_USER!.id, connId);

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
                type: connTypes.GROUP,
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
        let { msgId, connId } = req.body;
        if (!msgId || !connId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await validateConnection(req.JWT_USER!.id, connId);

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
        let { connId } = req.body;
        if (!connId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await validateConnection(req.JWT_USER!.id, connId);

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
        let { msgId, connId } = req.body;
        if (!msgId || !connId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const result = await UserConnections.updateOne(
            { userId: req.JWT_USER!.id },
            { $pull: { [`updates.${connId}`]: msgId } }
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
        let { connID } = req.body;
        if (!connID) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        await UserConnections.updateOne(
            { userId: req.JWT_USER!.id },
            { $unset: { [`updates.${connID}`]: '' } }
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
