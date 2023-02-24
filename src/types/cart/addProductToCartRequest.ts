import { User } from '@prisma/client';

type AddProductToCartRequest = {
  productId: number;
  user: Partial<User>;
};

export default AddProductToCartRequest;
