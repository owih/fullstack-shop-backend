"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = __importDefault(require("../controllers/productController"));
const checkRoleMiddleWare_1 = __importDefault(require("../middleware/checkRoleMiddleWare"));
const checkRole = (0, checkRoleMiddleWare_1.default)('ADMIN');
const router = (0, express_1.default)();
router.get('/', productController_1.default.getAll);
router.get('/:id', productController_1.default.getOne);
router.put('/', productController_1.default.create);
router.delete('/:id', checkRole, productController_1.default.delete);
exports.default = router;
