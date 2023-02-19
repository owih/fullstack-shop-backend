import { User } from '@prisma/client';

type DeleteProductFromFavoritesRequest = {
  favoritesId: number;
  productId: number;
  count: number;
  user: Partial<User>;
};

export default DeleteProductFromFavoritesRequest;
