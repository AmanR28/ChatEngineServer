import { Schema, model, Model } from 'mongoose';

export interface IConnectionsUser extends Document {
    userId: string;
    updatedAt: Date;
    updates: Map<string, string[]>;
    connections: Map<string, string>;
    getConnection(connUserId: string): Promise<IConnectionsUser>;
}

export interface IConnectionsUserModel extends Model<IConnectionsUser> {
    getOrCreate(userId: string): Promise<IConnectionsUser>;
}

const connectionsUserSchema = new Schema<IConnectionsUser>({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    updatedAt: {
        type: Date,
    },
    updates: {
        type: Map,
        of: [String],
    },
    connections: {
        type: Map,
        of: String,
    },
});

connectionsUserSchema.statics.getOrCreate = async function (
    userId: string
): Promise<IConnectionsUser> {
    return (
        (await ConnectionsUser.findOne({ userId })) || (await ConnectionsUser.create({ userId }))
    );
};

connectionsUserSchema.methods.getConnection = async function (connUserId: string) {
    return this.connections[connUserId];
};

export const ConnectionsUser = model<IConnectionsUser, IConnectionsUserModel>(
    'ConnectionsUser',
    connectionsUserSchema,
    'user_connections'
);
