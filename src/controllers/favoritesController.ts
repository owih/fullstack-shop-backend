import ApiError from '../error/ApiError';
import prisma from '../prisma';
import { ProductOnFavorites, User } from '@prisma/client';
import { NextFunction } from 'express';
import { TypedResponse } from '../types/response/typedResponse';
import RequestWithBody from '../types/request/requestWithBody';
import RequestWithQuery from '../types/request/requestWithQuery';
import AddProductToFavoritesRequest from '../types/favorites/addProductToFavoritesRequest';

class FavoritesController {
  async getFavorites(
    req: RequestWithQuery<{ id: string }>,
    res: TypedResponse<{ favorites: ProductOnFavorites[] }>,
    next: NextFunction,
  ) {
    try {
      const { favoritesId } = req.body.user;

      if (!favoritesId) {
        return next(ApiError.badRequest('Error while get favorites'));
      }

      const productOnFavorites: ProductOnFavorites[] =
        await prisma.productOnFavorites.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while get favorites'));
    }
  }

  async addProduct(
    req: RequestWithBody<AddProductToFavoritesRequest>,
    res: TypedResponse<{ favorites: ProductOnFavorites[] }>,
    next: NextFunction,
  ) {
    try {
      const { productId } = req.body;
      const { favoritesId } = req.body.user;

      if (!favoritesId || !Number(productId)) {
        return next(ApiError.badRequest('Error while add favorites'));
      }

      await prisma.productOnFavorites.create({
        data: {
          favoritesId: Number(favoritesId),
          productId: Number(productId),
          assignedBy: '',
        },
      });

      const productOnFavorites: ProductOnFavorites[] =
        await prisma.productOnFavorites.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while add favorites'));
    }
  }

  async deleteProduct(
    req: RequestWithQuery<{ id: string }>,
    res: TypedResponse<{ favorites: ProductOnFavorites[] }>,
    next: NextFunction,
  ) {
    try {
      const { id: productId } = req.params;
      const { favoritesId } = req.body.user;

      if (!favoritesId || !Number(productId)) {
        return next(ApiError.badRequest('Error while delete from favorites'));
      }

      await prisma.productOnFavorites.delete({
        where: {
          favoritesId_productId: {
            favoritesId,
            productId: Number(productId),
          },
        },
      });

      const productOnFavorites: ProductOnFavorites[] =
        await prisma.productOnFavorites.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while delete from favorites'));
    }
  }

  async clear(
    req: RequestWithBody<{ user: Partial<User> }>,
    res: TypedResponse<{ favorites: ProductOnFavorites[] }>,
    next: NextFunction,
  ) {
    try {
      const { favoritesId } = req.body.user;

      if (!favoritesId) {
        return next(ApiError.badRequest('Error while delete from favorites'));
      }

      await prisma.productOnFavorites.deleteMany({
        where: {
          favoritesId,
        },
      });

      const productOnFavorites: ProductOnFavorites[] =
        await prisma.productOnFavorites.findMany({
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
    } catch (e) {
      return next(ApiError.internal('Error while delete from favorites'));
    }
  }
}

export default new FavoritesController();
