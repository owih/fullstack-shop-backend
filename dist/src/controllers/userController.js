"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../error/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateJwt = ({ id, email, role, cartId, favoritesId, userInfoId, }) => {
    return jsonwebtoken_1.default.sign({ id, email, role, cartId, favoritesId, userInfoId }, process.env.SECRET_KEY || 'secret', { expiresIn: '62h' });
};
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password } = req.body;
                if (!email || !password || !name) {
                    return next(ApiError_1.default.badRequest('Incorrect form data'));
                }
                const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const passwordLength = 6;
                const nameLength = 2;
                if (!emailRegExp.test(email) ||
                    password.length < passwordLength ||
                    name.length < nameLength) {
                    return next(ApiError_1.default.badRequest('Incorrect form data'));
                }
                const userWithRequestEmail = yield prisma_1.default.user.findFirst({
                    where: { email },
                });
                if (userWithRequestEmail) {
                    return next(ApiError_1.default.badRequest('This email already exist'));
                }
                const hashPassword = yield bcrypt_1.default.hash(password, 3);
                const userInfo = yield prisma_1.default.userInfo.create({
                    data: {
                        name,
                    },
                });
                const cart = yield prisma_1.default.cart.create({ data: {} });
                const favorites = yield prisma_1.default.favorites.create({ data: {} });
                const user = yield prisma_1.default.user.create({
                    data: {
                        userInfoId: userInfo.id,
                        email,
                        password: hashPassword,
                        cartId: cart.id,
                        favoritesId: favorites.id,
                    },
                });
                const token = generateJwt({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    cartId: user.cartId,
                    favoritesId: user.favoritesId,
                    userInfoId: user.userInfoId,
                });
                return res.status(200).json({ token });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while registration'));
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield prisma_1.default.user.findFirst({
                    where: { email },
                });
                if (!user) {
                    return next(ApiError_1.default.badRequest('User not found'));
                }
                const comparePassword = bcrypt_1.default.compareSync(password, user.password);
                if (!comparePassword) {
                    return next(ApiError_1.default.internal('Wrong password'));
                }
                const token = generateJwt({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    cartId: user.cartId,
                    favoritesId: user.favoritesId,
                    userInfoId: user.userInfoId,
                });
                return res.status(200).json({ token });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while login'));
            }
        });
    }
    check(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                const token = generateJwt({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    cartId: user.cartId,
                    favoritesId: user.favoritesId,
                    userInfoId: user.userInfoId,
                });
                return res.status(200).json({ token });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while check'));
            }
        });
    }
    getInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body.user;
                const user = yield prisma_1.default.user.findFirst({
                    where: { id },
                });
                if (!user) {
                    return next(ApiError_1.default.badRequest('User not found'));
                }
                const userInfo = yield prisma_1.default.userInfo.findFirst({
                    where: {
                        id: user.userInfoId,
                    },
                });
                return res.status(200).json({ userInfo });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while login'));
            }
        });
    }
    updateInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, address, country, city } = req.body;
                const { userInfoId } = req.body.user;
                const userInfo = yield prisma_1.default.userInfo.findFirst({
                    where: {
                        id: userInfoId,
                    },
                });
                const userInfoUpdated = yield prisma_1.default.userInfo.update({
                    where: {
                        id: userInfoId,
                    },
                    data: {
                        name: name || (userInfo === null || userInfo === void 0 ? void 0 : userInfo.name),
                        address: address || (userInfo === null || userInfo === void 0 ? void 0 : userInfo.address),
                        city: city || (userInfo === null || userInfo === void 0 ? void 0 : userInfo.city),
                        country: country || (userInfo === null || userInfo === void 0 ? void 0 : userInfo.country),
                    },
                });
                const token = generateJwt({
                    id: req.body.user.id,
                    email: req.body.user.email,
                    role: req.body.user.role,
                    cartId: req.body.user.cartId,
                    favoritesId: req.body.user.favoritesId,
                    userInfoId: req.body.user.userInfoId,
                });
                return res.status(200).json({ token, userInfo: userInfoUpdated });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while login'));
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword } = req.body;
                const { id } = req.body.user;
                if (!oldPassword || !newPassword || newPassword.length < 5) {
                    return next(ApiError_1.default.internal('Incorrect password format'));
                }
                const user = yield prisma_1.default.user.findFirst({
                    where: {
                        id: id,
                    },
                });
                if (!user) {
                    return next(ApiError_1.default.internal('Something went wrong'));
                }
                const comparePassword = bcrypt_1.default.compareSync(oldPassword, user.password);
                if (!comparePassword) {
                    return next(ApiError_1.default.internal('Incorrect password'));
                }
                const hashPassword = yield bcrypt_1.default.hash(newPassword, 3);
                yield prisma_1.default.user.update({
                    where: {
                        id: id,
                    },
                    data: {
                        password: hashPassword,
                    },
                });
                const token = generateJwt({
                    id: req.body.user.id,
                    email: req.body.user.email,
                    role: req.body.user.role,
                    cartId: req.body.user.cartId,
                    favoritesId: req.body.user.favoritesId,
                    userInfoId: req.body.user.userInfoId,
                });
                return res.status(200).json({ token });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while login'));
            }
        });
    }
}
exports.default = new UserController();
