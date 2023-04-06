import { Schema, model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from './profile.user.model';

export interface IAuthGoogle extends Document {
    googleId: string;
    userId: string;
}

export interface IAuthGoogleModel extends Model<IAuthGoogle> {}

const googleAuthSchema = new Schema<IAuthGoogle>({
    googleId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
});

export const AuthGoogle = model<IAuthGoogle, IAuthGoogleModel>(
    'AuthGoogle',
    googleAuthSchema,
    'auth_google'
);
