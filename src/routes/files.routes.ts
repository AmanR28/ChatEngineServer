import { Router } from 'express';
import { isAuth } from '../middlewares';
import filesController from '../controller/files.controller';

const router = Router();

router.get('/', isAuth, filesController.getFile);

export default router;
