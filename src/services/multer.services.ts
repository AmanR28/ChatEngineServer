import multer from 'multer';
import config from '../config';
import { IRequest } from '../interface/request.interface';

const PATHS = {
    PROFILE: '/profiles/',
};

export const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.MULTER.UPLOAD_PATH + PATHS.PROFILE);
    },
    filename: (req: IRequest, file, cb) => {
        if (file.mimetype.split('/')[0] !== 'image')
            return cb(new Error('MULTER_UNSUPPORTED_FILE'), '');

        const email = req.JWT_USER?.id;
        const date = new Date().getTime();
        const extension = file.mimetype.split('/')[1];

        const fileName = email + '_' + date + '.' + extension;
        req.body.avatar = PATHS.PROFILE + fileName;

        cb(null, fileName);
    },
});
