import { Schema, model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IGoogleAuth extends Document {
    googleId: string;
    userId: string;
}

export interface IGoogleAuthModel extends Model<IGoogleAuth> {
    getOrCreate(googleId: string): Promise<IGoogleAuth>;
    createFromGoogle(googleId: string): Promise<IGoogleAuth>;
}

const googleAuthSchema = new Schema<IGoogleAuth>({
    googleId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

googleAuthSchema.statics.createFromGoogle = async function (
    googleId: string
): Promise<IGoogleAuth> {
    const user = new GoogleAuth({
        googleId: googleId,
        userId: uuidv4(),
    });
    await user.save();
    return user;
};

googleAuthSchema.statics.getOrCreate = async function (googleId: string): Promise<IGoogleAuth> {
    return (
        (await GoogleAuth.findOne({ googleId })) || (await GoogleAuth.createFromGoogle(googleId))
    );
};

export const GoogleAuth = model<IGoogleAuth, IGoogleAuthModel>(
    'GoogleAuth',
    googleAuthSchema,
    'auth_google'
);
