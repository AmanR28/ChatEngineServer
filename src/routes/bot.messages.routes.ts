import { Router } from 'express';
import { isAuth, isBot } from '../middlewares';
import botsMessagesController from '../controller/bots.messages.controller';

const router = Router();

// Client Side
router.post('/send', isAuth, botsMessagesController.send);
router.get('/get', isAuth, botsMessagesController.get);
router.get('/getAll', isAuth, botsMessagesController.getAll);
router.get('/read', isAuth, botsMessagesController.read);
router.get('/readAll', isAuth, botsMessagesController.readAll);

// Bot Side
router.get('/bot-list', isAuth, botsMessagesController.botList);
router.post('/bot-register', isAuth, botsMessagesController.botRegister);
router.post('/bot-send', isBot, botsMessagesController.botSend);

export default router;
