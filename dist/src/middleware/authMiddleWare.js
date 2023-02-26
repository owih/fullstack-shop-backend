"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    var _a, _b;
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        req.body.user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'secret');
        next();
    }
    catch (e) {
        res.status(401).json({ message: 'Not authorized' });
    }
};
