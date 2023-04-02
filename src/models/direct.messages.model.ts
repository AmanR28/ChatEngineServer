import { Schema, model, Model } from 'mongoose';
import { IMessage, messageSchema } from './message.model';

export * from './message.model';

export interface IDirectMessages extends Document {
    connId: string;
    userId1: string;
    userId2: string;
    messages: Map<string, IMessage>;
}

export interface IDirectMessagesModel extends Model<IDirectMessages> {}

const directMessageSchema = new Schema<IDirectMessages>({
    connId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userId1: {
        type: String,
        required: true,
    },
    userId2: {
        type: String,
        required: true,
    },
    messages: {
        type: Map,
        of: messageSchema,
    },
});

directMessageSchema.index({ userId1: 1, userId2: 1 });

export const DirectMessages = model<IDirectMessages, IDirectMessagesModel>(
    'DirectMessages',
    directMessageSchema,
    'direct_messages'
);
