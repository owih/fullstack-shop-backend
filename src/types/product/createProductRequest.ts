import { JwtPayload } from 'jsonwebtoken';

type CreateProductRequest = {
  name: string;
  type: string;
  price: number;
  sale?: number;
  description: string;
  stock: number;
  user: string | JwtPayload;
};

export default CreateProductRequest;
