import { Request } from 'express';
import { IConnectionsUser } from '../models/connections.user.model';

export interface IUser {
    id: string;
    connections?: IConnectionsUser | null;
}
