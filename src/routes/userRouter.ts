import Router from 'express';
import userController from '../controllers/userController';
import middleWareAuthCheck from '../middleware/authMiddleWare';

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', middleWareAuthCheck, userController.check);
router.get('/info', middleWareAuthCheck, userController.getInfo);
router.post('/info', middleWareAuthCheck, userController.updateInfo);
router.post('/password', middleWareAuthCheck, userController.updatePassword);

export default router;
