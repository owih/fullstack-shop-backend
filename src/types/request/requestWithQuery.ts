import { Request } from 'express';
import { Query } from 'express-serve-static-core';

interface RequestWithQuery<T extends Query> extends Request {
  query: T;
}

export default RequestWithQuery;
