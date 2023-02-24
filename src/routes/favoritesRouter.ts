import Router from 'express';
import authMiddleWare from '../middleware/authMiddleWare';
import favoritesController from '../controllers/favoritesController';

const router = Router();

router.get('/', authMiddleWare, favoritesController.getFavorites);
router.put('/', authMiddleWare, favoritesController.addProduct);
router.delete('/:id', authMiddleWare, favoritesController.deleteProduct);
router.delete('/', authMiddleWare, favoritesController.clear);

export default router;
