import ApiError from '../error/ApiError';
import prisma from '../prisma';
import { Cart, Favorites } from '@prisma/client';
import { NextFunction } from 'express';
import { TypedResponse } from '../types/response/typedResponse';
import RequestWithBody from '../types/request/requestWithBody';
import RequestWithQuery from '../types/request/requestWithQuery';
import DeleteProductFromFavoritesRequest from '../types/favorites/deleteProductFavoritesCartRequest';
import AddProductToFavoritesRequest from '../types/favorites/addProductToFavoritesRequest';

class FavoritesController {
  async getFavorites(
    req: RequestWithQuery<{ id: string }>,
    res: TypedResponse<{ favorites: Favorites | null }>,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const fromTokenFavoritesId = req.body.user.cartId;

      if (!Number(id)) {
        return next(ApiError.badRequest('Error while get favorites'));
      }

      if (fromTokenFavoritesId !== Number(id)) {
        return next(ApiError.badRequest('Error while get favorites'));
      }

      const favorites: Favorites | null = await prisma.favorites.findUnique({
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

      return res.status(200).json({ favorites });
    } catch (e) {
      return next(ApiError.internal('Error while get product'));
    }
  }

  async addProduct(
    req: RequestWithBody<AddProductToFavoritesRequest>,
    res: TypedResponse<{ favorites: Favorites | null }>,
    next: NextFunction,
  ) {
    try {
      console.log(req.body);
      const { favoritesId, productId } = req.body;
      const fromTokenFavoritesId = req.body.user.cartId;

      if (!favoritesId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      if (fromTokenFavoritesId !== favoritesId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      await prisma.productOnFavorites.create({
        data: {
          favoritesId: Number(favoritesId),
          productId: Number(productId),
          assignedBy: '',
        },
      });

      const favorites: Favorites | null = await prisma.favorites.findUnique({
        where: {
          id: favoritesId,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      return res.status(200).json({ favorites });
    } catch (e) {
      return next(ApiError.internal('Error while add product'));
    }
  }

  async deleteProduct(
    req: RequestWithBody<DeleteProductFromFavoritesRequest>,
    res: TypedResponse<{ favorites: Favorites | null }>,
    next: NextFunction,
  ) {
    try {
      const { favoritesId, productId } = req.body;
      const fromTokenFavoritesId = req.body.user.cartId;

      if (!favoritesId || !productId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      if (fromTokenFavoritesId !== favoritesId) {
        return next(ApiError.badRequest('Error while add product'));
      }

      await prisma.productOnFavorites.delete({
        where: {
          favoritesId_productId: {
            favoritesId,
            productId,
          },
        },
      });

      const favorites: Favorites | null = await prisma.favorites.findUnique({
        where: {
          id: favoritesId,
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      return res.status(200).json({ favorites });
    } catch (e) {
      return next(ApiError.internal('Error while product deleting'));
    }
  }
}

export default new FavoritesController();
