import config from '../config';
import { ApplicationError, BadRequest, ErrorTypes } from '../errors';
import { IRequest, Response, NextFunction } from '../interface/request.interface';
import { UserConnections } from '../models/connections.user.model';

const getFile = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        let file = req.query.file;
        if (!file) throw new BadRequest(ErrorTypes.MISSING_FIELDS);

        const path = config.MULTER.UPLOAD_PATH! + file;

        res.sendFile(path);
    } catch (error) {
        if (error instanceof ApplicationError) {
            return next(error);
        }
        console.log('getConnection', error);
        return next(new Error('SYSTEM FAILURE'));
    }
};

export default {
    getFile,
};
