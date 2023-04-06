import { Schema, model, Model } from 'mongoose';
import { IMessage, messageSchema } from './message.model';
import { v4 as uuidv4 } from 'uuid';

export * from './message.model';

export interface IDirectMessages extends Document {
    connId: string;
    userId1: string;
    userId2: string;
    messages: Map<string, IMessage>;
}

export interface IDirectMessagesModel extends Model<IDirectMessages> {
    getOrCreate(uid1: string, uid2: string): any;
}

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

directMessageSchema.statics.getOrCreate = function (uid1, uid2) {
    let userId1, userId2;
    if (uid1 < uid2) {
        userId1 = uid1;
        userId2 = uid2;
    } else {
        userId1 = uid2;
        userId2 = uid1;
    }

    let conn: any = DirectMessages.findOne({ userId1, userId2 });

    if (!conn) {
        conn = DirectMessages.create({ connId: uuidv4(), userId1, userId2 });
    }

    return conn;
};

export const DirectMessages = model<IDirectMessages, IDirectMessagesModel>(
    'DirectMessages',
    directMessageSchema,
    'messages_direct'
);
