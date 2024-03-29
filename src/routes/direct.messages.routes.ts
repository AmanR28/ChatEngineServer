import { Router } from 'express';
import { isAuth } from '../middlewares';
import directMessagesController from '../controller/direct.messages.controller';
import { chatUploader } from '../middlewares/upload.middleware';

const router = Router();

router.post('/get', isAuth, directMessagesController.get);
router.post('/getAll', isAuth, directMessagesController.getAll);
router.post('/read', isAuth, directMessagesController.read);
router.post('/readAll', isAuth, directMessagesController.readAll);

router.post('/send', isAuth, directMessagesController.send);
router.post('/send/file', isAuth, chatUploader, directMessagesController.sendFile);

export default router;
