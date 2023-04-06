import { Router } from 'express';
import { isAuth } from '../middlewares';
import connectionController from '../controller/connection.controller';

const router = Router();

router.get('/', isAuth, connectionController.getConnections);
router.get('/updates', isAuth, connectionController.getUpdates);
router.get('/connect', isAuth, connectionController.getConnection);

export default router;
