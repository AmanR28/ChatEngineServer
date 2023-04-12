import { Router } from 'express';
import userController from '../controller/profile.controller';
import isAuth from '../middlewares/isAuth.middleware';
import { avatarUploader } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', isAuth, userController.getProfile);
router.post('/', isAuth, avatarUploader, userController.updateProfile);

export default router;
