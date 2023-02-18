import Role from './userRole';

type User = {
  id: number;
  email: string;
  password: string;
  cartId: number;
  favoritesId: number;
  role: Role;
};

export default User;
