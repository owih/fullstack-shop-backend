type CreateProductRequest = {
  name: string;
  type: string;
  price: number;
  sale?: number;
  description: string;
  stock: number;
  sizes: string[];
  images?: File[];
};

export default CreateProductRequest;
