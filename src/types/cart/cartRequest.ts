import { User } from '@prisma/client';

type CartRequest = {
  user: Partial<User>;
};

export default CartRequest;
