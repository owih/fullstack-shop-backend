import ApiError from '../error/ApiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import dotenv from 'dotenv';
import { Cart, Favorites, User, UserInfo } from '@prisma/client';
import { NextFunction } from 'express';
import RequestWithBody from '../types/request/requestWithBody';
import CreateUserRequest from '../types/user/createUserRequest';
import { TypedResponse } from '../types/response/typedResponse';
import UpdateUserInfoRequest from '../types/user/updateUserInfoRequest';
import UpdateUserPasswordRequest from '../types/user/updateUserPasswordRequest';

dotenv.config();

const generateJwt = ({
  id,
  email,
  role,
  cartId,
  favoritesId,
  userInfoId,
}: Partial<User>): string => {
  return jwt.sign(
    { id, email, role, cartId, favoritesId, userInfoId },
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
      const { email, name, password } = req.body;

      console.log('registration');
      console.log(req.body);

      if (!email || !password || !name) {
        return next(ApiError.badRequest('Incorrect form data'));
      }

      const emailRegExp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const passwordLength = 6;
      const nameLength = 2;

      if (
        !emailRegExp.test(email) ||
        password.length < passwordLength ||
        name.length < nameLength
      ) {
        return next(ApiError.badRequest('Incorrect form data'));
      }

      const userWithRequestEmail: User | null = await prisma.user.findFirst({
        where: { email },
      });

      if (userWithRequestEmail) {
        return next(ApiError.badRequest('This email already exist'));
      }

      const hashPassword: string = await bcrypt.hash(password, 3);

      const userInfo: UserInfo = await prisma.userInfo.create({
        data: {
          name,
        },
      });
      const cart: Cart = await prisma.cart.create({ data: {} });
      const favorites: Favorites = await prisma.favorites.create({ data: {} });

      const user: User = await prisma.user.create({
        data: {
          userInfoId: userInfo.id,
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
        userInfoId: user.userInfoId,
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
        userInfoId: user.userInfoId,
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
        userInfoId: user.userInfoId,
      });

      return res.status(200).json({ token });
    } catch (e) {
      return next(ApiError.internal('Error while check'));
    }
  }

  async getInfo(
    req: RequestWithBody<{ user: Partial<User> }>,
    res: TypedResponse<{ userInfo: UserInfo | null }>,
    next: NextFunction,
  ) {
    console.log(req.body);
    try {
      const { id } = req.body.user;

      const user: User | null = await prisma.user.findFirst({
        where: { id },
      });

      if (!user) {
        return next(ApiError.badRequest('User not found'));
      }

      const userInfo: UserInfo | null = await prisma.userInfo.findFirst({
        where: {
          id: user.userInfoId,
        },
      });

      return res.status(200).json({ userInfo });
    } catch (e) {
      return next(ApiError.internal('Error while login'));
    }
  }

  async updateInfo(
    req: RequestWithBody<UpdateUserInfoRequest>,
    res: TypedResponse<{ token: string; userInfo: UserInfo }>,
    next: NextFunction,
  ) {
    console.log(req.body);
    try {
      const { name, address, country, city } = req.body;
      const { userInfoId } = req.body.user;

      console.log(req.body.user);

      const userInfo: UserInfo | null = await prisma.userInfo.findFirst({
        where: {
          id: userInfoId,
        },
      });
      console.log(userInfo, ' userInfo');

      const userInfoUpdated: UserInfo | null = await prisma.userInfo.update({
        where: {
          id: userInfoId,
        },
        data: {
          name: name || userInfo?.name,
          address: address || userInfo?.address,
          city: city || userInfo?.city,
          country: country || userInfo?.country,
        },
      });

      console.log(userInfoUpdated, ' userInfoUpdated');

      const token = generateJwt({
        id: req.body.user.id,
        email: req.body.user.email,
        role: req.body.user.role,
        cartId: req.body.user.cartId,
        favoritesId: req.body.user.favoritesId,
        userInfoId: req.body.user.userInfoId,
      });

      console.log(token, ' token');

      return res.status(200).json({ token, userInfo: userInfoUpdated });
    } catch (e) {
      console.log(e);
      return next(ApiError.internal('Error while login'));
    }
  }

  async updatePassword(
    req: RequestWithBody<UpdateUserPasswordRequest>,
    res: TypedResponse<{ token: string }>,
    next: NextFunction,
  ) {
    console.log(req.body);
    try {
      const { oldPassword, newPassword } = req.body;
      const { id } = req.body.user;

      if (!oldPassword || !newPassword || newPassword.length < 5) {
        return next(ApiError.internal('Incorrect password format'));
      }

      const user: User | null = await prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        return next(ApiError.internal('Something went wrong'));
      }

      const comparePassword = bcrypt.compareSync(oldPassword, user.password);

      if (!comparePassword) {
        return next(ApiError.internal('Incorrect password'));
      }

      const hashPassword: string = await bcrypt.hash(newPassword, 3);

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: hashPassword,
        },
      });

      const token = generateJwt({
        id: req.body.user.id,
        email: req.body.user.email,
        role: req.body.user.role,
        cartId: req.body.user.cartId,
        favoritesId: req.body.user.favoritesId,
        userInfoId: req.body.user.userInfoId,
      });

      return res.status(200).json({ token });
    } catch (e) {
      return next(ApiError.internal('Error while login'));
    }
  }
}

export default new UserController();
