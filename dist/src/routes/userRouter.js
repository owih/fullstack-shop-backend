"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleWare_1 = __importDefault(require("../middleware/authMiddleWare"));
const router = (0, express_1.default)();
router.post('/registration', userController_1.default.registration);
router.post('/login', userController_1.default.login);
router.get('/auth', authMiddleWare_1.default, userController_1.default.check);
router.get('/info', authMiddleWare_1.default, userController_1.default.getInfo);
router.post('/info', authMiddleWare_1.default, userController_1.default.updateInfo);
router.post('/password', authMiddleWare_1.default, userController_1.default.updatePassword);
exports.default = router;
