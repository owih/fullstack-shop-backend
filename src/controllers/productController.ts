import ApiError from '../error/ApiError';
import prisma from '../prisma';
import * as uuid from 'uuid';
import { Product, ProductImage, ProductOnType, ProductType } from '@prisma/client';
import { NextFunction } from 'express';
import { TypedResponse } from '../types/response/typedResponse';
import RequestWithBody from '../types/request/requestWithBody';
import RequestWithQuery from '../types/request/requestWithQuery';
import CreateProductRequest from '../types/product/createProductRequest';
import { RequestWithQueryAndBody } from '../types/request/requestWithQueryAndBody';
import DeleteProductRequest from '../types/product/deleteProductRequest';
import path from 'path';
import { UploadedFile } from 'express-fileupload';

class ProductController {
  async getAll(
    req: RequestWithQuery<{ type: string; limit: string; page: string }>,
    res: TypedResponse<{ products: Product[]; count: number }>,
    next: NextFunction,
  ) {
    try {
      const { type, limit, page } = req.query;

      const pageParsed: number = Number(page) || 1;
      const limitParsed: number = Number(limit) || 9;
      const offset: number = pageParsed * limitParsed - limitParsed;

      let products: Product[] = [];
      let productsCount = 0;

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
        productsCount = await prisma.product.count();
      }

      return res.status(200).json({ products, count: productsCount || products.length });
    } catch (e) {
      return next(ApiError.internal('Error while get products'));
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
      console.log(req.body);
      console.log(req.files?.image);
      const { name, sale, price, stock, description, type } = req.body;
      const image = req.files?.image as UploadedFile;

      if (!name || !price || !stock || !description) {
        return next(ApiError.badRequest('Incorrect data'));
      }

      const searchProductWithRequestedName: Product | null = await prisma.product.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });

      if (searchProductWithRequestedName) {
        return next(ApiError.internal('The product is already exist'));
      }

      const productType: ProductType | null = await prisma.productType.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });

      const product: Product = await prisma.product.create({
        data: {
          name,
          price: Number(price),
          stock: Number(stock),
          description,
          sale: Number(sale) || 0,
        },
      });

      console.log(productType);
      if (productType) {
        await prisma.productOnType.create({
          data: {
            productId: product.id,
            typeId: productType.id,
            assignedBy: '',
          },
        });
      }

      if (!image) return;
      if (image.size > 3145728) {
        return next(ApiError.internal('Image size must be less then 3 MB'));
      }

      if (Array.isArray(image)) {
        for (let i = 0; i < image.length; i++) {
          const fileName = uuid.v4() + '.jpg';
          await image[i].mv(path.resolve(__dirname, '..', 'static', fileName));

          await prisma.productImage.create({
            data: {
              name: product.name,
              productId: product.id,
              url: fileName,
            },
          });
        }
      } else {
        const fileName = uuid.v4() + '.jpg';
        await image.mv(path.resolve(__dirname, '..', 'static', fileName));

        await prisma.productImage.create({
          data: {
            name: product.name,
            productId: product.id,
            url: fileName,
          },
        });
      }

      return res.status(200).json({ product });
    } catch (e) {
      console.log(e);
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
