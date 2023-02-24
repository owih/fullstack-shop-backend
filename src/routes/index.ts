import Router from 'express';
import userRouter from './userRouter';
import productRouter from './productRouter';
import cartRouter from './cartRouter';
import favoritesRouter from './favoritesRouter';

const router = Router();

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/favorites', favoritesRouter);

export default router;
