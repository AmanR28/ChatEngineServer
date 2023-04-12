import multer from 'multer';
import config from '../config';
import { IRequest } from '../interface/request.interface';
import * as fs from 'fs';
import { msgType } from '../models/message.model';
import { BadRequest } from '../errors';

const PATHS = {
    PROFILE: '/profiles/',
    IMAGES: '/images/',
    AUDIO: '/audio',
    FILES: '/files',
};

export const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = config.MULTER.UPLOAD_PATH + PATHS.PROFILE;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: (req: IRequest, file, cb) => {
        if (file.mimetype.split('/')[0] !== 'image')
            return cb(new Error('MULTER_UNSUPPORTED_FILE'), '');

        const userId = req.JWT_USER?.id;
        const date = new Date().getTime();
        const extension = file.mimetype.split('/')[1];

        const fileName = userId + '_' + date + '.' + extension;
        req.body.avatar = PATHS.PROFILE + fileName;

        cb(null, fileName);
    },
});

export const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const type = req.body.type;
        let mime = file.mimetype.split('/')[0];

        let path: string;

        switch (type) {
            case msgType.IMAGE:
                if (mime !== 'image') return cb(new BadRequest('MULTER_UNSUPPORTED_FILE'), '');
                path = config.MULTER.UPLOAD_PATH + PATHS.IMAGES;
                break;
            case msgType.AUDIO:
                if (mime !== 'audio') return cb(new BadRequest('MULTER_UNSUPPORTED_FILE'), '');
                path = config.MULTER.UPLOAD_PATH + PATHS.AUDIO;
                break;
            case msgType.FILE:
                path = config.MULTER.UPLOAD_PATH + PATHS.FILES;
                break;
            default:
                return cb(new BadRequest('Invalid Type'), '');
        }

        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: (req: IRequest, file, cb) => {
        const email = req.JWT_USER?.id;
        const date = new Date().getTime();
        const extension = file.mimetype.split('/')[1];

        const fileName = email + '_' + date + '.' + extension;
        req.body.message = PATHS.PROFILE + fileName;

        cb(null, fileName);
    },
});
