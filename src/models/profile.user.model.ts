import { Schema, model, Model, ObjectId } from 'mongoose';
import { UserConnections } from './connections.user.model';
import { v4 as uuidv4 } from 'uuid';

export interface IUserProfile extends Document {
    userId: string;
    name: string;
    email: string;
    avatar: string;
    lastSeen: Date;
}

export interface IUserProfileModel extends Model<IUserProfile> {
    getOrCreateId(userId: string): Promise<ObjectId>;
}

const userProfile = new Schema<IUserProfile>(
    {
        userId: {
            type: String,
            index: true,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        avatar: {
            type: String,
        },
        lastSeen: {
            type: Date,
            default: new Date(),
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
    }
);

userProfile.statics.getOrCreateId = async function (userId: string): Promise<ObjectId> {
    let conn = await UserProfile.findOne({ userId });
    if (!conn) {
        conn = await UserProfile.create({ userId, name: '', email: '', avatar: '' });
    }
    return conn.id;
};

userProfile.methods.toJSON = function () {
    const msg = this.toObject();
    delete msg._id;
    delete msg.__v;
    return msg;
};

export const UserProfile = model<IUserProfile, IUserProfileModel>(
    'UserProfile',
    userProfile,
    'user_profile'
);
