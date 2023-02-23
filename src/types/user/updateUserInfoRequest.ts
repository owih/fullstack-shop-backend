import { User } from '@prisma/client';

type UpdateUserInfoRequest = {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  user: Partial<User>;
};

export default UpdateUserInfoRequest;
