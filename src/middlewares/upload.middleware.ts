import multer from 'multer';
import { profileStorage } from '../services/multer.services';

export default {
    profileImage: multer({
        storage: profileStorage,
    }).single('avatar'),
};
