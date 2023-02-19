import { User } from '@prisma/client';

type AddProductToCartRequest = {
  cartId: number;
  productId: number;
  user: Partial<User>;
};

export default AddProductToCartRequest;
