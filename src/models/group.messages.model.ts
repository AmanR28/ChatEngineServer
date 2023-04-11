import { Schema, model, Model } from 'mongoose';
import { IMessage, messageSchema } from './message.model';
import { v4 as uuidv4 } from 'uuid';
import { UserConnections } from './connections.user.model';

export * from './message.model';

export interface IGroupMessages {
    connId: string;
    name: string;
    users: string[];
    messages: Map<string, IMessage>;
    send(message: IMessage): Promise<null>;
    connect(userId: string): Promise<null>;
}

export interface IGroupMessagesModel extends Model<IGroupMessages> {
    getOrCreateId(connId: string): Promise<string>;
}

const groupMessageSchema = new Schema<IGroupMessages>({
    connId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
    },
    users: {
        type: [String],
        required: true,
    },
    messages: {
        type: Map,
        of: messageSchema,
        required: true,
    },
});

groupMessageSchema.statics.getOrCreateId = async function (connId) {
    let conn = await GroupMessages.findOne({ connId });

    if (!conn) {
        conn = await GroupMessages.create({
            connId,
            users: [],
            messages: {},
        });
    }

    return conn.connId;
};

groupMessageSchema.methods.connect = async function (userId: string) {
    this.users.push(userId);
    await this.save();

    return null;
};

groupMessageSchema.methods.send = async function (message: IMessage) {
    let msgId = uuidv4();
    message.msgId = msgId;

    this.messages.set(msgId, message);
    await this.save();

    let users = this.users.filter((x: string) => x != message.sendBy);

    let updates = 'updates.' + this.connId;
    await UserConnections.updateMany({ userId: { $in: users } }, { $push: { [updates]: msgId } });

    return null;
};

export const GroupMessages = model<IGroupMessages, IGroupMessagesModel>(
    'GroupMessages',
    groupMessageSchema,
    'messages_group'
);
