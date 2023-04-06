import { Schema, model, Model } from 'mongoose';
import { UserConnections } from './connections.user.model';
import { v4 as uuidv4 } from 'uuid';

export interface IUserProfile extends Document {
    userId: string;
    name: string;
    email: string;
    avatar: string;
}

export interface IUserProfileModel extends Model<IUserProfile> {}

const userProfile = new Schema<IUserProfile>({
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
});

userProfile.methods.toJSON = function () {
    const profile = this.toObject();
    profile.id = profile._id; // remap _id to id

    delete profile._id;
    delete profile.password;
    delete profile.__v;
    return profile;
};

userProfile.post('save', async function () {
    await UserConnections.create({
        userId: this.userId,
        updatedAt: Date.now(),
        updates: {},
    });
});

export const UserProfile = model<IUserProfile, IUserProfileModel>(
    'UserProfile',
    userProfile,
    'user_profile'
);
