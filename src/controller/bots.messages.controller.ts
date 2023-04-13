import { Types, ObjectId } from 'mongoose';
import { ApplicationError, BadRequest, ErrorTypes, NotFound } from '../errors';
import { IRequest, NextFunction, Response } from '../interface/request.interface';
import { Bots, IBot, TypesBot } from '../models/bots.models';
import { UserConnections } from '../models/connections.user.model';
import { JwtToken, TokenType } from '../utils/token.utils';
import { BotMessages, IMessage, msgType } from '../models/bots.messages.model';

const botRegister = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const { botId, type } = req.body;
        if (!botId) throw new BadRequest('Missing Field');

        if (await Bots.findOne({ botId }))
            throw new ApplicationError('Already Exist', 'Duplicate', 300);

        if (!Object.values(TypesBot).includes(type)) throw new BadRequest('Unregistered Type');

        await Bots.create({
            botId,
            type,
        });

        const token = JwtToken.create(TokenType.BOT, botId);

        return res.status(200).json({
            data: {
                botId,
                token,
            },
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const botList = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        const bots = await Bots.find({}, { botId: 1, type: 1 });

        const botList = [];

        for (let bot of bots) {
            let token = JwtToken.create(TokenType.BOT, bot.botId);
            botList.push({
                botId: bot.botId,
                type: bot.type,
                token,
            });
        }

        return res.status(200).json({
            data: botList,
        });
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('send', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

const botSend = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { message, connId } = req.body;

        const conn = await BotMessages.findOne({ connId });

        const msg: IMessage = {
            msgId: '',
            type: msgType.TEXT,
            msg: message,
            sendBy: req.JWT_BOT!,
            sendAt: new Date(),
        };

        await conn!.send(msg);

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

const getConnection = async (id: ObjectId, botId: string) => {
    const connIds = await UserConnections.findById(id, {
        botConnections: 1,
    });
    const connId = connIds?.botConnections.get(botId);
    if (!connId) throw new NotFound(ErrorTypes.CONNECTION_NOT_FOUND);

    return await BotMessages.findOne({ connId });
};

const send = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let { message, botId } = req.body;
        if (!message || !botId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await getConnection(req.JWT_USER!.connsId!, botId);

        const msg: IMessage = {
            msgId: '',
            type: msgType.TEXT,
            msg: message,
            sendBy: req.JWT_USER!.id,
            sendAt: new Date(),
        };

        await conn!.send(msg);

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
        let { msgId, botId } = req.body;
        if (!msgId || !botId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await getConnection(req.JWT_USER!.connsId!, botId);

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
        let { botId } = req.body;
        if (!botId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const conn = await getConnection(req.JWT_USER!.connsId!, botId);

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
        let { msgId, botId } = req.body;
        if (!msgId || !botId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const result = await UserConnections.updateOne(
            { userId: req.JWT_USER!.id },
            { $pull: { [`updates.${botId}`]: msgId } }
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
        let { botId } = req.body;
        if (!botId) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        await UserConnections.updateOne(
            { userId: req.JWT_USER!.id },
            { $unset: { [`updates.${botId}`]: '' } }
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

export default { botRegister, botList, botSend, send, get, getAll, readAll, read };
