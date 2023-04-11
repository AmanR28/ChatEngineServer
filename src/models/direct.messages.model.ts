import { Schema, model, Model } from 'mongoose';
import { IDMessage, dMessageSchema } from './message.model';
import { v4 as uuidv4 } from 'uuid';
import { UserConnections } from './connections.user.model';
import { NotFound } from '../errors';

export * from './message.model';

export interface IDirectMessages {
    connId: string;
    userId1: string;
    userId2: string;
    messages: Map<string, IDMessage>;
    send(message: IDMessage): Promise<null>;
}

export interface IDirectMessagesModel extends Model<IDirectMessages> {
    getOrCreateId(uid1: string, uid2: string): Promise<string>;
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
        of: dMessageSchema,
        required: true,
    },
});

directMessageSchema.index({ userId1: 1, userId2: 1 });

directMessageSchema.statics.getOrCreateId = async function (uid1, uid2) {
    let userId1, userId2;
    if (uid1 < uid2) {
        userId1 = uid1;
        userId2 = uid2;
    } else {
        userId1 = uid2;
        userId2 = uid1;
    }

    let conn = await DirectMessages.findOne({ userId1, userId2 });

    if (!conn) {
        let conn1 = await UserConnections.findOne({ userId: userId1 });
        let conn2 = await UserConnections.findOne({ userId: userId2 });
        if (!conn1 || !conn2) throw new NotFound('Missing User');

        conn = await DirectMessages.create({
            connId: userId1 + userId2,
            userId1,
            userId2,
            messages: {},
        });

        conn1.connections.set(userId2, conn.connId);
        conn2.connections.set(userId1, conn.connId);

        await conn1.save();
        await conn2.save();
    }

    return conn!.connId;
};

directMessageSchema.methods.send = async function (message: IDMessage) {
    let msgId = uuidv4();
    message.msgId = msgId;

    console.log(this.messages);

    this.messages.set(msgId, message);
    await this.save();

    let uid1 = this.userId1;
    let uid2 = this.userId2;
    let updates = 'updates.';

    if (message.sendBy == uid1) {
        updates += uid1;
        await UserConnections.updateOne({ userId: uid2 }, { $push: { [updates]: msgId } });
    }
    if (message.sendBy == uid2) {
        updates += uid2;
        await UserConnections.updateOne({ userId: uid1 }, { $push: { [updates]: msgId } });
    }

    return null;
};

export const DirectMessages = model<IDirectMessages, IDirectMessagesModel>(
    'DirectMessages',
    directMessageSchema,
    'messages_direct'
);
