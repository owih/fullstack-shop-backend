import { User } from '@prisma/client';

type GetCartRequest = {
  user: Partial<User>;
};

export default GetCartRequest;
