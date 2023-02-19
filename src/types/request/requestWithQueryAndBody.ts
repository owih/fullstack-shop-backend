import { Query } from 'express-serve-static-core';
import { Request } from 'express';

export interface RequestWithQueryAndBody<T extends Query, U> extends Request {
  query: T;
  body: U;
}
