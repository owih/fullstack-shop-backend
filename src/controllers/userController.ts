import ApiError from '../error/ApiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import dotenv from 'dotenv';
import { Cart, Favorites, User } from '@prisma/client';
import { NextFunction } from 'express';
import RequestWithBody from '../types/request/requestWithBody';
import CreateUserRequest from '../types/user/createUserRequest';
import { TypedResponse } from '../types/response/typedResponse';

dotenv.config();

const generateJwt = ({ id, email, role, cartId, favoritesId }: Partial<User>): string => {
  return jwt.sign(
    { id, email, role, cartId, favoritesId },
    process.env.SECRET_KEY || 'secret',
    { expiresIn: '62h' },
  );
};

class UserController {
  async registration(
    req: RequestWithBody<CreateUserRequest>,
    res: TypedResponse<{ token: string } | { message: string }>,
    next: NextFunction,
  ) {
    try {
      const { email, password } = req.body;

      console.log('registration');
      console.log(req.body);

      if (!email || !password) {
        return next(ApiError.badRequest('Incorrect email or password'));
      }

      const userWithRequestEmail: User | null = await prisma.user.findFirst({
        where: { email },
      });

      if (userWithRequestEmail) {
        return next(ApiError.badRequest('This email already exist'));
      }

      const hashPassword: string = await bcrypt.hash(password, 3);

      const cart: Cart = await prisma.cart.create({ data: {} });
      const favorites: Favorites = await prisma.favorites.create({ data: {} });
      const user: User = await prisma.user.create({
        data: {
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
      });

      return res.status(200).json({ token });
    } catch (e) {
      console.log('catch');
      return next(ApiError.internal('Error while registration'));
    }
  }
  async login(
    req: RequestWithBody<CreateUserRequest>,
    res: TypedResponse<{ token: string }>,
    next: NextFunction,
  ) {
    console.log(req.body);
    try {
      const { email, password } = req.body;

      const user: User | null = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        return next(ApiError.badRequest('User not found'));
      }

      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return next(ApiError.internal('Wrong password'));
      }

      const token = generateJwt({
        id: user.id,
        email: user.email,
        role: user.role,
        cartId: user.cartId,
        favoritesId: user.favoritesId,
      });

      return res.status(200).json({ token });
    } catch (e) {
      return next(ApiError.internal('Error while login'));
    }
  }
  async check(
    req: RequestWithBody<{ user: Partial<User> }>,
    res: TypedResponse<{ token: string } | { message: string }>,
    next: NextFunction,
  ) {
    try {
      const { user } = req.body;

      const token = generateJwt({
        id: user.id,
        email: user.email,
        role: user.role,
        cartId: user.cartId,
        favoritesId: user.favoritesId,
      });

      return res.status(200).json({ token });
    } catch (e) {
      return next(ApiError.internal('Error while check'));
    }
  }
}

export default new UserController();
