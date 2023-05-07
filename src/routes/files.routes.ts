import { Router } from 'express';
import { isAuth } from '../middlewares';
import filesController from '../controller/files.controller';

const router = Router();

router.get('/', filesController.getFile);

export default router;
