import { Router } from 'express';
import { isAuth } from '../middlewares';
import groupMessageController from '../controller/group.message.controller';

const router = Router();

router.get('/get', isAuth, groupMessageController.get);
router.get('/getAll', isAuth, groupMessageController.getAll);
router.post('/send', isAuth, groupMessageController.send);
router.get('/read', isAuth, groupMessageController.read);
router.get('/readAll', isAuth, groupMessageController.readAll);

export default router;
