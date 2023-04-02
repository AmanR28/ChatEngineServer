import { Router } from 'express';
import userController from '../controller/user.controller';
import isAuth from '../middlewares/isAuth.middleware';

const router = Router();

router.get('/', isAuth, userController.userInfo);

export default router;
