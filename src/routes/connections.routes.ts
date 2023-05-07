import { Router } from 'express';
import { isAuth } from '../middlewares';
import connectionController from '../controller/connection.controller';

const router = Router();

router.get('/', isAuth, connectionController.connections);
router.get('/updates', isAuth, connectionController.updates);
router.post('/connect/direct', isAuth, connectionController.connectDirect);
router.post('/connect/group', isAuth, connectionController.connectGroup);
router.post('/connect/bot', isAuth, connectionController.connectBot);
router.post('/readComplete', isAuth, connectionController.readComplete);

export default router;
