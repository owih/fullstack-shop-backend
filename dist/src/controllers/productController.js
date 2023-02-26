"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const uuid = __importStar(require("uuid"));
const path_1 = __importDefault(require("path"));
class ProductController {
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, limit, page, name } = req.query;
                const pageParsed = Number(page) || 1;
                const limitParsed = Number(limit) || 9;
                const offset = pageParsed * limitParsed - limitParsed;
                let products = [];
                let productsCount = 0;
                if (type || name) {
                    products = yield prisma_1.default.product.findMany({
                        skip: offset,
                        take: limitParsed,
                        where: {
                            name: name
                                ? {
                                    contains: name,
                                    mode: 'insensitive',
                                }
                                : {},
                            type: type
                                ? {
                                    some: {
                                        type: {
                                            name: {
                                                equals: type,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                }
                                : {},
                        },
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
                    });
                    productsCount = yield prisma_1.default.product.count({
                        where: {
                            name: name
                                ? {
                                    contains: name,
                                    mode: 'insensitive',
                                }
                                : {},
                            type: type
                                ? {
                                    some: {
                                        type: {
                                            name: {
                                                equals: type,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                }
                                : {},
                        },
                    });
                }
                if (!type && !name) {
                    products = yield prisma_1.default.product.findMany({
                        skip: offset,
                        take: limitParsed,
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
                    });
                    productsCount = yield prisma_1.default.product.count();
                }
                return res.status(200).json({ products, count: productsCount || products.length });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while get products'));
            }
        });
    }
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!Number(id)) {
                    return next(ApiError_1.default.badRequest('Incorrect id'));
                }
                const product = yield prisma_1.default.product.findUnique({
                    where: {
                        id: Number(id),
                    },
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
                });
                return res.status(200).json({ product });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while get product'));
            }
        });
    }
    create(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, sale, price, stock, description, type } = req.body;
                const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
                if (!name || !price || !stock || !description) {
                    return next(ApiError_1.default.badRequest('Incorrect data'));
                }
                const searchProductWithRequestedName = yield prisma_1.default.product.findFirst({
                    where: {
                        name: {
                            equals: name,
                            mode: 'insensitive',
                        },
                    },
                });
                if (searchProductWithRequestedName) {
                    return next(ApiError_1.default.internal('The product is already exist'));
                }
                const productType = yield prisma_1.default.productType.findFirst({
                    where: {
                        name: {
                            equals: type,
                            mode: 'insensitive',
                        },
                    },
                });
                const product = yield prisma_1.default.product.create({
                    data: {
                        name,
                        price: Number(price),
                        stock: Number(stock),
                        description,
                        sale: Number(sale) || 0,
                    },
                });
                if (productType) {
                    yield prisma_1.default.productOnType.create({
                        data: {
                            productId: product.id,
                            typeId: productType.id,
                            assignedBy: '',
                        },
                    });
                }
                if (!image)
                    return;
                if (image.size > 3145728) {
                    return next(ApiError_1.default.internal('Image size must be less then 3 MB'));
                }
                if (Array.isArray(image)) {
                    for (let i = 0; i < image.length; i++) {
                        const fileName = uuid.v4() + '.jpg';
                        yield image[i].mv(path_1.default.resolve(__dirname, '..', 'static', fileName));
                        yield prisma_1.default.productImage.create({
                            data: {
                                name: product.name,
                                productId: product.id,
                                url: fileName,
                            },
                        });
                    }
                }
                else {
                    const fileName = uuid.v4() + '.jpg';
                    yield image.mv(path_1.default.resolve(__dirname, '..', 'static', fileName));
                    yield prisma_1.default.productImage.create({
                        data: {
                            name: product.name,
                            productId: product.id,
                            url: fileName,
                        },
                    });
                }
                return res.status(200).json({ product });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while product create'));
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!Number(id)) {
                    return next(ApiError_1.default.badRequest('Incorrect id'));
                }
                const product = yield prisma_1.default.product.delete({
                    where: {
                        id: Number(id),
                    },
                });
                return res.status(200).json({ product });
            }
            catch (e) {
                return next(ApiError_1.default.internal('Error while product deleting'));
            }
        });
    }
}
exports.default = new ProductController();
