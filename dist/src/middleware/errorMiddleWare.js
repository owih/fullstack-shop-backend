"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../error/ApiError"));
exports.default = (err, req, res, next) => {
    if (err instanceof ApiError_1.default) {
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Непредвиденная ошибка!' });
};
