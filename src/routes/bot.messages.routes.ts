import { Router } from 'express';
import { isAuth, isBot } from '../middlewares';
import botsMessagesController from '../controller/bots.messages.controller';

const router = Router();

// Client Side
router.post('/send', isAuth, botsMessagesController.send);
router.post('/get', isAuth, botsMessagesController.get);
router.post('/getAll', isAuth, botsMessagesController.getAll);
router.post('/read', isAuth, botsMessagesController.read);
router.post('/readAll', isAuth, botsMessagesController.readAll);

// Bot Side
router.get('/bot-list', isAuth, botsMessagesController.botList);
router.post('/bot-register', isAuth, botsMessagesController.botRegister);
router.post('/bot-send', isBot, botsMessagesController.botSend);

export default router;
