import { Schema } from 'mongoose';

export interface IDMessage extends Document {
    msgId: string;
    userId: string;
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
    msg: {
        type: String,
        required: true,
    },
    sendAt: {
        type: Date,
        required: true,
    },
});
