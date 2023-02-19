import Router from 'express';
import userRouter from './userRouter';
import productRouter from './productRouter';
import cartRouter from './cartRouter';

const router = Router();

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);

export default router;
