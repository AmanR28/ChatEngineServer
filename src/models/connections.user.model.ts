import { Schema, model, Model, ObjectId } from 'mongoose';

export interface IUserConnections extends Document {
    userId: string;
    updatedAt: Date;
    updates: Map<string, string[]>;
    directConnections: Map<string, string>;
    groupConnections: Map<string, string>;
    botConnections: Map<string, string>;
}

export interface IUserConnectionsModel extends Model<IUserConnections> {
    getOrCreateId(userId: string): Promise<ObjectId>;
}

const connectionsUserSchema = new Schema<IUserConnections>({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    updates: {
        type: Map,
        of: [String],
        required: true,
    },
    directConnections: {
        type: Map,
        of: String,
        required: true,
    },
    groupConnections: {
        type: Map,
        of: String,
        required: true,
    },
    botConnections: {
        type: Map,
        of: String,
        required: true,
    },
});

connectionsUserSchema.statics.getOrCreateId = async function (userId: string): Promise<ObjectId> {
    let conn = await UserConnections.findOne({ userId });
    if (!conn) {
        conn = await UserConnections.create({
            userId,
            updatedAt: Date.now(),
            updates: {},
            directConnections: {},
            groupConnections: {},
            botConnections: {},
        });
    }
    return conn.id;
};

export const UserConnections = model<IUserConnections, IUserConnectionsModel>(
    'UserConnections',
    connectionsUserSchema,
    'user_connections'
);
