import { Router } from 'express';
import userController from '../controller/profile.controller';
import isAuth from '../middlewares/isAuth.middleware';
import uploader from '../middlewares/upload.middleware';

const router = Router();

router.get('/', isAuth, userController.getProfile);
router.post('/', isAuth, uploader.profileImage, userController.updateProfile);

export default router;
