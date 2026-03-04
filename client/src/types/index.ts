export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  features?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
