import jwt, { JwtPayload } from 'jsonwebtoken';
import { TypedResponse } from '../types/response/typedResponse';
import { NextFunction } from 'express';
import RequestWithBody from '../types/request/requestWithBody';
import { Role, User } from '@prisma/client';

export default (role: Role) => {
  return (
    req: RequestWithBody<{ user: string | JwtPayload }>,
    res: TypedResponse<{ message: string }>,
    next: NextFunction,
  ) => {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers?.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY || 'secret',
      ) as Partial<User>;

      if (decoded.role !== role) {
        return res.status(401).json({ message: 'No access' });
      }

      req.body.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  };
};
