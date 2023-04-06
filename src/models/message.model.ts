import { Schema } from 'mongoose';

export enum msgType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
}
export interface IDMessage extends Document {
    msgId: string;
    userId: string;
    type: msgType;
    msg: string;
    sendAt: Date;
}

export const dMessageSchema = new Schema<IDMessage>({
    msgId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(msgType),
    },
    msg: {
        type: String,
        required: true,
    },
    sendAt: {
        type: Date,
        required: true,
    },
});
