import Router from 'express';
import cartController from '../controllers/cartController';
import authMiddleWare from '../middleware/authMiddleWare';

const router = Router();

router.get('/', authMiddleWare, cartController.getCart);
router.post('/', authMiddleWare, cartController.update);
router.put('/', authMiddleWare, cartController.addProduct);
router.delete('/', authMiddleWare, cartController.deleteProduct);

export default router;
