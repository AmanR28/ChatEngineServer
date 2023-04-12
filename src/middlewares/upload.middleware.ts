import multer from 'multer';
import { fileStorage, profileStorage } from '../services/multer.services';

export const avatarUploader = multer({
    storage: profileStorage,
}).single('avatar');

export const chatUploader = multer({
    storage: fileStorage,
}).single('file');
