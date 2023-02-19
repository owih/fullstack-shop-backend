import ApiError from '../error/ApiError';
import prisma from '../prisma';
import { Product } from '@prisma/client';
import { NextFunction } from 'express';
import { TypedResponse } from '../types/response/typedResponse';
import RequestWithBody from '../types/request/requestWithBody';
import RequestWithQuery from '../types/request/requestWithQuery';
import CreateProductRequest from '../types/product/createProductRequest';
import { RequestWithQueryAndBody } from '../types/request/requestWithQueryAndBody';
import DeleteProductRequest from '../types/product/deleteProductRequest';

class ProductController {
  async getAll(
    req: RequestWithQuery<{ type: string; limit: string; page: string }>,
    res: TypedResponse<{ products: Product[] }>,
    next: NextFunction,
  ) {
    try {
      const { type, limit, page } = req.query;

      const pageParsed: number = Number(page) || 1;
      const limitParsed: number = Number(limit) || 9;
      const offset: number = pageParsed * limitParsed - limitParsed;

      let products: Product[] = [];

      if (type) {
        products = await prisma.product.findMany({
          skip: offset,
          take: limitParsed,
          where: {
            type: {
              some: {
                type: {
                  name: {
                    equals: type,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        });
      }

      if (!type) {
        products = await prisma.product.findMany({
          skip: offset,
          take: limitParsed,
          include: {
            type: {
              include: {
                type: true,
              },
            },
          },
        });
      }

      return res.status(200).json({ products });
    } catch (e) {
      return next(ApiError.internal('Error while registration'));
    }
  }

  async getOne(
    req: RequestWithQuery<{ id: string }>,
    res: TypedResponse<{ product: Product | null }>,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      console.log(id);
      console.log(Number(id));

      if (!Number(id)) {
        return next(ApiError.badRequest('Incorrect id'));
      }

      const product: Product | null = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({ product });
    } catch (e) {
      return next(ApiError.internal('Error while get product'));
    }
  }

  async create(
    req: RequestWithBody<CreateProductRequest>,
    res: TypedResponse<{ product: Product | null }>,
    next: NextFunction,
  ) {
    try {
      const { name, sale, price, stock, description } = req.body;

      //TODO: Update product with type/images/size params

      if (!name || !price || !stock || !description) {
        return next(ApiError.badRequest('Incorrect data'));
      }

      const product: Product = await prisma.product.create({
        data: {
          name,
          price,
          stock,
          description,
          sale: sale || 0,
        },
      });

      return res.status(200).json({ product });
    } catch (e) {
      return next(ApiError.internal('Error while product create'));
    }
  }

  async delete(
    req: RequestWithQueryAndBody<{ id: string }, DeleteProductRequest>,
    res: TypedResponse<{ product: Product | null }>,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      console.log(id);
      console.log(Number(id));

      if (!Number(id)) {
        return next(ApiError.badRequest('Incorrect id'));
      }

      const product: Product = await prisma.product.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({ product });
    } catch (e) {
      return next(ApiError.internal('Error while product deleting'));
    }
  }
}

export default new ProductController();
