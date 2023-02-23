import ApiError from '../error/ApiError';
import prisma from '../prisma';
import { Product, ProductOnCart } from '@prisma/client';
import { NextFunction } from 'express';
import { TypedResponse } from '../types/response/typedResponse';
import RequestWithBody from '../types/request/requestWithBody';
import AddProductToCartRequest from '../types/cart/addProductToCartRequest';
import UpdateCartRequest from '../types/cart/updateCartRequest';
import DeleteProductFromCartRequest from '../types/cart/deleteProductFromCartRequest';
import GetCartRequest from '../types/cart/getCartRequest';

class CartController {
  async getCart(
    req: RequestWithBody<GetCartRequest>,
    res: TypedResponse<{ cart: ProductOnCart[] }>,
    next: NextFunction,
  ) {
    try {
      const { cartId } = req.body.user;

      if (!Number(cartId)) {
        return next(ApiError.badRequest('Error while get cart'));
      }

      const productOnCart: ProductOnCart[] = await prisma.productOnCart.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while get product'));
    }
  }

  async addProduct(
    req: RequestWithBody<AddProductToCartRequest>,
    res: TypedResponse<{ cart: ProductOnCart[] }>,
    next: NextFunction,
  ) {
    try {
      const { productId } = req.body;
      const { cartId } = req.body.user;

      if (!cartId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      await prisma.productOnCart.create({
        data: {
          count: 1,
          cartId: Number(cartId),
          productId: Number(productId),
          assignedBy: '',
        },
      });

      const productOnCart: ProductOnCart[] = await prisma.productOnCart.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while add product'));
    }
  }

  async deleteProduct(
    req: RequestWithBody<DeleteProductFromCartRequest>,
    res: TypedResponse<{ cart: ProductOnCart[] }>,
    next: NextFunction,
  ) {
    try {
      const { productId } = req.body;
      const { cartId } = req.body.user;

      if (!cartId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      await prisma.productOnCart.delete({
        where: {
          cartId_productId: {
            cartId,
            productId,
          },
        },
      });

      const productOnCart: ProductOnCart[] = await prisma.productOnCart.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while product deleting'));
    }
  }

  async update(
    req: RequestWithBody<UpdateCartRequest>,
    res: TypedResponse<{ cart: ProductOnCart[] }>,
    next: NextFunction,
  ) {
    try {
      const { productId, count } = req.body;
      const { cartId } = req.body.user;

      if (!cartId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      const product: Product | null = await prisma.product.findFirst({
        where: {
          id: Number(productId),
        },
      });

      if (!product) {
        return next(ApiError.badRequest(`The product ${productId} not existed`));
      }

      const realCount = count > product.stock ? product.stock : count;

      await prisma.productOnCart.update({
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

      const productOnCart: ProductOnCart[] = await prisma.productOnCart.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while add product'));
    }
  }
}

export default new CartController();
