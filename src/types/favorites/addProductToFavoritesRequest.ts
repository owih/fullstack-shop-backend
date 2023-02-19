import { User } from '@prisma/client';

type AddProductToFavoritesRequest = {
  favoritesId: number;
  productId: number;
  user: Partial<User>;
};

export default AddProductToFavoritesRequest;
