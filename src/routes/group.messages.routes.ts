import { Router } from 'express';
import { isAuth } from '../middlewares';
import groupMessageController from '../controller/group.message.controller';
import { chatUploader } from '../middlewares/upload.middleware';

const router = Router();

router.get('/get', isAuth, groupMessageController.get);
router.get('/getAll', isAuth, groupMessageController.getAll);
router.get('/read', isAuth, groupMessageController.read);
router.get('/readAll', isAuth, groupMessageController.readAll);

router.post('/send', isAuth, chatUploader, groupMessageController.send);
router.post('/send/file', isAuth, chatUploader, groupMessageController.sendFile);

export default router;
