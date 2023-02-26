"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleWare_1 = __importDefault(require("../middleware/authMiddleWare"));
const favoritesController_1 = __importDefault(require("../controllers/favoritesController"));
const router = (0, express_1.default)();
router.get('/', authMiddleWare_1.default, favoritesController_1.default.getFavorites);
router.put('/', authMiddleWare_1.default, favoritesController_1.default.addProduct);
router.delete('/:id', authMiddleWare_1.default, favoritesController_1.default.deleteProduct);
router.delete('/', authMiddleWare_1.default, favoritesController_1.default.clear);
exports.default = router;
