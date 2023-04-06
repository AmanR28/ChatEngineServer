import { Router } from 'express';
import userController from '../controller/profile.controller';
import isAuth from '../middlewares/isAuth.middleware';

const router = Router();

router.get('/', isAuth, userController.getProfile);
router.post('/', isAuth, userController.updateProfile);

export default router;
