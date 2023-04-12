import { Schema } from 'mongoose';

export enum msgType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    AUDIO = 'AUDIO',
    FILE = 'FILE',
}
export interface IMessage {
    msgId: string;
    type: msgType;
    msg: string;
    sendBy: string;
    sendAt: Date;
}

export const messageSchema = new Schema<IMessage>(
    {
        msgId: {
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
        sendBy: {
            type: String,
            required: true,
        },
        sendAt: {
            type: Date,
            required: true,
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
);

messageSchema.methods.toJSON = function () {
    const msg = this.toObject();
    delete msg._id;
    delete msg.__v;
    return msg;
};
