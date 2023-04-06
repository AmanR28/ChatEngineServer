import { Router } from 'express';
import { isAuth } from '../middlewares';
import connectionController from '../controller/connection.controller';

const router = Router();

router.get('/', isAuth, connectionController.connections);
router.get('/updates', isAuth, connectionController.updates);
router.get('/connect', isAuth, connectionController.connect);

export default router;
