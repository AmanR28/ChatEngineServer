import { Model, Schema, model } from 'mongoose';
import { IMessage, messageSchema } from './message.model';
import { UserConnections } from './connections.user.model';
export * from './message.model';
import { v4 as uuidv4 } from 'uuid';
import { Bots } from './bots.models';
import config from '../config';
import axios from 'axios';

export interface IBotMessages {
    connId: string;
    userId: string;
    botId: string;
    messages: Map<string, IMessage>;
    conversation: [];
    send(message: IMessage): Promise<null>;
}

const botMessageSchema = new Schema<IBotMessages>({
    connId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
    },
    botId: {
        type: String,
        required: true,
    },
    messages: {
        type: Map,
        of: messageSchema,
        default: {},
    },
    conversation: {
        type: [],
        default: [],
    },
});

botMessageSchema.methods.send = async function (message: IMessage) {
    let msgId = uuidv4();
    message.msgId = msgId;

    this.messages.set(msgId, message);

    if (message.sendBy == this.userId) {
        this.conversation.push({ role: 'user', content: message.msg });
        if (this.conversation.length > config.BOTS.CONV_LIMIT) {
            this.conversation.shift();
        }
        await this.save();
        let updates = 'updates.' + this.userId;
        await Bots.updateOne({ botId: this.botId }, { $push: { [updates]: msgId } });
        axios
            .post(config.BOTS.URL + 'update', {
                botId: this.botId,
                connId: this.connId,
                conv: this.conversation,
            })
            .catch(err => console.error('Bot Error', err));
    } else {
        this.conversation.push({ role: 'assistant', content: message.msg });
        if (this.conversation.length > config.BOTS.CONV_LIMIT) {
            this.conversation.shift();
        }
        await this.save();
        let updates = 'updates.' + this.botId;
        await UserConnections.updateOne({ userId: this.userId }, { $push: { [updates]: msgId } });
    }

    return null;
};

botMessageSchema.index({ userId: 1, botId: 1 });

export const BotMessages = model<IBotMessages>('BotMessages', botMessageSchema, 'messages_bot');
