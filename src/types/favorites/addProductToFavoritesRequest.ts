import { User } from '@prisma/client';

type AddProductToFavoritesRequest = {
  productId: number;
  user: Partial<User>;
};

export default AddProductToFavoritesRequest;
