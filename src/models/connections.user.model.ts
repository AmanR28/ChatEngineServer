import { Schema, model, Model } from 'mongoose';

export interface IConnectionsUser extends Document {
    userId: string;
    updatedAt: Date;
    new: string[];
    [key: string]: any;
}

export interface IConnectionsUserModel extends Model<IConnectionsUser> {}

const connectionsUserSchema = new Schema<IConnectionsUser>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        updatedAt: {
            type: Date,
        },
        new: {
            type: [String],
        },
    },
    { strict: false }
);

export const ConnectionsUser = model<IConnectionsUser, IConnectionsUserModel>(
    'ConnectionsUser',
    connectionsUserSchema,
    'connections_user'
);
