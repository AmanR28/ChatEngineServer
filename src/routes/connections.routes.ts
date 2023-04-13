import { Router } from 'express';
import { isAuth } from '../middlewares';
import connectionController from '../controller/connection.controller';

const router = Router();

router.get('/', isAuth, connectionController.connections);
router.get('/updates', isAuth, connectionController.updates);
router.get('/connect/direct', isAuth, connectionController.connectDirect);
router.get('/connect/group', isAuth, connectionController.connectGroup);
router.get('/connect/bot', isAuth, connectionController.connectBot);

export default router;
