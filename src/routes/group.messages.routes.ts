import { Router } from 'express';
import { isAuth } from '../middlewares';
import groupMessageController from '../controller/group.message.controller';
import { chatUploader } from '../middlewares/upload.middleware';

const router = Router();

router.post('/get', isAuth, groupMessageController.get);
router.post('/getAll', isAuth, groupMessageController.getAll);
router.post('/read', isAuth, groupMessageController.read);
router.post('/readAll', isAuth, groupMessageController.readAll);

router.post('/send', isAuth, chatUploader, groupMessageController.send);
router.post('/send/file', isAuth, chatUploader, groupMessageController.sendFile);

export default router;
