import jwt from 'jsonwebtoken';
import { TypedResponse } from '../types/response/typedResponse';
import { NextFunction, Request } from 'express';
import { User } from '@prisma/client';

export default (req: Request, res: TypedResponse<{ message: string }>, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.body.user = jwt.verify(token, process.env.SECRET_KEY || 'secret') as Partial<User>;

    next();
  } catch (e) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
