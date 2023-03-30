import { Schema } from 'mongoose';

export interface IMessage extends Document {
    msgId: string;
    userId: string;
    msg: string;
    sendAt: Date;
}

export const messageSchema = new Schema<IMessage>({
    msgId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
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
