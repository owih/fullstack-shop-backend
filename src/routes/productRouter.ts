import Router from 'express';
import productController from '../controllers/productController';

const router = Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/create', productController.create);
router.get('/remove/:id', productController.delete);

export default router;
