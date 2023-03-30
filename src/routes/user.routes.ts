import { Router } from 'express';
import userController from '../controller/user.controller';

const router = Router();

router.get('/', userController.userInfo);

export default router;
