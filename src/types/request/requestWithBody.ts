import { Request } from 'express';

interface RequestWithBody<T> extends Request {
  body: T;
}

export default RequestWithBody;
