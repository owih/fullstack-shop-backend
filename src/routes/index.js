const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const postRouter = require('./postRouter');
const profileRouter = require('./profileRouter');

router.use('/user', userRouter);
router.use('/profile', profileRouter);
router.use('/post', postRouter);

module.exports = router;