import { Router } from 'express';
import userController from '../controller/user.controller';
import isAuth from '../middlewares/isAuth.middleware';
import connectionController from 'src/controller/connection.controller';

const router = Router();

router.get('/', isAuth, userController.getProfile);
router.get('/connections', isAuth, connectionController.getConnections);
router.get('/connections/updates', isAuth, connectionController.getUpdates);
router.get('/connections/connect', isAuth, connectionController.getConnection);

export default router;
