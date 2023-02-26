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
const prisma_1 = __importDefault(require("../prisma"));
class FavoritesController {
    getFavorites(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { favoritesId } = req.body.user;
                if (!favoritesId) {
                    return next(ApiError_1.default.badRequest('Error while get favorites'));
                }
                const productOnFavorites = yield prisma_1.default.productOnFavorites.findMany({
                    where: {
                        favoritesId,
                    },
                    include: {
                        product: {
                            include: {
                                type: {
                                    select: {
                                        type: true,
                                    },
                                },
                                image: {
                                    select: {
                                        name: true,
                                        url: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return res.status(200).json({ favorites: productOnFavorites });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while get favorites'));
            }
        });
    }
    addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const { favoritesId } = req.body.user;
                if (!favoritesId || !Number(productId)) {
                    return next(ApiError_1.default.badRequest('Error while add favorites'));
                }
                yield prisma_1.default.productOnFavorites.create({
                    data: {
                        favoritesId: Number(favoritesId),
                        productId: Number(productId),
                        assignedBy: '',
                    },
                });
                const productOnFavorites = yield prisma_1.default.productOnFavorites.findMany({
                    where: {
                        favoritesId: favoritesId,
                    },
                    include: {
                        product: {
                            include: {
                                type: {
                                    select: {
                                        type: true,
                                    },
                                },
                                image: {
                                    select: {
                                        name: true,
                                        url: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return res.status(200).json({ favorites: productOnFavorites });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while add favorites'));
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: productId } = req.params;
                const { favoritesId } = req.body.user;
                if (!favoritesId || !Number(productId)) {
                    return next(ApiError_1.default.badRequest('Error while delete from favorites'));
                }
                yield prisma_1.default.productOnFavorites.delete({
                    where: {
                        favoritesId_productId: {
                            favoritesId,
                            productId: Number(productId),
                        },
                    },
                });
                const productOnFavorites = yield prisma_1.default.productOnFavorites.findMany({
                    where: {
                        favoritesId: favoritesId,
                    },
                    include: {
                        product: {
                            include: {
                                type: {
                                    select: {
                                        type: true,
                                    },
                                },
                                image: {
                                    select: {
                                        name: true,
                                        url: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return res.status(200).json({ favorites: productOnFavorites });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while delete from favorites'));
            }
        });
    }
    clear(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { favoritesId } = req.body.user;
                if (!favoritesId) {
                    return next(ApiError_1.default.badRequest('Error while delete from favorites'));
                }
                yield prisma_1.default.productOnFavorites.deleteMany({
                    where: {
                        favoritesId,
                    },
                });
                const productOnFavorites = yield prisma_1.default.productOnFavorites.findMany({
                    where: {
                        favoritesId: favoritesId,
                    },
                    include: {
                        product: {
                            include: {
                                type: {
                                    select: {
                                        type: true,
                                    },
                                },
                                image: {
                                    select: {
                                        name: true,
                                        url: true,
                                    },
                                },
                            },
                        },
                    },
                });
                return res.status(200).json({ favorites: productOnFavorites });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while delete from favorites'));
            }
        });
    }
}
exports.default = new FavoritesController();
