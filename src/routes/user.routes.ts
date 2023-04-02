import { Router } from 'express';
import userController from '../controller/user.controller';
import isAuth from '../middlewares/isAuth.middleware';

const router = Router();

router.get('/', isAuth, userController.getProfile);
router.get('/connections', isAuth, userController.getConnections);
router.get('/connections/updates', isAuth, userController.getUpdates);

export default router;
