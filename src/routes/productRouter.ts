import Router from 'express';
import productController from '../controllers/productController';
import checkRoleMiddleWare from '../middleware/checkRoleMiddleWare';

const checkRole = checkRoleMiddleWare('ADMIN');
const router = Router();

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.put('/', checkRole, productController.create);
router.delete('/:id', checkRole, productController.delete);

export default router;
