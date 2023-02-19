import { User } from '@prisma/client';

type UpdateCartRequest = {
  cartId: number;
  productId: number;
  count: number,
  user: Partial<User>;
};

export default UpdateCartRequest;
