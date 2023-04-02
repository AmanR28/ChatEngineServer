import { Request } from 'express';
import { IUser } from './user.interface';
import { ApplicationError } from 'src/errors';

export interface IRequest extends Request {
    JWT_ERROR?: ApplicationError;
    JWT_USER?: IUser;
}
