import ApiError from '../error/ApiError';
import prisma from '../prisma';
import { Cart } from '@prisma/client';
import { NextFunction } from 'express';
import { TypedResponse } from '../types/response/typedResponse';
import RequestWithBody from '../types/request/requestWithBody';
import RequestWithQuery from '../types/request/requestWithQuery';
import AddProductToCartRequest from '../types/cart/addProductToCartRequest';
import UpdateCartRequest from '../types/cart/updateCartRequest';
import DeleteProductFromCartRequest from '../types/cart/deleteProductFromCartRequest';

class CartController {
  async getCart(
    req: RequestWithQuery<{ id: string }>,
    res: TypedResponse<{ cart: Cart | null }>,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const fromTokenCartId = req.body.user.cartId;

      if (!Number(id)) {
        return next(ApiError.badRequest('Error while get cart'));
      }

      if (fromTokenCartId !== Number(id)) {
        return next(ApiError.badRequest('Error while get cart'));
      }

      const cart: Cart | null = await prisma.cart.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      return res.status(200).json({ cart });
    } catch (e) {
      return next(ApiError.internal('Error while get product'));
    }
  }

  async addProduct(
    req: RequestWithBody<AddProductToCartRequest>,
    res: TypedResponse<{ cart: Cart | null }>,
    next: NextFunction,
  ) {
    try {
      console.log(req.body);
      const { cartId, productId } = req.body;
      const fromTokenCartId = req.body.user.cartId;

      if (!cartId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      if (fromTokenCartId !== cartId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      await prisma.productOnCart.create({
        data: {
          cartId: Number(cartId),
          productId: Number(productId),
          assignedBy: '',
        },
      });

      const cart: Cart | null = await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
      });

      return res.status(200).json({ cart });
    } catch (e) {
      return next(ApiError.internal('Error while add product'));
    }
  }

  async deleteProduct(
    req: RequestWithBody<DeleteProductFromCartRequest>,
    res: TypedResponse<{ cart: Cart | null }>,
    next: NextFunction,
  ) {
    try {
      const { cartId, productId } = req.body;
      const fromTokenCartId = req.body.user.cartId;

      if (!cartId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      if (fromTokenCartId !== cartId) {
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

      const cart: Cart | null = await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
      });

      return res.status(200).json({ cart });
    } catch (e) {
      return next(ApiError.internal('Error while product deleting'));
    }
  }

  async update(
    req: RequestWithBody<UpdateCartRequest>,
    res: TypedResponse<{ cart: Cart | null }>,
    next: NextFunction,
  ) {
    try {
      const { cartId, productId, count } = req.body;
      const fromTokenCartId = req.body.user.cartId;

      if (!cartId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      if (fromTokenCartId !== cartId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      await prisma.productOnCart.update({
        where: {
          cartId_productId: {
            cartId,
            productId,
          },
        },
        data: {
          count,
        },
      });

      const cart: Cart | null = await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
      });

      return res.status(200).json({ cart });
    } catch (e) {
      return next(ApiError.internal('Error while add product'));
    }
  }
}

export default new CartController();
