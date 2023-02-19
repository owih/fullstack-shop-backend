import Router from 'express';
import authMiddleWare from '../middleware/authMiddleWare';
import favoritesController from '../controllers/favoritesController';

const router = Router();

router.get('/:id', authMiddleWare, favoritesController.getFavorites);
router.put('/', authMiddleWare, favoritesController.addProduct);
router.delete('/', authMiddleWare, favoritesController.deleteProduct);

export default router;
