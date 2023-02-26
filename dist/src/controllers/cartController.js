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
class CartController {
    getCart(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cartId } = req.body.user;
                if (!Number(cartId)) {
                    return next(ApiError_1.default.badRequest('Error while get cart'));
                }
                const productOnCart = yield prisma_1.default.productOnCart.findMany({
                    where: {
                        cartId: Number(cartId),
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
                return res.status(200).json({ cart: productOnCart });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while get product'));
            }
        });
    }
    addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.body;
                const { cartId } = req.body.user;
                if (!cartId || !productId) {
                    return next(ApiError_1.default.badRequest('Error while add product'));
                }
                yield prisma_1.default.productOnCart.create({
                    data: {
                        count: 1,
                        cartId: Number(cartId),
                        productId: Number(productId),
                        assignedBy: '',
                    },
                });
                const productOnCart = yield prisma_1.default.productOnCart.findMany({
                    where: {
                        cartId: Number(cartId),
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
                return res.status(200).json({ cart: productOnCart });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while add product'));
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: productId } = req.params;
                const { cartId } = req.body.user;
                if (!cartId || !Number(productId)) {
                    return next(ApiError_1.default.badRequest('Error while add product'));
                }
                yield prisma_1.default.productOnCart.delete({
                    where: {
                        cartId_productId: {
                            cartId,
                            productId: Number(productId),
                        },
                    },
                });
                const productOnCart = yield prisma_1.default.productOnCart.findMany({
                    where: {
                        cartId: Number(cartId),
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
                return res.status(200).json({ cart: productOnCart });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while product deleting'));
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, count } = req.body;
                const { cartId } = req.body.user;
                if (!cartId || !productId) {
                    return next(ApiError_1.default.badRequest('Error while add product'));
                }
                const product = yield prisma_1.default.product.findFirst({
                    where: {
                        id: Number(productId),
                    },
                });
                if (!product) {
                    return next(ApiError_1.default.badRequest(`The product ${productId} not existed`));
                }
                const realCount = count > product.stock ? product.stock : count;
                if (count <= 0) {
                    yield prisma_1.default.productOnCart.delete({
                        where: {
                            cartId_productId: {
                                cartId,
                                productId,
                            },
                        },
                    });
                }
                else {
                    yield prisma_1.default.productOnCart.update({
                        where: {
                            cartId_productId: {
                                cartId,
                                productId,
                            },
                        },
                        data: {
                            count: realCount,
                        },
                    });
                }
                const productOnCart = yield prisma_1.default.productOnCart.findMany({
                    where: {
                        cartId: Number(cartId),
                    },
                    orderBy: {
                        assignedAt: 'asc',
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
                return res.status(200).json({ cart: productOnCart });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while add product'));
            }
        });
    }
}
exports.default = new CartController();
