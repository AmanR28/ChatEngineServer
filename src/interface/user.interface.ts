import { ObjectId } from 'mongoose';
import { IUserConnections } from '../models/connections.user.model';
import { IUserProfile } from 'src/models/profile.user.model';

export interface IUser {
    id: string;
    connsId?: ObjectId;
    profileId?: ObjectId;
    connections?: IUserConnections | null;
    profile?: IUserProfile | null;
}
