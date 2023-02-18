import Router from 'express';
import userController from '../controllers/userController';
import middleWareAuthCheck from '../middleware/authMiddleWare';

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', middleWareAuthCheck, userController.check);

export default router;
