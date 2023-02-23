import { User } from '@prisma/client';

type UpdateUserPasswordRequest = {
  oldPassword?: string;
  newPassword?: string;
  user: Partial<User>;
};

export default UpdateUserPasswordRequest;
