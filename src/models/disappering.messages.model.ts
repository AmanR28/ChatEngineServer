import { Schema, model } from 'mongoose';
import { connTypes } from '../interface/types.connections.interface';

export interface IDisappearMessage {
    msgId: string;
    type: connTypes;
    connId: string;
    expiry: Date;
}

export const disappearMessage = new Schema<IDisappearMessage>({
    msgId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(connTypes),
    },
    connId: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
});

export const DisappearMessage = model<IDisappearMessage>(
    'DisappearMessage',
    disappearMessage,
    'messages_disappear'
);
