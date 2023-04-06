import { Router } from 'express';
import { isAuth } from '../middlewares';
import directMessagesController from '../controller/direct.messages.controller';

const router = Router();

router.get('/get', isAuth, directMessagesController.get);
router.get('/getAll', isAuth, directMessagesController.getAll);
router.post('/send', isAuth, directMessagesController.send);
router.get('/read', isAuth, directMessagesController.read);
router.get('/readAll', isAuth, directMessagesController.readAll);

export default router;
