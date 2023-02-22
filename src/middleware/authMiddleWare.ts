import jwt from 'jsonwebtoken';
import { TypedResponse } from '../types/response/typedResponse';
import { NextFunction, Request } from 'express';
import { User } from '@prisma/client';

export default (req: Request, res: TypedResponse<{ message: string }>, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    console.log('token');
    const token = req.headers?.authorization?.split(' ')[1];
    console.log(token);
    console.log(req.headers);

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.body.user = jwt.verify(token, process.env.SECRET_KEY || 'secret') as Partial<User>;
    console.log(req.body.user);
    console.log('req');

    next();
  } catch (e) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
