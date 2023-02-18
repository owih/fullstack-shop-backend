import ProductSize from '../types/productSize';

type Product = {
  id: number;
  name: string;
  type: string;
  price: number;
  sale?: number;
  description?: string;
  stock: number;
  sizes: ProductSize[];
  images?: string[];
};

export default Product;
