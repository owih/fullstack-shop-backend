import { JwtPayload } from 'jsonwebtoken';

type DeleteProductRequest = {
  user: string | JwtPayload;
};

export default DeleteProductRequest;
