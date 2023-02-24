import { User } from '@prisma/client';

type UpdateCartRequest = {
  productId: number;
  count: number;
  user: Partial<User>;
};

export default UpdateCartRequest;
