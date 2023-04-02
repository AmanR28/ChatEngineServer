import { Schema, model, Model } from 'mongoose';

export interface IConnectionsUser extends Document {
    userId: string;
    updatedAt: Date;
    updates: Map<string, string[]>;
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
    },
});

connectionsUserSchema.statics.getOrCreate = async function (
    userId: string
): Promise<IConnectionsUser> {
    return (
        (await ConnectionsUser.findOne({ userId })) || (await ConnectionsUser.create({ userId }))
    );
};

export const ConnectionsUser = model<IConnectionsUser, IConnectionsUserModel>(
    'ConnectionsUser',
    connectionsUserSchema,
    'user_connections'
);
