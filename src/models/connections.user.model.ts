import { Schema, model, Model } from 'mongoose';

export interface IUserConnections extends Document {
    userId: string;
    updatedAt: Date;
    updates: Map<string, string[]>;
    connections: Map<string, string>;
    getConnection(connUserId: string): Promise<IUserConnections>;
}

export interface IUserConnectionsModel extends Model<IUserConnections> {
    getOrCreate(userId: string): Promise<IUserConnections>;
}

const connectionsUserSchema = new Schema<IUserConnections>({
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
): Promise<IUserConnections> {
    return (
        (await UserConnections.findOne({ userId })) || (await UserConnections.create({ userId }))
    );
};

connectionsUserSchema.methods.getConnection = async function (connUserId: string) {
    return this.connections[connUserId];
};

export const UserConnections = model<IUserConnections, IUserConnectionsModel>(
    'UserConnections',
    connectionsUserSchema,
    'user_connections'
);
