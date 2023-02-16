const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const middleWareAuthCheck = require('../middleware/authMiddleWare');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', middleWareAuthCheck, userController.check);

module.exports = router;
